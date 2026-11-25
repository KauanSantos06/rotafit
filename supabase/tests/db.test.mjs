import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
const SUPABASE = fileURLToPath(new URL('..', import.meta.url));
const ALICE = '11111111-1111-1111-1111-111111111111';
const BOB = '22222222-2222-2222-2222-222222222222';
const SUPABASE_STUBS = `
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role anon nologin;
create role authenticated nologin;
grant usage on schema public, auth to anon, authenticated;
insert into auth.users (id) values ('${ALICE}'), ('${BOB}');
`;
let db;
before(async () => {
  db = new PGlite();
  await db.exec(SUPABASE_STUBS);
  await db.exec(readFileSync(`${SUPABASE}/schema.sql`, 'utf8'));
});
after(async () => { await db.close(); });
async function as(uid, fn) {
  await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${uid ?? ''}', false);`);
  try { return await fn(); } finally { await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`); }
}
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const rows = async (sql, params = []) => (await db.query(sql, params)).rows;
const sampleRoute = JSON.stringify([{ lat: -15.7997, lng: -47.8645, t: 0 }, { lat: -15.7969, lng: -47.8756, t: 300000 }]);
async function insertRun(uid, overrides = {}) {
  const r = { started_at: '2026-09-20T10:00:00Z', ended_at: '2026-09-20T10:30:00Z', distance_meters: 5000, duration_seconds: 1800, avg_pace_sec_per_km: 360, route: sampleRoute, spotify_track_name: 'Alive — Pearl Jam', ...overrides };
  return as(uid, async () => {
    const row = await one(`insert into runs (user_id, started_at, ended_at, distance_meters, duration_seconds, avg_pace_sec_per_km, route, spotify_track_name) values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8) returning id`, [uid, r.started_at, r.ended_at, r.distance_meters, r.duration_seconds, r.avg_pace_sec_per_km, r.route, r.spotify_track_name]);
    return row.id;
  });
}
describe('segurança e privacidade', () => {
  it('cada usuário só lê as próprias corridas', async () => {
    const id = await insertRun(ALICE);
    assert.equal((await as(ALICE, () => rows('select id from runs where id = $1', [id]))).length, 1);
    assert.equal((await as(BOB, () => rows('select id from runs where id = $1', [id]))).length, 0);
  });
});
describe('restrições dos dados', () => {
  it('recusa distância negativa', async () => await assert.rejects(insertRun(ALICE, { distance_meters: -1 }), /distance_meters/));
});
describe('weekly_stats', () => {
  it('soma só as corridas da semana atual', async () => {
    const now = await one('select now() as now');
    const started = now.now.toISOString();
    await insertRun(ALICE, { started_at: started, ended_at: started, distance_meters: 3000, duration_seconds: 900 });
    const alice = await as(ALICE, () => one('select * from weekly_stats()'));
    assert.equal(Number(alice.total_distance_meters), 3000);
  });
});
