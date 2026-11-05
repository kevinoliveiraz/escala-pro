import { db, state, mutate, persist, render } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { employee, shift, department, labelMonth, defaultRules } from './core.mjs'; // Importa os recursos usados aqui.
import { renderTemplate, title, viewSelect, btn, icon, cardMetric, avatar, safe, openModal, closeModal, notice } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function employeesPage() { // Define esta rotina.
  const emps = db.employees.filter(e => e.departmentId === state.departmentId), // Prepara os valores usados no bloco.
    person = emps.find(e => e.id === state.selectedStaff) || emps[0], // Executa esta etapa.
    per = person ? db.assignments.filter(a => a.employeeId === person.id && a.day.startsWith(state.month)) : []; // Organiza a lista de dados.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Funcionários', 'Cadastre sua equipe, funções e disponibilidade para as escalas.', `${viewSelect()}${btn(icon('plus') + ' Adicionar funcionário', 'new-employee', 'primary')}`), // Define esta informação.
    conteudo: cardMetric(emps.length, 'Funcionários', 'Neste setor', 'users'), // Define esta informação.
    conteudo2: cardMetric(emps.filter(e => e.active).length, 'Ativos', 'Disponíveis para escalas', 'check'), // Organiza a lista de dados.
    conteudo3: cardMetric(db.requests.filter(r => r.status === 'approved' && emps.some(e => e.id === r.employeeId)).length, 'Indisponibilidades', 'Folgas aprovadas', 'calendaroff'), // Organiza a lista de dados.
    conteudo4: emps.map(e => `<button type="button" class="staff-row ${e.id === person?.id ? 'selected' : ''}" data-staff="${e.id}"><span class="cell-person">${avatar(e)}<b>${safe(e.name)}</b></span><span>${safe(e.role)}</span><span>${safe(shift(db, e.preferredShiftId)?.name || '—')}</span><span class="tag ${e.active ? 'success' : 'gray'}">${e.active ? 'Ativo' : 'Inativo'}</span></button>`).join('') || '<div class="empty-list">Nenhum funcionário cadastrado. Clique em Adicionar funcionário para começar.</div>', // Monta o conteúdo da interface.
    conteudo5: person ? `<div class="person-profile">${avatar(person, 'large')}<div><h2>${safe(person.name)}</h2><p>${safe(person.role)}</p></div></div><dl><dt>E-mail</dt><dd>${safe(person.email)}</dd><dt>Setor</dt><dd>${safe(department(db, person.departmentId)?.name)}</dd><dt>Turno preferido</dt><dd>${safe(shift(db, person.preferredShiftId)?.name || '—')}</dd><dt>Alocações em ${safe(labelMonth(state.month))}</dt><dd>${per.length}</dd></dl><div class="panel-action-row">${btn(icon('edit') + ' Editar', 'edit-employee', 'outline', `data-id="${person.id}"`)}${btn(person.active ? 'Desativar' : 'Ativar', 'toggle-employee', 'outline', `data-id="${person.id}"`)}</div>` : '<p>Cadastre sua equipe para ver os detalhes aqui.</p>' // Monta o conteúdo da interface.
  }); // Encerra este bloco.
} // Encerra este bloco.
function employeeModal(id = null) { // Define esta rotina.
  const e = id ? employee(db, id) : null; // Prepara os valores usados no bloco.
  openModal(e ? 'Editar funcionário' : 'Novo funcionário', `<form id="employee-form"><input type="hidden" name="id" value="${e?.id || ''}"><label>Nome<input name="name" required minlength="2" value="${safe(e?.name || '')}" placeholder="Nome completo"></label><label>E-mail<input name="email" type="email" required value="${safe(e?.email || '')}"></label><label>Função<input name="role" required value="${safe(e?.role || '')}"></label>${db.departments.length ? `<label>Setor<select name="departmentId" required>${db.departments.map(d => `<option value="${d.id}" ${d.id === (e?.departmentId || state.departmentId) ? 'selected' : ''}>${safe(d.name)}</option>`).join('')}</select></label>` : '<label>Setor<input name="departmentName" required maxlength="60" placeholder="Nome do seu primeiro setor"></label>'}<label>Turno preferido<select name="preferredShiftId">${db.shifts.map(s => `<option value="${s.id}" ${s.id === (e?.preferredShiftId || 1) ? 'selected' : ''}>${safe(s.name)}</option>`).join('')}</select></label><button class="btn primary full" type="submit">Salvar funcionário</button></form>`); // Monta o conteúdo da interface.
} // Encerra este bloco.
async function handlePageAction(el) { // Define esta rotina.
  const act = el.dataset.action; // Prepara os valores usados no bloco.
  const id = Number(el.dataset.id || 0); // Prepara os valores usados no bloco.
  switch (act) { // Executa esta etapa.
    case 'new-employee': // Trata esta opção.
      employeeModal(); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'edit-employee': // Trata esta opção.
      employeeModal(id); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'toggle-employee': // Trata esta opção.
      mutate(() => { // Executa esta etapa.
        const e = employee(db, id); // Prepara os valores usados no bloco.
        e.active = !e.active; // Executa esta etapa.
      }); // Encerra este bloco.
      break; // Finaliza esta opção.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
function submitPageForm(form) { // Define esta rotina.
  const fd = new FormData(form); // Prepara os valores usados no bloco.
  const val = key => String(fd.get(key) || ''); // Prepara os valores usados no bloco.
  switch (form.getAttribute('id')) { // Executa esta etapa.
    case 'employee-form': // Trata esta opção.
      { // Encerra este bloco.
        const id = Number(val('id')), // Prepara os valores usados no bloco.
          name = val('name').trim(); // Executa esta etapa.
        if (name.length < 2) throw Error('Informe o nome completo do funcionário.');
        if (!val('email').trim() || !val('role').trim()) throw Error('Preencha e-mail e função.');
        if (!shift(db, Number(val('preferredShiftId')))) throw Error('Escolha um turno válido.');
        let departmentId = Number(val('departmentId'));
        if (!db.departments.length) {
          const departmentName = val('departmentName').trim();
          if (!departmentName) throw Error('Informe o nome do seu primeiro setor.');
          departmentId = ++db.sequence;
          db.departments.push({ id: departmentId, name: departmentName, description: '', color: '#2165c8' });
          db.rules[departmentId] = defaultRules(db.shifts, 1);
        }
        if (!department(db, departmentId)) throw Error('Escolha um setor válido.'); // Confere a condição.
        const record = { // Prepara os valores usados no bloco.
          name, // Executa esta etapa.
          email: val('email').trim(), // Define esta informação.
          role: val('role').trim(), // Define esta informação.
          departmentId, // Define esta informação.
          preferredShiftId: Number(val('preferredShiftId')) // Define esta informação.
        }; // Encerra este bloco.
        if (id) Object.assign(employee(db, id), record);else db.employees.push({ // Confere a condição.
          id: ++db.sequence, // Define esta informação.
          ...record, // Executa esta etapa.
          active: true // Define esta informação.
        }); // Encerra este bloco.
        state.departmentId = departmentId;
        state.selectedStaff = id || db.employees.at(-1).id;
        persist(); // Salva os dados locais.
        closeModal(); // Executa esta etapa.
        render(); // Atualiza a página.
        notice('Funcionário salvo.'); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
const events = { // Prepara os valores usados no bloco.
  click(event) { // Executa esta etapa.
    const person = event.target.closest('[data-staff]'); // Prepara os valores usados no bloco.
    if (person) { // Confere a condição.
      state.selectedStaff = Number(person.dataset.staff); // Executa esta etapa.
      render(); // Atualiza a página.
    } // Encerra este bloco.
  } // Encerra este bloco.
}; // Encerra este bloco.
startPage({ // Conecta a interação da página.
  id: 'funcionarios', // Define esta informação.
  renderPage: employeesPage, // Define esta informação.
  onAction: handlePageAction, // Define esta informação.
  onSubmit: submitPageForm, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

