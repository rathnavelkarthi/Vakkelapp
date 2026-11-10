import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Vakeelapp — Your legal clarity starts here",
};
export const viewport: Viewport = { themeColor: "#f5f5f7" };

const researchStarters = [
  { query: "Anticipatory bail", icon: "file" },
  { query: "Section 138", icon: "book" },
  { query: "Property rights", icon: "home" },
];

export default function WorkspacePage() {
  return (
    <>
      <link rel="stylesheet" href="/assets/style.css" precedence="page" />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar-start">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="sidebar-toggle"
              id="sidebar-toggle"
              aria-controls="workspace-sidebar"
              aria-expanded={true}
              aria-label="Hide sidebar"
              title="Hide sidebar"
              disabled
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M9 4v16" />
                <path className="sidebar-toggle-panel" d="M6 5h2v14H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="currentColor" stroke="none" />
              </svg>
            </Button>
            <div className="breadcrumb">
              <span className="breadcrumb-prefix" aria-hidden="true">Workspace <span>/</span></span>
              <strong id="breadcrumb">AI legal assistant</strong>
            </div>
          </div>
          <div className="top-actions">
            <label className="language">
              <span data-icon="globe"></span>
              <select id="language" aria-label="Interface language">
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
                <option value="hi">हिन्दी</option>
              </select>
            </label>
            <Button type="button" variant="outline" className="sign-in" id="signin">
              <span id="signin-label">Sign in</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 17 10-10M7 7h10v10" />
              </svg>
            </Button>
          </div>
        </header>
        <aside className="sidebar" id="workspace-sidebar" aria-label="Workspace sidebar">
          <a className="brand" href="/" aria-label="Vakeelapp home">
            <span className="brand-mark">
              v<span>•</span>
            </span>
            <span>
              Vakeelapp<span className="brand-os">.</span>
              <small>INTELLIGENCE. WITH INTEGRITY.</small>
            </span>
          </a>
          <div className="workspace">
            <span className="workspace-icon">P</span>
            <span className="od-field">
              <strong>Personal workspace</strong>
              <small>Public legal services</small>
            </span>
            <span className="workspace-lock" aria-label="Private workspace">
              ⌑
            </span>
          </div>
          <p className="nav-label">WORKSPACE</p>
          <nav id="navigation" aria-label="Workspace tools">
            <button
              className="nav-item active"
              aria-current="page"
              data-view="assistant"
              data-icon="spark"
            >
              AI legal assistant
            </button>
            <button
              className="nav-item"
              data-view="home"
              data-icon="home"
            >
              Overview
            </button>
            <button className="nav-item" data-view="search" data-icon="search">
              Legal search
            </button>
            <button className="nav-item" data-view="statutes" data-icon="book">
              Acts & legislation
            </button>
            <button className="nav-item" data-view="saved" data-icon="bookmark">
              Saved research
            </button>
            <div className="nav-divider"></div>
            <p className="nav-label">YOUR LEGAL SPACE</p>
            <button
              className="nav-item"
              data-view="documents"
              data-icon="folder"
            >
              Document locker<span className="private-dot"></span>
            </button>
            <button
              className="nav-item"
              data-view="tracking"
              data-icon="activity"
            >
              Tracked cases
            </button>
          </nav>
          <div className="sidebar-bottom">
            <div className="pro-box">
              <span className="eyebrow">FOR LEGAL PROFESSIONALS</span>
              <h3>Your practice. Connected.</h3>
              <p>
                Research, matters and your team. One professional workspace.
              </p>
              <button id="professional">
                Explore professional tools <span>↗</span>
              </button>
            </div>
            <button className="profile" id="profile">
              <span className="avatar">G</span>
              <span className="od-field">
                <strong id="profile-name">Guest workspace</strong>
                <small id="profile-sub">Sign in to save your work</small>
              </span>
              <span>↗</span>
            </button>
          </div>
        </aside>
        <div className="main-shell">
          <main id="main" tabIndex={-1}>
            <section id="assistant-view" className="assistant-view">
              <div className="assistant-masthead">
                <div className="assistant-masthead-content">
                  <div>
                    <h1>What would you like to research?</h1>
                    <p className="assistant-intro">
                      Start with a legal topic, case name, or section number.
                    </p>
                  </div>
                  <svg
                    className="assistant-illustration"
                    width="216"
                    height="152"
                    viewBox="0 0 216 152"
                    fill="none"
                    aria-hidden="true"
                  >
                    <g stroke="currentColor" opacity=".2">
                      <circle cx="108" cy="76" r="72" />
                      <circle cx="108" cy="76" r="55" />
                      <path d="M16 76h184M108 0v152" />
                    </g>
                    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="72" y="42" width="60" height="78" rx="8" transform="rotate(-12 102 81)" className="assistant-illustration-sheet" opacity=".55" />
                      <rect x="82" y="32" width="62" height="82" rx="8" className="assistant-illustration-sheet" />
                      <path d="M95 63h36m-36 12h36m-36 12h23" opacity=".65" />
                      <path d="M118 33v20l6-4 6 4V33" className="assistant-illustration-tab" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="assistant-start">
                <form id="assistant-form" className="assistant-composer" method="post">
                  <label htmlFor="ai-question">Research question</label>
                  <textarea
                    id="ai-question"
                    name="question"
                    autoComplete="off"
                    rows={3}
                    maxLength={200}
                    placeholder="For example, tenancy deposit"
                    aria-describedby="assistant-availability"
                    aria-keyshortcuts="/"
                  />
                  <p className="form-error" id="assistant-error" role="alert" hidden>
                    Enter a topic, case name, or section number to search.
                  </p>
                  <div className="assistant-composer-actions">
                    <span className="assistant-keyhint"><kbd>/</kbd> to focus</span>
                    <Button type="submit" className="primary" disabled>
                      Search legal records
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 14 0m-6-6 6 6-6 6" />
                      </svg>
                    </Button>
                  </div>
                </form>
                <p id="assistant-availability" className="assistant-availability">
                  Live AI answers are unavailable. Search uses records imported into this workspace.
                </p>
                <div className="assistant-starters">
                  <h2>Try a topic</h2>
                  <div className="assistant-starter-row">
                    {researchStarters.map(({ query, icon }) => (
                      <Button
                        key={query}
                        type="button"
                        variant="outline"
                        className="assistant-starter"
                        data-starter-query={query}
                        disabled
                      >
                        <span data-icon={icon}></span>
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <section id="home-view" hidden>
              <div className="page-heading">
                <div>
                  <h1>Clarity in a complex legal world.</h1>
                  <p>
                    Find the law. Understand your rights. Move forward with
                    confidence.
                  </p>
                </div>
                <span className="india-badge">
                  <span className="india-lines"></span>Built for Indian law
                </span>
              </div>
              <section className="search-hero">
                <h2>
                  Every legal question deserves
                  <br />a clear starting point.
                </h2>
                <p>
                  Search cases, explore judgments, or ask a question in your own
                  words.
                </p>
                <div
                  className="hero-tabs"
                  role="radiogroup"
                  aria-label="Search category"
                >
                  <label>
                    <input
                      type="radio"
                      name="search-category"
                      value="all"
                      defaultChecked
                    />
                    <span>All legal resources</span>
                  </label>
                  <label>
                    <input type="radio" name="search-category" value="case" />
                    <span>Cases</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="search-category"
                      value="judgment"
                    />
                    <span>Judgments</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="search-category"
                      value="statute"
                    />
                    <span>Legislation</span>
                  </label>
                </div>
                <label className="sr-only" htmlFor="main-query">
                  Search legal information
                </label>
                <div className="search-input">
                  <span data-icon="search"></span>
                  <Input
                    type="search"
                    id="main-query"
                    placeholder="Ask a legal question, enter a case number or search a topic…"
                  />
                  <kbd>/</kbd>
                  <Button type="button" id="main-search">
                    Search <span aria-hidden="true">↗</span>
                  </Button>
                </div>
                <div className="suggestions">
                  <span>Try searching</span>
                  {researchStarters.map(({ query }) => (
                    <button key={query} data-query={query}>{query} ↗</button>
                  ))}
                </div>
                <div className="hero-foot">
                  <span data-icon="shield"></span>Traceable sources. Transparent
                  limitations. Always.
                </div>
                <svg
                  className="hero-decoration"
                  viewBox="0 0 240 220"
                  aria-hidden="true"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="160" cy="105" r="85" />
                    <circle cx="160" cy="105" r="65" />
                    <circle cx="160" cy="105" r="45" />
                    <path d="M40 105h200M160 0v220M100 45l120 120M100 165L220 45" />
                  </g>
                </svg>
              </section>
              <div className="section-title">
                <h2>One workspace. More possibilities.</h2>
                <span>Built around the way you research</span>
              </div>
              <div className="tool-grid">
                <button className="tool-card" data-open="assistant">
                  <div className="tool-top">
                    <span className="tool-icon" data-icon="spark"></span>
                    <span className="feature-label">RESEARCH ASSISTANT</span>
                    <span className="card-arrow">↗</span>
                  </div>
                  <h3>A little less legalese.</h3>
                  <p>
                    Explore legal questions with clear explanations and
                    evidence-backed research.
                  </p>
                  <span className="text-link">
                    Ask a legal question <span>→</span>
                  </span>
                </button>
                <button className="tool-card" data-open="documents">
                  <div className="tool-top">
                    <span className="tool-icon blue" data-icon="file"></span>
                    <span className="feature-label">DOCUMENT INTELLIGENCE</span>
                    <span className="card-arrow">↗</span>
                  </div>
                  <h3>Make sense of the fine print.</h3>
                  <p>
                    Understand notices, agreements and orders in your private
                    document workspace.
                  </p>
                  <span className="text-link">
                    Explore document tools <span>→</span>
                  </span>
                </button>
                <button className="tool-card" data-open="statutes">
                  <div className="tool-top">
                    <span className="tool-icon gold" data-icon="book"></span>
                    <span className="feature-label">ACTS & LEGISLATION</span>
                    <span className="card-arrow">↗</span>
                  </div>
                  <h3>Get to the letter of the law.</h3>
                  <p>
                    Find Indian acts and sections, with original text and source
                    references.
                  </p>
                  <span className="text-link">
                    Explore legislation <span>→</span>
                  </span>
                </button>
              </div>
              <div className="lower-grid">
                <section className="research-panel">
                  <div className="panel-header">
                    <h2>Pick up where you left off</h2>
                    <button data-open="saved">
                      View all <span>→</span>
                    </button>
                  </div>
                  <div className="research-empty">
                    <span className="empty-icon" data-icon="bookmark"></span>
                    <div>
                      <h3>Your next insight starts here.</h3>
                      <p>
                        Saved searches will appear here. Sign in to keep your
                        research together.
                      </p>
                      <button id="start-saving">
                        Start your research <span>→</span>
                      </button>
                    </div>
                  </div>
                </section>
                <section className="trust-panel">
                  <h3>
                    Know where your
                    <br />
                    answers come from.
                  </h3>
                  <p>
                    Original sources, clear verification status and a
                    distinction between legal records and AI analysis.
                  </p>
                  <button id="trust-more">
                    Our approach to trustworthy research <span>↗</span>
                  </button>
                </section>
              </div>
              <div className="principles">
                <span>
                  <i data-icon="lock"></i>Private by design
                </span>
                <span>
                  <i data-icon="check"></i>Source-linked research
                </span>
                <span>
                  <i data-icon="globe"></i>Made for a multilingual India
                </span>
                <span className="availability">
                  Foundation release <span className="status-dot"></span>
                </span>
              </div>
            </section>
            <section id="dynamic-view" hidden></section>
            <footer>
              <span>
                Vakeelapp <span className="footer-separator">/</span> Legal
                intelligence, thoughtfully connected.
              </span>
              <p>
                Legal information and research assistance. Not a substitute for
                qualified legal advice.
              </p>
            </footer>
          </main>
        </div>
      </div>
      <dialog id="modal" aria-labelledby="modal-title">
        <button className="modal-close" aria-label="Close dialog">
          ×
        </button>
        <div id="modal-content"></div>
      </dialog>
      <div id="toast" role="status" hidden></div>
      <Script src="/assets/app.js" strategy="afterInteractive" />
    </>
  );
}
