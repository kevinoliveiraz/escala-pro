import { KEY, defaults, ensure, generate } from './core.mjs'; // Importa os recursos usados aqui.
export function load() { // Disponibiliza este recurso para outros arquivos.
  try { // Controla possíveis falhas.
    const raw = localStorage.getItem(KEY); // Prepara os valores usados no bloco.
    return raw ? ensure(JSON.parse(raw)) : demo(); // Retorna o resultado.
  } catch (e) { // Continua a organização do bloco.
    console.warn('Falha lendo armazenamento; iniciando dados locais', e); // Executa esta etapa.
    return demo(); // Retorna o resultado.
  } // Encerra este bloco.
} // Encerra este bloco.
export function save(db) { // Disponibiliza este recurso para outros arquivos.
  localStorage.setItem(KEY, JSON.stringify(db)); // Executa esta etapa.
} // Encerra este bloco.
function demo() { // Define esta rotina.
  const base = defaults(); // Prepara os valores usados no bloco.
  return generate(base, '2026-11', 1).db; // Retorna o resultado.
} // Encerra este bloco.
export function reset() { // Disponibiliza este recurso para outros arquivos.
  const db = demo(); // Prepara os valores usados no bloco.
  save(db); // Salva os dados locais.
  return db; // Retorna o resultado.
} // Encerra este bloco.

