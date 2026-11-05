import { db, state, pages, pageUrl } from './context.mjs'; // Importa os recursos usados aqui.
const $ = (q, el = document) => el.querySelector(q); // Prepara os valores usados no bloco.
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q)); // Prepara os valores usados no bloco.
const safe = x => String(x ?? '').replace(/[&<>"']/g, c => ({ // Prepara os valores usados no bloco.
  '&': '&amp;', // Executa esta etapa.
  '<': '&lt;', // Executa esta etapa.
  '>': '&gt;', // Executa esta etapa.
  '"': '&quot;', // Executa esta etapa.
  "'": '&#039;' // Executa esta etapa.
})[c]); // Continua a organização do bloco.
const icons = { // Prepara os valores usados no bloco.
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>', // Monta o conteúdo da interface.
  spark: '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>', // Monta o conteúdo da interface.
  check: '<path d="m4 12 5 5L20 6"/>', // Monta o conteúdo da interface.
  users: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2M16 4a4 4 0 0 1 0 8M22 21v-2a5 5 0 0 0-5-5"/>', // Monta o conteúdo da interface.
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h2m4 0h2M8 12h2m4 0h2M8 17h8"/>', // Monta o conteúdo da interface.
  chart: '<path d="M4 20v-7M10 20V6M16 20v-9M22 20H2"/>', // Monta o conteúdo da interface.
  settings: '<circle cx="12" cy="12" r="4"/><path d="M10 2h4l1 3 2 1 3-1 2 4-2 2v2l2 2-2 4-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-2L2 9l2-4 3 1 2-1z"/>', // Monta o conteúdo da interface.
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>', // Monta o conteúdo da interface.
  plus: '<path d="M12 5v14M5 12h14"/>', // Monta o conteúdo da interface.
  left: '<path d="m15 18-6-6 6-6"/>', // Monta o conteúdo da interface.
  right: '<path d="m9 18 6-6-6-6"/>', // Monta o conteúdo da interface.
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>', // Monta o conteúdo da interface.
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', // Monta o conteúdo da interface.
  alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 18h.01"/>', // Monta o conteúdo da interface.
  close: '<path d="M5 5l14 14M19 5 5 19"/>', // Monta o conteúdo da interface.
  trash: '<path d="M3 6h18M8 6V4h8v2M5 6l1 15h12l1-15M10 10v7M14 10v7"/>', // Monta o conteúdo da interface.
  download: '<path d="M12 3v13m-5-5 5 5 5-5M4 20h16"/>', // Monta o conteúdo da interface.
  edit: '<path d="m16 3 5 5-12 12H4v-5L16 3Z"/>', // Monta o conteúdo da interface.
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>', // Monta o conteúdo da interface.
  send: '<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>', // Monta o conteúdo da interface.
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>', // Monta o conteúdo da interface.
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>', // Monta o conteúdo da interface.
  refresh: '<path d="M20 5v6h-6M4 19v-6h6"/><path d="M5 9a8 8 0 0 1 14-3M19 15a8 8 0 0 1-14 3"/>', // Monta o conteúdo da interface.
  filter: '<path d="M4 4h16l-7 8v7l-3 2v-9L4 4Z"/>', // Monta o conteúdo da interface.
  save: '<path d="M4 3h14l3 3v15H3V3h1zM7 3v7h9V3M7 21v-8h10v8"/>', // Monta o conteúdo da interface.
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', // Monta o conteúdo da interface.
  file: '<path d="M5 2h10l5 5v15H5zM15 2v6h5M8 12h9M8 16h9"/>', // Monta o conteúdo da interface.
  logout: '<path d="M10 17l5-5-5-5M15 12H3M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>', // Monta o conteúdo da interface.
  moon: '<path d="M21 14A9 9 0 0 1 10 3 9 9 0 1 0 21 14Z"/>', // Monta o conteúdo da interface.
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>', // Monta o conteúdo da interface.
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>', // Monta o conteúdo da interface.
  calendaroff: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 13l8 6"/>', // Monta o conteúdo da interface.
  swap: '<path d="M4 7h16l-4-4m4 14H4l4 4"/>', // Monta o conteúdo da interface.
  print: '<path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7z"/>' // Monta o conteúdo da interface.
}; // Encerra este bloco.
const COLORS = ['#216be0', '#8054d0', '#159d97', '#ce7c39', '#e25e8c', '#05aab8', '#694fc2', '#ed9728', '#d6a817', '#2e7e9f', '#b55ac9', '#e75959']; // Prepara os valores usados no bloco.
function icon(k, s = 18) { // Define esta rotina.
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[k] || icons.calendar}</svg>`; // Retorna o resultado.
} // Encerra este bloco.
function avatar(e, size = '') { // Define esta rotina.
  if (!e) return ''; // Confere a condição.
  const words = e.name.trim().split(/\s+/), // Prepara os valores usados no bloco.
    letters = (words[0]?.[0] || '') + (words[1]?.[0] || ''); // Executa esta etapa.
  return `<span class="avatar ${size}" style="--av:${COLORS[(e.id - 1) % COLORS.length]}">${safe(letters.toUpperCase())}</span>`; // Retorna o resultado.
} // Encerra este bloco.
function btn(label, action = '', cls = 'outline', attr = '') { // Define esta rotina.
  return `<button type="button" class="btn ${cls}" ${action ? `data-action="${action}"` : ''} ${attr}>${label}</button>`; // Retorna o resultado.
} // Encerra este bloco.
function status(s) { // Define esta rotina.
  return `<span class="tag ${s === 'approved' ? 'success' : s === 'rejected' ? 'danger' : 'warning'}">${{ // Retorna o resultado.
    approved: 'Aprovada', // Define esta informação.
    rejected: 'Recusada', // Define esta informação.
    pending: 'Pendente' // Define esta informação.
  }[s] || s}</span>`; // Continua a organização do bloco.
} // Encerra este bloco.
function notice(text, type = 'ok') { // Define esta rotina.
  const div = document.createElement('div'); // Prepara os valores usados no bloco.
  div.className = 'toast ' + type; // Executa esta etapa.
  div.textContent = text; // Executa esta etapa.
  $('#toast').appendChild(div); // Executa esta etapa.
  setTimeout(() => div.remove(), 5000); // Executa esta etapa.
} // Encerra este bloco.
function cardMetric(value, label, description = '', kind = 'users') { // Define esta rotina.
  return `<div class="metric"><span class="metric-icon">${icon(kind, 21)}</span><div><strong>${safe(value)}</strong><b>${safe(label)}</b><small>${safe(description)}</small></div></div>`; // Retorna o resultado.
} // Encerra este bloco.
function title(title, desc, actions = '') { // Define esta rotina.
  return `<div class="page-heading"><div><h1>${safe(title)}</h1><p>${safe(desc)}</p></div><div class="heading-actions">${actions}</div></div>`; // Retorna o resultado.
} // Encerra este bloco.
function viewSelect() { // Define esta rotina.
  return `<select class="field-select" id="department-switch" aria-label="Selecionar setor">${!db.departments.length ? '<option value="">Cadastre um setor</option>' : ''}${db.departments.map(d => `<option value="${d.id}" ${d.id === state.departmentId ? 'selected' : ''}>${safe(d.name)}</option>`).join('')}</select>`; // Retorna o resultado.
} // Encerra este bloco.
function monthBar() { // Define esta rotina.
  return `<div class="month-picker">${btn(icon('left'), 'previous-month', 'square', 'aria-label="Mês anterior" title="Mês anterior"')}<input id="month-choice" type="month" value="${state.month}" aria-label="Mês da escala">${btn(icon('right'), 'next-month', 'square', 'aria-label="Próximo mês" title="Próximo mês"')}</div>`; // Retorna o resultado.
} // Encerra este bloco.
function layout(body) { // Define esta rotina.
  const portal = state.currentRole === 'employee'; // Prepara os valores usados no bloco.
  const home = portal ? 'portal' : 'escalas'; // Prepara os valores usados no bloco.
  const navigation = portal ? [['portal', 'calendar', 'Minha escala'], ['my-requests', 'check', 'Minhas solicitações']] : pages; // Prepara os valores usados no bloco.
  return `<div class="shell">\n    <div class="workspace">\n      <header class="topbar">\n        <a class="brand header-brand" href="${pageUrl(home)}" data-page="${home}" aria-label="EscalaPro, página inicial"><span class="brand-mark">${icon('calendar', 23)}</span><span>Escala<span class="brand-light">Pro</span></span></a>\n        <nav id="header-navigation" class="header-nav ${state.menuOpen ? 'is-open' : ''}" aria-label="Navegação principal">\n          ${navigation.map(([id, sym, name]) => `<a href="${pageUrl(id)}" data-page="${id}" class="nav-item ${state.page === id ? 'active' : ''}" ${state.page === id ? 'aria-current="page"' : ''}>${icon(sym, 16)}<span>${safe(name)}</span>${id === 'solicitacoes' && db.requests.some(r => r.status === 'pending') ? `<span class="nav-badge">${db.requests.filter(r => r.status === 'pending').length}</span>` : ''}</a>`).join('')}\n        </nav>\n        ${btn(icon(state.menuOpen ? 'close' : 'menu'), 'toggle-menu', 'icon-btn menu-toggle', `aria-label="${state.menuOpen ? 'Fechar menu' : 'Abrir menu'}" aria-controls="header-navigation" aria-expanded="${state.menuOpen}"`)}\n        <div class="top-actions">\n          <span class="local-label" title="Salvo neste navegador" aria-label="Salvo neste navegador">${icon('save', 14)}<span>Salvo neste navegador</span></span>\n          ${btn(icon('bell'), 'notification', 'icon-btn', 'aria-label="Notificações"')}\n          <button type="button" data-action="switch-role" class="profile-btn" title="${portal ? 'Visualização do funcionário' : 'Administração local'}" aria-label="${portal ? 'Funcionário, voltar à gestão' : 'Gestor, ver portal do funcionário'}">${avatar({ // Retorna o resultado.
    id: 99, // Define esta informação.
    name: portal ? 'Funcionario' : 'Gestor' // Define esta informação.
  })}<span><strong>${portal ? 'Funcionário' : 'Gestor'}</strong><small>${portal ? 'Voltar à gestão' : 'Ver portal'}</small></span>${icon('swap', 15)}</button>\n        </div>\n      </header>\n      <main id="main" class="main">${body}</main>\n    </div>\n  </div>`; // Continua a organização do bloco.
} // Encerra este bloco.
function openModal(title, contents, footer = '', className = '') { // Define esta rotina.
  closeModal(); // Executa esta etapa.
  const root = $('#overlay'); // Prepara os valores usados no bloco.
  root.innerHTML = `<div class="modal-backdrop"><section class="modal ${safe(className)}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">${title}</h2>${btn(icon('close'), 'close-modal', 'icon-btn', 'aria-label="Fechar janela"')}</div><div class="modal-body">${contents}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</section></div>`; // Monta o conteúdo da interface.
  root.classList.add('shown'); // Executa esta etapa.
  $('.modal input:not([type=hidden]),.modal select')?.focus(); // Posiciona o foco do teclado.
} // Encerra este bloco.
let modalCleanup = null; // Prepara os valores usados no bloco.
function setModalCleanup(cleanup) { // Define esta rotina.
  modalCleanup = cleanup; // Executa esta etapa.
} // Encerra este bloco.
function closeModal() { // Define esta rotina.
  $('#overlay').classList.remove('shown'); // Executa esta etapa.
  $('#overlay').innerHTML = ''; // Monta o conteúdo da interface.
  const cleanup = modalCleanup; // Prepara os valores usados no bloco.
  modalCleanup = null; // Executa esta etapa.
  cleanup?.(); // Executa esta etapa.
} // Encerra este bloco.
function renderTemplate(values) { // Define esta rotina.
  const source = $('#page-template')?.innerHTML; // Prepara os valores usados no bloco.
  if (source === undefined) throw Error('Modelo HTML da página não encontrado.'); // Confere a condição.
  return source.replace(/\{\{(\w+)\}\}(?:="")?/g, (_, key) => String(values[key] ?? '')); // Preenche os marcadores, inclusive os atributos opcionais.
} // Encerra este bloco.
export { $, $$, safe, icon, avatar, btn, status, cardMetric, title, viewSelect, monthBar, layout, notice, openModal, closeModal, setModalCleanup, renderTemplate }; // Disponibiliza este recurso para outros arquivos.

