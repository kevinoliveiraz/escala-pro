import { KEY, defaults, ensure } from './core.mjs';

export const PREVIOUS_DATA_KEY = KEY + '-before-empty-start-v1';

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const data = ensure(JSON.parse(raw));
    if (data.initializationVersion !== 1) {
      // Start clean once; keep the previous database available for recovery.
      if (!localStorage.getItem(PREVIOUS_DATA_KEY)) localStorage.setItem(PREVIOUS_DATA_KEY, raw);
      const empty = defaults();
      save(empty);
      return empty;
    }
    return data;
  } catch (error) {
    console.warn('Falha lendo armazenamento; iniciando dados locais', error);
    return defaults();
  }
}

export function save(db) {
  localStorage.setItem(KEY, JSON.stringify({ ...db, initializationVersion: 1 }));
}

export function reset() {
  const db = defaults();
  save(db);
  return db;
}
