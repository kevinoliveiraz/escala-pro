import { KEY, clone, iso } from '../core.mjs'; // Importa os recursos usados aqui.
import { load, save } from '../storage.mjs'; // Importa os recursos usados aqui.
import { previewPages, readSchedulePreview, saveSchedulePreview } from '../schedule-previews.mjs';
export let db = load(); // Disponibiliza este recurso para outros arquivos.
export let mainScheduleDb = db;
export let activeSchedulePreview = null;
if (!localStorage.getItem(KEY)) save(db);
export const pages = [['escalas', 'calendar', 'Escalas'], ['simulacoes', 'spark', 'Simulações'], ['solicitacoes', 'check', 'Solicitações'], ['funcionarios', 'users', 'Funcionários'], ['setores', 'building', 'Setores'], ['relatorios', 'chart', 'Relatórios'], ['configuracoes', 'settings', 'Configurações']]; // Disponibiliza este recurso para outros arquivos.
export const routes = { // Disponibiliza este recurso para outros arquivos.
  escalas: 'index.html', // Define esta informação.
  simulacoes: 'simulacoes.html', // Define esta informação.
  solicitacoes: 'solicitacoes.html', // Define esta informação.
  funcionarios: 'funcionarios.html', // Define esta informação.
  setores: 'setores.html', // Define esta informação.
  relatorios: 'relatorios.html', // Define esta informação.
  configuracoes: 'configuracoes.html', // Define esta informação.
  portal: 'portal.html', // Define esta informação.
  'my-requests': 'minhas-solicitacoes.html' // Executa esta etapa.
}; // Encerra este bloco.
const VIEW_KEY = 'escalapro-view-v1'; // Prepara os valores usados no bloco.
const rememberedKeys = ['month', 'departmentId', 'day', 'shiftId', 'selectedStaff', 'selectedRequest', 'scenario', 'scenarioEmployee', 'scenarioDate', 'requestFilter', 'portalEmployee', 'preview', 'schedulePreviewId']; // Prepara os valores usados no bloco.
let remembered = {}; // Prepara os valores usados no bloco.
try { // Controla possíveis falhas.
  remembered = JSON.parse(sessionStorage.getItem(VIEW_KEY) || '{}'); // Executa esta etapa.
} catch { // Continua a organização do bloco.
  remembered = {}; // Executa esta etapa.
} // Encerra este bloco.
export const state = { // Disponibiliza este recurso para outros arquivos.
  page: 'escalas', // Define esta informação.
  month: '2026-11', // Define esta informação.
  departmentId: db.activeDepartment || 1, // Define esta informação.
  day: '2026-11-12', // Define esta informação.
  shiftId: 1, // Define esta informação.
  selectedEmployee: null, // Define esta informação.
  selectedStaff: 1, // Define esta informação.
  selectedRequest: 1, // Define esta informação.
  preview: null, // Define esta informação.
  schedulePreviewId: '',
  scenario: 'absence', // Define esta informação.
  scenarioEmployee: 1, // Define esta informação.
  scenarioDate: '2026-11-12', // Define esta informação.
  requestFilter: 'all', // Define esta informação.
  staffSearch: '', // Define esta informação.
  currentRole: 'admin', // Define esta informação.
  portalEmployee: 1, // Define esta informação.
  menuOpen: false, // Define esta informação.
  manualSearch: '' // Define esta informação.
}; // Encerra este bloco.
for (const key of rememberedKeys) if (Object.hasOwn(remembered, key)) state[key] = remembered[key]; // Percorre os itens.
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(state.month)) state.month = '2026-11'; // Confere a condição.
if (!db.employees.some(item => item.id === state.portalEmployee)) state.portalEmployee = db.employees.find(item => item.active)?.id || db.employees[0]?.id; // Confere a condição.

