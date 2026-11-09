import { dayStatus, eachDay } from '../core.mjs';
import { createSchedulePreview, listSchedulePreviews, previewPages } from '../schedule-previews.mjs';
import { db, mainScheduleDb, activeSchedulePreview, state, selectSchedulePreview, navigate, render } from './context.mjs';
import { $, btn, icon, safe, openModal, closeModal, notice } from './ui.mjs';

export function changedScheduleDays() {
  if (!activeSchedulePreview) return new Set();
  const employeesInSector = database => new Set(database.employees
    .filter(person => person.active && person.departmentId === state.departmentId)
    .map(person => person.id));
  const originalEmployees = employeesInSector(mainScheduleDb);
  const previewEmployees = employeesInSector(db);
  const employees = [...new Set([...originalEmployees, ...previewEmployees])];
  const statusFor = (database, ids, id, day) => ids.has(id) ? dayStatus(database, id, day) : { status: 'unassigned' };

  return new Set(eachDay(state.month).filter(day => employees.some(id => {
    const before = statusFor(mainScheduleDb, originalEmployees, id, day);
    const after = statusFor(db, previewEmployees, id, day);
    return before.status !== after.status || before.shiftId !== after.shiftId;
  })));
}

export function schedulePreviewBar(changedDays = changedScheduleDays()) {
  const options = listSchedulePreviews().map(({ id, name }) =>
    `<option value="${safe(id)}" ${id === state.schedulePreviewId ? 'selected' : ''}>${safe(name)}</option>`
  ).join('');
  const description = activeSchedulePreview
    ? `Salvamento automático · ${changedDays.size === 1 ? '1 dia diferente' : changedDays.size + ' dias diferentes'} da principal neste mês.`
    : 'Crie um preview para testar mudanças em uma cópia da escala.';
  return `<section class="schedule-version-bar" aria-label="Versões da escala">
    <div class="schedule-version-field">
      <label for="schedule-preview-select">Versão da escala</label>
      <select class="field-select" id="schedule-preview-select" aria-describedby="schedule-preview-help">
        <option value="">Escala principal</option>${options}
      </select>
    </div>
    ${btn(icon('plus') + ' Novo preview', 'new-schedule-preview', 'outline', db.departments.length ? '' : 'disabled')}
    <p id="schedule-preview-help">${description}</p>
  </section>`;
}

export function openSchedulePreviewForm(fromSimulation) {
  if (!previewPages.has(state.page) || !db.departments.length) return;
  if (fromSimulation && (state.page !== 'simulacoes' || !state.preview?.db)) return;
  const sourceName = fromSimulation ? 'resultado da simulação' : activeSchedulePreview?.name || 'Escala principal';
  openModal('Salvar novo preview', `<form id="schedule-preview-form">
    <input type="hidden" name="source" value="${fromSimulation ? 'simulation' : 'current'}">
    <p>O preview começa com os plantões e as folgas de <strong>${safe(sourceName)}</strong>.</p>
    <label>Nome do preview<input name="name" type="text" placeholder="Ex.: Preview 1" maxlength="60" required></label>
    <button type="submit" class="btn primary full">${icon('save')} Salvar preview</button>
  </form>`);
}

export function submitSchedulePreview(form) {
  if (!previewPages.has(state.page)) return;
  const fields = new FormData(form);
  const fromSimulation = fields.get('source') === 'simulation';
  const database = fromSimulation ? state.preview?.db : db;
  if (!database || (fromSimulation && state.page !== 'simulacoes')) throw Error('Gere uma simulação para salvar o resultado.');
  const id = createSchedulePreview(String(fields.get('name') || ''), database);
  selectSchedulePreview(id);
  closeModal();
  if (fromSimulation) {
    navigate('escalas');
    return;
  }
  render();
  $('#schedule-preview-select')?.focus();
  notice('Preview salvo.');
}
