import { employee, shift, daysIn, iso, dayStatus, labelDate, setDayStatus, assignmentsOn, evaluate, labelMonth, department, validateInsert, putAssignment, csvRows, removeAssignment, addDays, publish } from './core.mjs'; // Importa os recursos usados aqui.
import { db, state, render, persist, mutate, navigate } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { avatar, safe, icon, notice, openModal, btn, $, closeModal, renderTemplate, title, monthBar, viewSelect, $$ } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function shiftChip(a) { // Define esta rotina.
  const e = employee(db, a.employeeId), // Prepara os valores usados no bloco.
    s = shift(db, a.shiftId); // Executa esta etapa.
  if (!e || !s) return ''; // Confere a condição.
  return `<button type="button" class="shift-pill" draggable="true" data-assignment-drag="${a.id}" data-action="edit-assignment" data-id="${a.id}" style="--pill:${s.color}">${avatar(e, 'tiny')}<span>${safe(e.name.split(' ')[0])}</span><small>${safe(s.name)}</small></button>`; // Retorna o resultado.
} // Encerra este bloco.
function dayOffChip(emp, day) { // Define esta rotina.
  return `<button type="button" class="shift-pill off-pill" data-action="choose-day-status" data-id="${emp.id}" data-target-day="${day}" title="${safe(emp.name)}: folga">${icon('moon', 13)}<span>${safe(emp.name.split(' ')[0])}</span><small>Folga</small></button>`; // Retorna o resultado.
} // Encerra este bloco.
function monthGrid(readOnly = false, published = false) { // Define esta rotina.
  const [y, m] = state.month.split('-').map(Number), // Prepara os valores usados no bloco.
    first = new Date(y, m - 1, 1).getDay(), // Executa esta etapa.
    total = Math.ceil((first + daysIn(state.month)) / 7) * 7; // Executa esta etapa.
  const visible = published ? db.publications[`${state.departmentId}:${state.month}`]?.assignments || [] : db.assignments; // Prepara os valores usados no bloco.
  const workers = db.employees.filter(e => e.active && e.departmentId === state.departmentId); // Prepara os valores usados no bloco.
  let html = `<div class="calendar-grid"><div class="weekday-header">${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(n => `<span>${n}</span>`).join('')}</div><div class="calendar-days">`; // Prepara os valores usados no bloco.
  for (let i = 0; i < total; i++) { // Percorre os itens.
    const n = i - first + 1, // Prepara os valores usados no bloco.
      dateObj = new Date(y, m - 1, n), // Executa esta etapa.
      day = iso(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()), // Executa esta etapa.
      inside = n > 0 && n <= daysIn(state.month); // Executa esta etapa.
    const items = inside ? visible.filter(a => a.day === day && a.departmentId === state.departmentId) : []; // Prepara os valores usados no bloco.
    const off = inside && !readOnly && !published ? workers.filter(e => dayStatus(db, e.id, day).status === 'folga') : []; // Prepara os valores usados no bloco.
    const marks = [...off.map(e => dayOffChip(e, day)), ...items.map(a => readOnly ? `<div class="shift-pill static" style="--pill:${shift(db, a.shiftId)?.color || '#2783D4'}">${avatar(employee(db, a.employeeId), 'tiny')}<span>${safe(employee(db, a.employeeId)?.name.split(' ')[0] || '')}</span></div>` : shiftChip(a))]; // Prepara os valores usados no bloco.
    html += `<div class="day-cell ${inside ? '' : 'out-month'} ${state.day === day ? 'selected-day' : ''}" ${inside ? `data-day="${day}" tabindex="0" role="button" aria-label="${safe(labelDate(day))}, ${items.length} plantões e ${off.length} folgas"` : ''}><div class="day-top"><span>${inside ? n : dateObj.getDate()}</span>${inside && !readOnly ? `<button type="button" class="day-add" data-action="add-on-day" data-day="${day}" title="Adicionar funcionário">+</button>` : ''}</div><div class="day-chips">${marks.slice(0, 3).join('')}${marks.length > 3 ? `<span class="more-people">+${marks.length - 3} pessoas</span>` : ''}</div></div>`; // Monta o conteúdo da interface.
  } // Encerra este bloco.
  return html + '</div></div>'; // Retorna o resultado.
} // Encerra este bloco.
function employeePool() { // Define esta rotina.
  const workers = db.employees.filter(e => e.active && e.departmentId === state.departmentId); // Prepara os valores usados no bloco.
  const query = state.manualSearch.toLocaleLowerCase('pt-BR'); // Prepara os valores usados no bloco.
  return `<aside id="employee-status" class="employee-pool"><div class="section-head"><h2>Funcionários</h2><span class="count">${workers.length}</span></div>\n  <div class="search-input">${icon('search', 16)}<input id="employee-search" placeholder="Buscar funcionário" value="${safe(state.manualSearch)}" autocomplete="off" aria-label="Buscar funcionário"></div>\n  <p class="pool-help">Arraste a pessoa até o dia e escolha <b>Folga</b> ou <b>Plantão</b>.</p>\n  <p class="pool-selected-date">Situação em ${state.day.split('-').reverse().join('/')}</p>\n  <div class="pool-list">${workers.map(e => { // Retorna o resultado.
    const info = dayStatus(db, e.id, state.day), // Prepara os valores usados no bloco.
      assigned = info.status === 'plantao' ? shift(db, info.shiftId) : null; // Executa esta etapa.
    const label = info.status === 'plantao' ? `Plantão · ${assigned?.name || 'Turno'}` : info.status === 'folga' ? 'Folga' : info.status === 'ferias' ? 'Férias' : info.status === 'ausencia' ? 'Indisponível' : 'Sem marcação'; // Prepara os valores usados no bloco.
    const search = e.name.toLocaleLowerCase('pt-BR'); // Prepara os valores usados no bloco.
    return `<button type="button" class="pool-person ${state.selectedEmployee === e.id ? 'chosen' : ''}" draggable="true" data-employee="${e.id}" data-search="${safe(search)}" title="Arrastar ${safe(e.name)} até um dia" ${search.includes(query) ? '' : 'hidden'}>${avatar(e)}<span><strong>${safe(e.name)}</strong><small>${safe(e.role)}</small><span class="pool-day-status ${safe(info.status)}">${safe(label)}</span></span><span class="drag-handle" aria-hidden="true">⠿</span></button>`; // Retorna o resultado.
  }).join('')}</div></aside>`; // Continua a organização do bloco.
} // Encerra este bloco.
function dayStatusModal(employeeId, day) { // Define esta rotina.
  const emp = employee(db, employeeId); // Prepara os valores usados no bloco.
  if (!emp || !emp.active || emp.departmentId !== state.departmentId) { // Confere a condição.
    notice('Funcionário não encontrado neste setor.', 'error'); // Executa esta etapa.
    return; // Retorna o resultado.
  } // Encerra este bloco.
  state.day = day; // Executa esta etapa.
  state.selectedEmployee = null; // Executa esta etapa.
  render(); // Atualiza a página.
  const info = dayStatus(db, emp.id, day); // Prepara os valores usados no bloco.
  const date = day.split('-').reverse().join('/'); // Prepara os valores usados no bloco.
  const protectedAbsence = info.source === 'approved'; // Prepara os valores usados no bloco.
  const disabled = protectedAbsence ? 'disabled' : ''; // Prepara os valores usados no bloco.
  openModal('Folga ou plantão?', `<div class="drop-status-person">${avatar(emp, 'large')}<div><h3>${safe(emp.name)}</h3><p>${date} · ${safe(labelDate(day))}</p></div></div>\n  ${protectedAbsence ? '<div class="callout warm">Esta pessoa já tem uma ausência aprovada neste dia. Ela permanece preservada.</div>' : '<p class="drop-status-hint">Escolha Folga ou Plantão. No plantão, selecione o turno.</p>'}\n  <div class="drop-status-options">\n   <button type="button" class="drop-status-choice drop-off" data-action="confirm-day-status" data-id="${emp.id}" data-target-day="${day}" data-status="folga" aria-label="Marcar folga de ${safe(emp.name)}" ${disabled}>${icon('moon', 26)}<span class="drop-choice-copy"><strong>Folga</strong><small>Não trabalha neste dia</small></span></button>\n   <button type="button" class="drop-status-choice drop-duty drop-duty-toggle" data-action="choose-duty-turn" aria-label="Escolher plantão de ${safe(emp.name)}" aria-controls="drop-shift-choices" aria-expanded="false" ${disabled}>${icon('clock', 26)}<span class="drop-choice-copy"><strong>Plantão</strong><small>Escolher turno</small></span></button>\n   <fieldset id="drop-shift-choices" class="drop-shift-group" hidden><legend>Plantão · escolha o turno</legend><div class="drop-shift-options">\n    ${db.shifts.map(s => `<button type="button" class="drop-status-choice drop-duty drop-shift-choice" data-action="confirm-day-status" data-id="${emp.id}" data-target-day="${day}" data-status="plantao" data-shift-id="${s.id}" aria-label="Marcar plantão de ${safe(emp.name)} no turno ${safe(s.name)}" ${disabled}>${icon('clock', 23)}<strong>${safe(s.name)}</strong><small>${safe(s.start)}–${safe(s.end)}</small>${info.status === 'plantao' && info.shiftId === s.id ? '<span class="drop-current-shift">Atual</span>' : ''}</button>`).join('')}\n   </div></fieldset>\n  </div><div id="drop-status-error" class="drop-status-error" role="alert"></div>`, btn('Cancelar', 'close-modal', 'outline')); // Monta o conteúdo da interface.
  $('.drop-status-choice:not(:disabled)')?.focus(); // Posiciona o foco do teclado.
} // Encerra este bloco.
function confirmDayStatus(button) { // Define esta rotina.
  const employeeId = Number(button.dataset.id), // Prepara os valores usados no bloco.
    day = button.dataset.targetDay, // Executa esta etapa.
    status = button.dataset.status; // Executa esta etapa.
  const result = setDayStatus(db, { // Prepara os valores usados no bloco.
    employeeId, // Executa esta etapa.
    departmentId: state.departmentId, // Define esta informação.
    day, // Executa esta etapa.
    status, // Executa esta etapa.
    shiftId: Number(button.dataset.shiftId) // Define esta informação.
  }); // Encerra este bloco.
  if (!result.ok) { // Confere a condição.
    const error = $('#drop-status-error'); // Prepara os valores usados no bloco.
    if (error) error.textContent = result.errors.join(' '); // Confere a condição.
    return; // Retorna o resultado.
  } // Encerra este bloco.
  state.day = day; // Executa esta etapa.
  state.selectedEmployee = null; // Executa esta etapa.
  state.preview = null; // Executa esta etapa.
  persist(); // Salva os dados locais.
  closeModal(); // Executa esta etapa.
  render(); // Atualiza a página.
  notice(`${employee(db, employeeId).name}: ${status === 'folga' ? 'folga' : `plantão (${shift(db, Number(button.dataset.shiftId))?.name || 'Turno'})`} em ${day.split('-').reverse().join('/')}.`); // Executa esta etapa.
  $(`[data-day="${day}"]`)?.focus(); // Posiciona o foco do teclado.
} // Encerra este bloco.
function dayPanel() { // Define esta rotina.
  const items = assignmentsOn(db, state.day, state.departmentId), // Prepara os valores usados no bloco.
    rules = db.rules[state.departmentId], // Executa esta etapa.
    coverage = db.shifts.map(s => ({ // Organiza a lista de dados.
      s, // Executa esta etapa.
      count: items.filter(a => a.shiftId === s.id).length, // Organiza a lista de dados.
      min: rules.minStaff[s.id] || 0 // Define esta informação.
    })); // Encerra este bloco.
  return `<aside class="day-panel"><div class="panel-cap"><span>Dia selecionado</span><h2>${safe(labelDate(state.day))}</h2><small>${items.length} funcionário(s) escalado(s)</small></div><div class="panel-inner"><div class="tab-row"><b>Equipe do dia</b><span>${items.length}</span></div><div class="assigned-list">${items.length ? items.map(a => { // Retorna o resultado.
    const e = employee(db, a.employeeId), // Prepara os valores usados no bloco.
      s = shift(db, a.shiftId); // Executa esta etapa.
    return `<div class="assigned-person">${avatar(e)}<span><b>${safe(e?.name || '')}</b><small>${safe(s?.name || '')} · ${safe(s?.start || '')} – ${safe(s?.end || '')}</small></span>${btn(icon('edit', 15), 'edit-assignment', 'icon-btn', `data-id="${a.id}" aria-label="Editar"`)}${btn(icon('trash', 15), 'remove-assignment', 'icon-btn red', `data-id="${a.id}" aria-label="Remover"`)}</div>`; // Retorna o resultado.
  }).join('') : '<div class="empty-list">Nenhuma pessoa escalada.</div>'}</div><button class="ghost-add" type="button" data-action="add-on-day" data-day="${state.day}">${icon('plus')} Adicionar funcionário</button><div class="day-summary"><h3>Cobertura do dia</h3>${coverage.map(({ // Continua a organização do bloco.
    s, // Executa esta etapa.
    count, // Executa esta etapa.
    min // Executa esta etapa.
  }) => `<div class="coverage-line"><span class="dot" style="background:${s.color}"></span><span>${safe(s.name)}</span><strong class="${count < min ? 'red-text' : 'green-text'}">${count}/${min}</strong></div>`).join('')}</div><div class="panel-action-row">${btn(icon('copy') + ' Copiar dia', 'copy-day', 'outline grow')}${btn(icon('trash') + ' Limpar', 'clear-day', 'outline red grow')}</div></div></aside>`; // Continua a organização do bloco.
} // Encerra este bloco.
function calendarPage() { // Define esta rotina.
  const info = evaluate(db, state.month, state.departmentId); // Prepara os valores usados no bloco.
  const published = !!db.publications[`${state.departmentId}:${state.month}`]; // Prepara os valores usados no bloco.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title(labelMonth(state.month), `${safe(department(db, state.departmentId)?.name || 'Setor')} • ${info.staff} funcionários • ${published ? 'Publicada' : 'Rascunho'}`), // Define esta informação.
    icone: icon('calendar', 23), // Define esta informação.
    mes: monthBar(), // Define esta informação.
    setor: viewSelect(), // Define esta informação.
    acao: btn(icon('spark') + ' Gerar escala', 'generate-schedule', 'primary'), // Define esta informação.
    conteudo: state.selectedEmployee ? btn('Cancelar seleção', 'clear-selected', 'text') : '', // Define esta informação.
    acao2: btn(icon('trash') + ' Limpar mês', 'clear-month', 'outline small'), // Define esta informação.
    acao3: btn(icon('download') + ' CSV', 'export-csv', 'outline small'), // Define esta informação.
    acao4: btn(icon('file') + ' PDF', 'export-pdf', 'outline small'), // Define esta informação.
    acao5: btn(icon('check') + ' Publicar', 'publish', 'outline small'), // Define esta informação.
    acao6: btn(icon('mail') + ' E-mail', 'email', 'primary small'), // Define esta informação.
    funcionarios: employeePool(), // Define esta informação.
    calendario: monthGrid(), // Define esta informação.
    conteudo2: db.shifts.map(s => `<span><i style="background:${s.color}"></i>${safe(s.name)} (${s.start}–${s.end})</span>`).join(''), // Monta o conteúdo da interface.
    detalhesDoDia: dayPanel(), // Define esta informação.
    icone2: icon('info', 17) // Define esta informação.
  }); // Encerra este bloco.
} // Encerra este bloco.
function assignmentModal(id = null, date = state.day) { // Define esta rotina.
  const a = id ? db.assignments.find(a => a.id === id) : null; // Prepara os valores usados no bloco.
  const dep = state.departmentId; // Prepara os valores usados no bloco.
  openModal(a ? 'Editar alocação' : 'Adicionar funcionário', `<form id="assignment-form"><input type="hidden" name="id" value="${a?.id || ''}"><label>Data<input name="day" type="date" value="${safe(a?.day || date)}" required></label><label>Funcionário<select name="employeeId" ${a ? 'disabled' : ''}>${db.employees.filter(e => e.departmentId === dep && e.active).map(e => `<option value="${e.id}" ${e.id === (a?.employeeId || state.selectedEmployee) ? 'selected' : ''}>${safe(e.name)}</option>`).join('')}</select></label><label>Turno<select name="shiftId">${db.shifts.map(s => `<option value="${s.id}" ${s.id === (a?.shiftId || state.shiftId) ? 'selected' : ''}>${safe(s.name)} · ${s.start}–${s.end}</option>`).join('')}</select></label><label class="check-field"><input type="checkbox" name="locked" ${a?.locked ? 'checked' : ''}> Manter este turno fixo nas simulações</label><button class="btn primary full" type="submit">${icon('save')} Salvar alocação</button></form>`); // Monta o conteúdo da interface.
} // Encerra este bloco.
function attemptAssignment(record, id = null) { // Define esta rotina.
  const errors = validateInsert(db, record, { // Prepara os valores usados no bloco.
    ignoreId: id // Define esta informação.
  }); // Encerra este bloco.
  if (errors.length) { // Confere a condição.
    notice(errors.join(' '), 'error'); // Executa esta etapa.
    return false; // Retorna o resultado.
  } // Encerra este bloco.
  if (id) { // Confere a condição.
    const current = db.assignments.find(a => a.id === id); // Prepara os valores usados no bloco.
    if (!current) return false; // Confere a condição.
    Object.assign(current, record); // Executa esta etapa.
    delete db.publications[`${record.departmentId}:${record.day.slice(0, 7)}`]; // Executa esta etapa.
  } else putAssignment(db, record); // Continua a organização do bloco.
  persist(); // Salva os dados locais.
  render(); // Atualiza a página.
  notice('Escala atualizada.'); // Executa esta etapa.
  return true; // Retorna o resultado.
} // Encerra este bloco.
function reportEmail() { // Define esta rotina.
  const published = db.publications[`${state.departmentId}:${state.month}`]; // Prepara os valores usados no bloco.
  if (!published) { // Confere a condição.
    notice('Publique a escala antes de preparar o e-mail.', 'error'); // Executa esta etapa.
    return; // Retorna o resultado.
  } // Encerra este bloco.
  const rows = csvRows({ // Prepara os valores usados no bloco.
    ...db, // Executa esta etapa.
    assignments: published.assignments // Define esta informação.
  }, state.month, state.departmentId); // Continua a organização do bloco.
  const to = db.employees.filter(e => e.departmentId === state.departmentId && e.active && e.email).map(e => e.email).join(','); // Prepara os valores usados no bloco.
  const subject = `Escala publicada — ${labelMonth(state.month)} — ${department(db, state.departmentId)?.name}`; // Prepara os valores usados no bloco.
  let body = `Olá, equipe!\n\nSegue a escala publicada de ${labelMonth(state.month)}.\n\n` + rows.slice(1).slice(0, 120).map(r => r.join(' | ')).join('\n'); // Prepara os valores usados no bloco.
  body += '\n\nConsulte com a gestão em caso de alterações.\n'; // Executa esta etapa.
  if (body.length > 5000) { // Confere a condição.
    notice('Escala longa: exporte o CSV e anexe ao e-mail.', 'warn'); // Executa esta etapa.
    body = `Olá, equipe!\n\nSegue a escala publicada de ${labelMonth(state.month)}. Anexe o arquivo CSV exportado pelo EscalaPro.\n`; // Executa esta etapa.
  } // Encerra este bloco.
  const href = `mailto:${encodeURIComponent(to).replaceAll('%2C', ',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; // Prepara os valores usados no bloco.
  openModal('Enviar escala por e-mail', `<p>Esta versão sem backend <strong>abre um rascunho no seu programa de e-mail</strong>. Ela não envia mensagens automaticamente.</p><div class="callout cool">Destinatários: ${db.employees.filter(e => e.departmentId === state.departmentId && e.active && e.email).length} endereços de demonstração. Substitua pelos reais antes de enviar.</div><p>Para anexar a escala completa, use o botão CSV da página Escalas.</p><a class="btn primary full" href="${href}">${icon('mail')} Abrir rascunho de e-mail</a>`); // Monta o conteúdo da interface.
} // Encerra este bloco.
async function handlePageAction(el) { // Define esta rotina.
  const act = el.dataset.action; // Prepara os valores usados no bloco.
  const id = Number(el.dataset.id || 0); // Prepara os valores usados no bloco.
  switch (act) { // Executa esta etapa.
    case 'choose-day-status': // Trata esta opção.
      dayStatusModal(id, el.dataset.targetDay); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'choose-duty-turn': // Trata esta opção.
      { // Encerra este bloco.
        const choices = $('#drop-shift-choices'); // Prepara os valores usados no bloco.
        if (choices) { // Confere a condição.
          choices.hidden = false; // Executa esta etapa.
          el.setAttribute('aria-expanded', 'true'); // Executa esta etapa.
          $('.drop-shift-choice:not(:disabled)', choices)?.focus(); // Posiciona o foco do teclado.
        } // Encerra este bloco.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'confirm-day-status': // Trata esta opção.
      confirmDayStatus(el); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'clear-selected': // Trata esta opção.
      state.selectedEmployee = null; // Executa esta etapa.
      render(); // Atualiza a página.
      break; // Finaliza esta opção.
    case 'add-on-day': // Trata esta opção.
      assignmentModal(null, el.dataset.day || state.day); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'edit-assignment': // Trata esta opção.
      { // Encerra este bloco.
        const assigned = db.assignments.find(item => item.id === id); // Prepara os valores usados no bloco.
        if (assigned) dayStatusModal(assigned.employeeId, assigned.day); // Confere a condição.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'remove-assignment': // Trata esta opção.
      if (confirm('Remover este funcionário do dia?')) mutate(() => removeAssignment(db, id)); // Confere a condição.
      break; // Finaliza esta opção.
    case 'copy-day': // Trata esta opção.
      openModal('Copiar dia', `<form id="copy-form"><label>Copiar de<input type="date" name="from" value="${state.day}" required></label><label>Copiar para<input type="date" name="to" value="${addDays(state.day, 1)}" required></label><p class="subdued">Alocações incompatíveis serão ignoradas; as demais respeitarão as regras.</p><button class="btn primary full" type="submit">Copiar alocações</button></form>`); // Monta o conteúdo da interface.
      break; // Finaliza esta opção.
    case 'clear-month': // Trata esta opção.
      { // Encerra este bloco.
        const count = db.assignments.filter(a => a.day.startsWith(state.month) && a.departmentId === state.departmentId).length; // Prepara os valores usados no bloco.
        if (!count) { // Confere a condição.
          notice('Este mês já está vazio.'); // Executa esta etapa.
          break; // Finaliza esta opção.
        } // Encerra este bloco.
        if (confirm(`Limpar as ${count} alocações de ${labelMonth(state.month)}?`)) mutate(() => { // Confere a condição.
          db.assignments = db.assignments.filter(a => !a.day.startsWith(state.month) || a.departmentId !== state.departmentId); // Organiza a lista de dados.
          delete db.publications[`${state.departmentId}:${state.month}`]; // Executa esta etapa.
        }); // Encerra este bloco.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'clear-day': // Trata esta opção.
      { // Encerra este bloco.
        const count = assignmentsOn(db, state.day, state.departmentId).length; // Prepara os valores usados no bloco.
        if (!count) { // Confere a condição.
          notice('O dia está vazio.'); // Executa esta etapa.
          break; // Finaliza esta opção.
        } // Encerra este bloco.
        if (confirm(`Remover ${count} alocação(ões) do dia ${state.day}?`)) mutate(() => { // Confere a condição.
          db.assignments = db.assignments.filter(a => a.day !== state.day || a.departmentId !== state.departmentId); // Organiza a lista de dados.
          delete db.publications[`${state.departmentId}:${state.month}`]; // Executa esta etapa.
        }); // Encerra este bloco.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'generate-schedule': // Trata esta opção.
      navigate('simulacoes', { // Executa esta etapa.
        scenario: 'rebuild', // Define esta informação.
        preview: null // Define esta informação.
      }); // Encerra este bloco.
      break; // Finaliza esta opção.
    case 'publish': // Trata esta opção.
      try { // Controla possíveis falhas.
        mutate(() => publish(db, state.month, state.departmentId)); // Executa esta etapa.
        notice('Escala publicada para consulta no portal.'); // Executa esta etapa.
      } catch (e) { // Continua a organização do bloco.
        notice(e.message, 'error'); // Executa esta etapa.
      } // Encerra este bloco.
      break; // Finaliza esta opção.
    case 'email': // Trata esta opção.
      reportEmail(); // Executa esta etapa.
      break; // Finaliza esta opção.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
function submitPageForm(form) { // Define esta rotina.
  const fd = new FormData(form); // Prepara os valores usados no bloco.
  const val = key => String(fd.get(key) || ''); // Prepara os valores usados no bloco.
  switch (form.id) { // Executa esta etapa.
    case 'assignment-form': // Trata esta opção.
      { // Encerra este bloco.
        const id = Number(val('id')), // Prepara os valores usados no bloco.
          existing = id ? db.assignments.find(a => a.id === id) : null, // Executa esta etapa.
          employeeId = existing?.employeeId || Number(val('employeeId')), // Executa esta etapa.
          e = employee(db, employeeId), // Executa esta etapa.
          record = { // Executa esta etapa.
            day: val('day'), // Define esta informação.
            employeeId, // Executa esta etapa.
            departmentId: e.departmentId, // Define esta informação.
            shiftId: Number(val('shiftId')), // Define esta informação.
            locked: fd.has('locked') // Define esta informação.
          }; // Encerra este bloco.
        if (attemptAssignment(record, id || null)) { // Confere a condição.
          closeModal(); // Executa esta etapa.
          state.day = record.day; // Executa esta etapa.
        } // Encerra este bloco.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'copy-form': // Trata esta opção.
      { // Encerra este bloco.
        const from = val('from'), // Prepara os valores usados no bloco.
          to = val('to'); // Executa esta etapa.
        if (from === to) throw Error('Escolha datas diferentes.'); // Confere a condição.
        let count = 0, // Prepara os valores usados no bloco.
          skipped = 0; // Executa esta etapa.
        for (const a of [...assignmentsOn(db, from, state.departmentId)]) { // Percorre os itens.
          const out = putAssignment(db, { // Prepara os valores usados no bloco.
            employeeId: a.employeeId, // Define esta informação.
            departmentId: a.departmentId, // Define esta informação.
            day: to, // Define esta informação.
            shiftId: a.shiftId // Define esta informação.
          }); // Encerra este bloco.
          if (out.ok) count++;else skipped++; // Confere a condição.
        } // Encerra este bloco.
        persist(); // Salva os dados locais.
        state.day = to; // Executa esta etapa.
        closeModal(); // Executa esta etapa.
        render(); // Atualiza a página.
        notice(`${count} copiado(s), ${skipped} ignorado(s).`); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
let dragging = null; // Prepara os valores usados no bloco.
const events = { // Prepara os valores usados no bloco.
  click(event) { // Executa esta etapa.
    const emp = event.target.closest('[data-employee]'); // Prepara os valores usados no bloco.
    if (emp) { // Confere a condição.
      state.selectedEmployee = Number(emp.dataset.employee); // Executa esta etapa.
      render(); // Atualiza a página.
      return; // Retorna o resultado.
    } // Encerra este bloco.
    const day = event.target.closest('[data-day]'); // Prepara os valores usados no bloco.
    if (day) { // Confere a condição.
      state.day = day.dataset.day; // Executa esta etapa.
      if (state.selectedEmployee) dayStatusModal(state.selectedEmployee, state.day);else render(); // Confere a condição.
    } // Encerra este bloco.
  }, // Encerra este bloco.
  input(event) { // Executa esta etapa.
    if (event.target.id === 'employee-search') { // Confere a condição.
      state.manualSearch = event.target.value; // Executa esta etapa.
      const query = event.target.value.toLocaleLowerCase('pt-BR'); // Prepara os valores usados no bloco.
      $$('[data-search]').forEach(item => { // Executa esta etapa.
        item.hidden = !item.dataset.search.includes(query); // Executa esta etapa.
      }); // Encerra este bloco.
    } // Encerra este bloco.
  }, // Encerra este bloco.
  dragstart(event) { // Executa esta etapa.
    const source = event.target.closest('[data-employee],[data-assignment-drag]'); // Prepara os valores usados no bloco.
    if (!source) return; // Confere a condição.
    dragging = source.dataset.employee ? { // Executa esta etapa.
      employeeId: Number(source.dataset.employee) // Define esta informação.
    } : { // Continua a organização do bloco.
      assignmentId: Number(source.dataset.assignmentDrag) // Define esta informação.
    }; // Encerra este bloco.
    event.dataTransfer.setData('text/plain', 'escala'); // Executa esta etapa.
    event.dataTransfer.effectAllowed = 'move'; // Executa esta etapa.
  }, // Encerra este bloco.
  dragenter: acceptDrag, // Define esta informação.
  dragover: acceptDrag, // Define esta informação.
  dragleave(event) { // Executa esta etapa.
    const target = event.target.closest('[data-day]'); // Prepara os valores usados no bloco.
    if (target && !target.contains(event.relatedTarget)) target.classList.remove('drag-over'); // Confere a condição.
  }, // Encerra este bloco.
  drop(event) { // Executa esta etapa.
    const target = event.target.closest('[data-day]'); // Prepara os valores usados no bloco.
    if (!target || !dragging) return; // Confere a condição.
    event.preventDefault(); // Executa esta etapa.
    const dropped = dragging; // Prepara os valores usados no bloco.
    dragging = null; // Executa esta etapa.
    $$('.drag-over').forEach(item => item.classList.remove('drag-over')); // Executa esta etapa.
    const day = target.dataset.day; // Prepara os valores usados no bloco.
    state.day = day; // Executa esta etapa.
    if (dropped.employeeId) dayStatusModal(dropped.employeeId, day);else { // Confere a condição.
      const assignment = db.assignments.find(item => item.id === dropped.assignmentId); // Prepara os valores usados no bloco.
      if (assignment) attemptAssignment({ // Confere a condição.
        ...assignment, // Executa esta etapa.
        day // Executa esta etapa.
      }, assignment.id); // Continua a organização do bloco.
    } // Encerra este bloco.
  }, // Encerra este bloco.
  dragend() { // Executa esta etapa.
    dragging = null; // Executa esta etapa.
    $$('.drag-over').forEach(item => item.classList.remove('drag-over')); // Executa esta etapa.
  }, // Encerra este bloco.
  keydown(event) { // Executa esta etapa.
    if (event.key === 'Enter' && event.target.matches('[data-day]')) { // Confere a condição.
      event.preventDefault(); // Executa esta etapa.
      event.stopPropagation(); // Executa esta etapa.
      event.target.click(); // Executa esta etapa.
    } // Encerra este bloco.
  } // Encerra este bloco.
}; // Encerra este bloco.
function acceptDrag(event) { // Define esta rotina.
  const target = event.target.closest('[data-day]'); // Prepara os valores usados no bloco.
  if (!target || !dragging) return; // Confere a condição.
  event.preventDefault(); // Executa esta etapa.
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'; // Confere a condição.
  target.classList.add('drag-over'); // Executa esta etapa.
} // Encerra este bloco.
startPage({ // Conecta a interação da página.
  id: 'escalas', // Define esta informação.
  renderPage: calendarPage, // Define esta informação.
  onAction: handlePageAction, // Define esta informação.
  onSubmit: submitPageForm, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

