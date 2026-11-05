import test from 'node:test';
import assert from 'node:assert/strict';
import { KEY, defaults } from '../js/core.mjs';
import { load, save, reset, PREVIOUS_DATA_KEY } from '../js/storage.mjs';
import { fixtureDatabase } from './fixtures.mjs';

let values = new Map();
global.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value))
};

test('primeira abertura inicia sem dados de exemplo', () => {
  values = new Map();
  const db = load();
  for (const field of ['employees', 'departments', 'assignments', 'daysOff', 'requests', 'audit']) {
    assert.deepEqual(db[field], []);
  }
  assert.deepEqual(db.rules, {});
  assert.deepEqual(db.publications, {});
  assert.equal(db.shifts.length, 3);
});

test('limpeza inicial guarda os dados antigos e só ocorre uma vez', () => {
  const previous = JSON.stringify(fixtureDatabase());
  values = new Map([[KEY, previous]]);
  const empty = load();
  assert.deepEqual(empty.employees, []);
  assert.deepEqual(empty.departments, []);
  assert.equal(values.get(PREVIOUS_DATA_KEY), previous);
  assert.equal(JSON.parse(values.get(KEY)).initializationVersion, 1);

  empty.departments.push({ id: 1, name: 'Meu setor' });
  empty.employees.push({ id: 2, name: 'Meu cadastro', departmentId: 1 });
  save(empty);
  assert.deepEqual(load(), empty);
  assert.equal(values.get(PREVIOUS_DATA_KEY), previous);
});

test('backup importado e salvo passa a ser preservado', () => {
  values = new Map();
  const imported = fixtureDatabase();
  save(imported);
  assert.equal(load().employees.length, imported.employees.length);
  assert.equal(values.has(PREVIOUS_DATA_KEY), false);
});

test('limpar dados retorna uma base vazia sem recriar exemplos', () => {
  values = new Map();
  save(fixtureDatabase());
  const cleared = reset();
  assert.deepEqual(cleared.employees, []);
  assert.deepEqual(cleared.departments, []);
  assert.deepEqual(cleared.requests, []);
  assert.deepEqual(load(), cleared);
  assert.equal(cleared.shifts.length, defaults().shifts.length);
});
