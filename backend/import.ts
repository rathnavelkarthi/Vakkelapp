import {readFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createApp} from '../server.ts';
export function importRecords(db:any,payload:any){
 if(!Array.isArray(payload.sources)||!Array.isArray(payload.records))throw new Error('Expected sources and records arrays.');
 const https=(s:any)=>{try{return new URL(s).protocol==='https:';}catch{return false;}};
 const validDate=(s:any)=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}/.test(s)&&!Number.isNaN(Date.parse(s));
 for(const s of payload.sources)if(!s.id||!s.name||!https(s.url)||!['official','licensed','secondary'].includes(s.kind)||!s.permission?.trim())throw new Error('Each source requires identity, HTTPS URL, source kind and documented permission.');
 for(const r of payload.records){if(!r.id||!r.title||!r.court||!r.body||!['case','judgment','statute'].includes(r.type)||!https(r.source_url)||!validDate(r.decision_date)||!validDate(r.retrieved_at)||!validDate(r.verified_at)||!['source_checked','unverified'].includes(r.status))throw new Error('Record is missing required provenance or valid dates.');if(!payload.sources.some((s:any)=>s.id===r.source_id)&&!db.prepare('SELECT id FROM sources WHERE id=?').get(r.source_id))throw new Error('Unknown source.');if(r.checksum!==createHash('sha256').update(r.body).digest('hex'))throw new Error('Content checksum mismatch.');}
 db.exec('BEGIN');try{for(const s of payload.sources)db.prepare('INSERT INTO sources VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,url=excluded.url,kind=excluded.kind,permission=excluded.permission').run(s.id,s.name,s.url,s.kind,s.permission);for(const r of payload.records)db.prepare('INSERT INTO records VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET type=excluded.type,title=excluded.title,court=excluded.court,decision_date=excluded.decision_date,body=excluded.body,source_id=excluded.source_id,source_url=excluded.source_url,checksum=excluded.checksum,retrieved_at=excluded.retrieved_at,verified_at=excluded.verified_at,status=excluded.status').run(r.id,r.type,r.title,r.court,r.decision_date,r.body,r.source_id,r.source_url,r.retrieved_at,r.verified_at,r.checksum,r.status);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename)){
 if(!process.argv[2])throw new Error('Usage: node backend/import.ts path/to/authorised-records.json');
 const base=resolve(import.meta.dirname,'..');mkdirSync(resolve(base,'.runtime'),{recursive:true});const {db}=createApp(process.env.DATABASE_PATH||resolve(base,'.runtime/legal-os.sqlite'));
 try{const payload=JSON.parse(readFileSync(process.argv[2],'utf8'));importRecords(db,payload);console.log(`Imported ${payload.records.length} records.`);}finally{db.close();}
}
