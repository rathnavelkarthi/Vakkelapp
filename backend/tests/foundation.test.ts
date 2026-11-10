import {test} from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createApp} from '../../server.ts';import {importRecords} from '../import.ts';
async function setup(){const {server,db}=createApp();await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const port=(server.address() as any).port;return {server,db,url:`http://127.0.0.1:${port}`,close:()=>new Promise<void>(r=>server.close(()=>{db.close();r();}))};}
test('authentication, private saved research, and cross-account isolation',async()=>{const app=await setup();try{
 const post=(path:string,data:any,cookie='')=>fetch(app.url+path,{method:'POST',headers:{'content-type':'application/json',cookie},body:JSON.stringify(data)});
 assert.equal((await fetch(app.url+'/api/saved')).status,401);
 assert.equal((await post('/api/auth/register',{name:'A',email:'a@test.invalid',password:'short'})).status,400);
 async function account(email:string){assert.equal((await post('/api/auth/register',{name:'Test account',email,password:'strong-test-password'})).status,201);const r=await post('/api/auth/login',{email,password:'strong-test-password'});assert.equal(r.status,200);const cookie=r.headers.get('set-cookie')!.split(';')[0];assert.match(r.headers.get('set-cookie')!,/HttpOnly/);return cookie;}
 const a=await account('a@test.invalid'),b=await account('b@test.invalid');
 const saved=await post('/api/saved',{query:'private query'},a);assert.equal(saved.status,201);const {id}=await saved.json();
 const items=await (await fetch(app.url+'/api/saved',{headers:{cookie:b}})).json();assert.equal(items.items.length,0);
 assert.equal((await fetch(app.url+'/api/saved/'+id,{method:'DELETE',headers:{cookie:b,'content-type':'application/json'},body:'{}'})).status,404);
 assert.equal((await (await fetch(app.url+'/api/saved',{headers:{cookie:a}})).json()).items.length,1);
 assert.equal((await fetch(app.url+'/api/saved',{method:'POST',headers:{cookie:a,origin:'https://attacker.invalid','content-type':'application/json'},body:'{"query":"x"}'})).status,403);
 await post('/api/auth/logout',{},a);assert.equal((await fetch(app.url+'/api/me',{headers:{cookie:a}})).status,401);
 }finally{await app.close();}});
test('source import requires provenance, validates checksum, and search returns only imported records',async()=>{const app=await setup();try{const empty=await (await fetch(app.url+'/api/search?q=bail')).json();assert.equal(empty.total,0);
 const body='TEST FIXTURE ONLY — not a legal authority. Legal research fixture.';
 const payload={sources:[{id:'fixture',name:'TEST FIXTURE — not an actual court source',url:'https://example.invalid',kind:'secondary',permission:'Test-only fictional data, never for production'}],records:[{id:'test-record',type:'judgment',title:'TEST FIXTURE — research test',court:'Test court',decision_date:'2025-01-01',body,source_id:'fixture',source_url:'https://example.invalid/test',retrieved_at:'2026-01-01',verified_at:'2026-01-01',checksum:createHash('sha256').update(body).digest('hex'),status:'unverified'}]};
 const invalid=structuredClone(payload);invalid.records[0].checksum='bad';assert.throws(()=>importRecords(app.db,invalid),/checksum/);assert.equal((app.db.prepare('SELECT count(*) n FROM sources').get() as any).n,0);
 importRecords(app.db,payload);const result=await(await fetch(app.url+'/api/search?q=fixture&type=judgment')).json();assert.equal(result.total,1);assert.equal(result.results[0].source_name,payload.sources[0].name);assert.equal(result.results[0].status,'unverified');assert.equal((await fetch(app.url+'/api/cases/missing')).status,404);
 assert.equal((await fetch(app.url+'/api/assistant',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).status,503);
 }finally{await app.close();}});
