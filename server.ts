import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { DatabaseSync } from "node:sqlite";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
export function createApp(dbPath = ":memory:") {
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,salt TEXT NOT NULL,password TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sources(id TEXT PRIMARY KEY,name TEXT NOT NULL,url TEXT NOT NULL,kind TEXT NOT NULL,permission TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY,type TEXT NOT NULL,title TEXT NOT NULL,court TEXT NOT NULL,decision_date TEXT NOT NULL,body TEXT NOT NULL,source_id TEXT NOT NULL REFERENCES sources(id),source_url TEXT NOT NULL,retrieved_at TEXT NOT NULL,verified_at TEXT NOT NULL,checksum TEXT NOT NULL,status TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS saved(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),title TEXT NOT NULL,query TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,user_id TEXT,action TEXT NOT NULL,created_at TEXT NOT NULL);
 `);
  const uid = () => randomBytes(16).toString("hex");
  const audit = (user: string | null, action: string) =>
    db
      .prepare("INSERT INTO audit VALUES(?,?,?,?)")
      .run(uid(), user, action, new Date().toISOString());
  async function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url || "/", "http://localhost");
    const path = url.pathname;
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
    );
    const send = (status: number, data: unknown) => {
      res.writeHead(status, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify(data));
    };
    const cookie = req.headers.cookie
      ?.split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith("legal_session="))
      ?.split("=")[1];
    const hash = (s: string) => createHash("sha256").update(s).digest("hex");
    const session = cookie
      ? db
          .prepare(
            "SELECT users.id,users.name,users.email FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=? AND expires>?",
          )
          .get(hash(cookie), Date.now())
      : null;
    try {
      if (
        path.startsWith("/api/") &&
        !["GET", "HEAD"].includes(req.method || "GET")
      ) {
        const origin = req.headers.origin;
        if (
          origin &&
          origin !== `http://${req.headers.host}` &&
          origin !== `https://${req.headers.host}`
        )
          return send(403, {
            error: "Cross-origin requests are not permitted.",
          });
        if (req.headers["content-type"] !== "application/json")
          return send(415, { error: "Use application/json." });
      }
      let body: any = {};
      if (["POST", "DELETE"].includes(req.method || "")) {
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 1000000)
            return send(413, { error: "Request exceeds 1 MB." });
        }
        try {
          body = JSON.parse(raw || "{}");
        } catch {
          return send(400, { error: "Invalid JSON." });
        }
      }
      if (path === "/api/health")
        return send(200, {
          status: "ok",
          storage: "sqlite",
          legalConnectors: "not_configured",
          ai: "not_configured",
        });
      if (path === "/api/auth/register" && req.method === "POST") {
        const { email, password, name } = body;
        if (
          typeof email !== "string" ||
          !/^\S+@\S+\.\S+$/.test(email) ||
          typeof password !== "string" ||
          password.length < 12 ||
          password.length > 256 ||
          typeof name !== "string" ||
          !name.trim() ||
          name.length > 100
        )
          return send(400, {
            error:
              "Enter a name, valid email, and password of 12–256 characters.",
          });
        const salt = uid(),
          id = uid();
        try {
          db.prepare("INSERT INTO users VALUES(?,?,?,?,?)").run(
            id,
            email.toLowerCase().trim(),
            name.trim(),
            salt,
            scryptSync(password, salt, 64).toString("hex"),
          );
        } catch {
          return send(409, {
            error: "Unable to create this account. Try signing in.",
          });
        }
        audit(id, "account.created");
        return send(201, { message: "Account created. You can now sign in." });
      }
      if (path === "/api/auth/login" && req.method === "POST") {
        const u = db.prepare("SELECT * FROM users WHERE email=?").get(
          String(body.email || "")
            .toLowerCase()
            .trim(),
        ) as any;
        const candidate = scryptSync(
          String(body.password || "").slice(0, 256),
          u?.salt || "unknown",
          64,
        );
        if (!u || !timingSafeEqual(candidate, Buffer.from(u.password, "hex")))
          return send(401, { error: "Email or password is incorrect." });
        const token = randomBytes(32).toString("hex");
        db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
          hash(token),
          u.id,
          Date.now() + 86400000,
        );
        res.setHeader(
          "Set-Cookie",
          `legal_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${process.env.COOKIE_SECURE === "true" ? "; Secure" : ""}`,
        );
        audit(u.id, "session.created");
        return send(200, { id: u.id, name: u.name, email: u.email });
      }
      if (path === "/api/auth/logout" && req.method === "POST") {
        if (cookie)
          db.prepare("DELETE FROM sessions WHERE token=?").run(hash(cookie));
        res.setHeader(
          "Set-Cookie",
          "legal_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
        );
        return send(200, { message: "Signed out." });
      }
      if (path === "/api/me")
        return session
          ? send(200, session)
          : send(401, { error: "Sign in to access your private workspace." });
      if (path === "/api/search") {
        const q = (url.searchParams.get("q") || "").slice(0, 200),
          type = url.searchParams.get("type") || "all",
          court = url.searchParams.get("court") || "";
        const page = Math.max(
          1,
          Math.min(10000, Number(url.searchParams.get("page")) || 1),
        );
        const filter =
          "WHERE (?='all' OR type=?) AND (?='' OR court=?) AND (instr(lower(title),lower(?))>0 OR instr(lower(body),lower(?))>0)";
        const args = [type, type, court, court, q, q];
        const total = (
          db
            .prepare(`SELECT count(*) AS n FROM records ${filter}`)
            .get(...args) as any
        ).n;
        const results = db
          .prepare(
            `SELECT records.*,sources.name source_name,sources.kind source_kind FROM records JOIN sources ON source_id=sources.id ${filter} ORDER BY decision_date DESC LIMIT 10 OFFSET ?`,
          )
          .all(...args, (page - 1) * 10);
        return send(200, {
          results,
          total,
          page,
          pageSize: 10,
          connectorsConfigured: false,
        });
      }
      if (path.startsWith("/api/cases/")) {
        const record = db
          .prepare(
            "SELECT records.*,sources.name source_name FROM records JOIN sources ON source_id=sources.id WHERE records.id=?",
          )
          .get(decodeURIComponent(path.slice(11)));
        return record
          ? send(200, record)
          : send(404, { error: "Record not found." });
      }
      if (path === "/api/sources")
        return send(200, {
          sources: db.prepare("SELECT * FROM sources").all(),
          message:
            "Live connectors are not configured. Imported records must have documented usage permission.",
        });
      if (path === "/api/saved") {
        if (!session)
          return send(401, { error: "Sign in to save your research." });
        if (req.method === "GET")
          return send(200, {
            items: db
              .prepare(
                "SELECT id,title,query,created_at FROM saved WHERE user_id=? ORDER BY created_at DESC",
              )
              .all(session.id),
          });
        if (req.method === "POST") {
          if (
            typeof body.query !== "string" ||
            !body.query.trim() ||
            body.query.length > 200
          )
            return send(400, { error: "Enter a search of 1–200 characters." });
          const id = uid();
          db.prepare("INSERT INTO saved VALUES(?,?,?,?,?)").run(
            id,
            session.id,
            body.query.trim(),
            body.query.trim(),
            new Date().toISOString(),
          );
          audit(String(session.id), "research.saved");
          return send(201, { id });
        }
      }
      if (path.startsWith("/api/saved/") && req.method === "DELETE") {
        if (!session) return send(401, { error: "Sign in first." });
        const r = db
          .prepare("DELETE FROM saved WHERE id=? AND user_id=?")
          .run(path.slice(11), session.id);
        return r.changes
          ? send(200, { message: "Deleted." })
          : send(404, { error: "Saved research not found." });
      }
      if (path === "/api/assistant")
        return send(503, {
          error:
            "Evidence-backed AI research is not configured. No answer has been generated.",
        });
      return send(404, { error: "Endpoint not found." });
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Request error");
      send(500, { error: "The request could not be completed." });
    }
  }
  return { server: createServer(handleRequest), db, handleRequest };
}