function useScheduleDatabase(preview) {
  activeSchedulePreview = preview;
  db = preview ? clone(preview.database) : mainScheduleDb;
  if (!db.departments.some(item => item.id === state.departmentId)) {
    state.departmentId = db.departments[0]?.id ?? null;
    state.preview = null;
  }
}

export function restoreSchedulePreview() {
  if (!previewPages.has(state.page)) {
    useScheduleDatabase(null);
    return;
  }
  const preview = readSchedulePreview(state.schedulePreviewId);
  if (state.schedulePreviewId && !preview) state.preview = null;
  state.schedulePreviewId = preview?.id || '';
  useScheduleDatabase(preview);
}

export function selectSchedulePreview(id) {
  if (!previewPages.has(state.page)) throw Error('Abra a página Escalas para escolher uma versão.');
  const preview = readSchedulePreview(id);
  if (id && !preview) throw Error('Este preview não está disponível neste navegador.');
  mainScheduleDb = load();
  state.schedulePreviewId = preview?.id || '';
  state.selectedEmployee = null;
  state.preview = null;
  useScheduleDatabase(preview);
}
let paint = () => {}; // Prepara os valores usados no bloco.
export function setRenderer(renderer) { // Disponibiliza este recurso para outros arquivos.
  paint = renderer; // Executa esta etapa.
} // Encerra este bloco.
export function saveView() { // Disponibiliza este recurso para outros arquivos.
  try { // Controla possíveis falhas.
    sessionStorage.setItem(VIEW_KEY, JSON.stringify(Object.fromEntries(rememberedKeys.map(key => [key, state[key]])))); // Organiza a lista de dados.
  } catch {} // Continua a organização do bloco.
} // Encerra este bloco.
export function render() { // Disponibiliza este recurso para outros arquivos.
  paint(); // Executa esta etapa.
  saveView(); // Executa esta etapa.
} // Encerra este bloco.
export function persist() { // Disponibiliza este recurso para outros arquivos.
  if (activeSchedulePreview) {
    try {
      activeSchedulePreview = saveSchedulePreview(activeSchedulePreview, clone(db));
    } catch (error) {
      useScheduleDatabase(readSchedulePreview(activeSchedulePreview.id) || activeSchedulePreview);
      state.preview = null;
      render();
      throw error;
    }
    return;
  }
  save(db); // Salva os dados locais.
} // Encerra este bloco.
export function replaceDatabase(value) { // Disponibiliza este recurso para outros arquivos.
  db = mainScheduleDb = value; // Executa esta etapa.
} // Encerra este bloco.
export function mutate(fn) { // Disponibiliza este recurso para outros arquivos.
  const result = fn(); // Prepara os valores usados no bloco.
  persist(); // Salva os dados locais.
  render(); // Atualiza a página.
  return result; // Retorna o resultado.
} // Encerra este bloco.
export function pageUrl(page) { // Disponibiliza este recurso para outros arquivos.
  return './' + (routes[page] || routes.escalas); // Retorna o resultado.
} // Encerra este bloco.
export function navigate(page, updates = {}) { // Disponibiliza este recurso para outros arquivos.
  Object.assign(state, updates); // Executa esta etapa.
  state.selectedEmployee = null; // Executa esta etapa.
  state.menuOpen = false; // Executa esta etapa.
  saveView(); // Executa esta etapa.
  window.location.assign(pageUrl(page)); // Executa esta etapa.
} // Encerra este bloco.
export function moveMonth(n) { // Disponibiliza este recurso para outros arquivos.
  const [year, month] = state.month.split('-').map(Number), // Prepara os valores usados no bloco.
    date = new Date(year, month - 1 + n, 1); // Executa esta etapa.
  state.month = iso(date.getFullYear(), date.getMonth() + 1, 1).slice(0, 7); // Executa esta etapa.
  state.day = state.month + '-01'; // Executa esta etapa.
  state.scenarioDate = state.day; // Executa esta etapa.
  state.preview = null; // Executa esta etapa.
  render(); // Atualiza a página.
} // Encerra este bloco.

