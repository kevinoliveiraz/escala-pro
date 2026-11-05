import { renderTemplate, title, btn, icon, safe, openModal, closeModal, notice } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { db, state, navigate, persist, render } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { evaluate, department } from './core.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function departmentsPage() { // Define esta rotina.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Setores', 'Defina equipes independentes e configure a cobertura de cada setor.', btn(icon('plus') + ' Novo setor', 'new-department', 'primary')), // Define esta informação.
    conteudo: db.departments.map(d => { // Organiza a lista de dados.
      const emps = db.employees.filter(e => e.departmentId === d.id && e.active), // Prepara os valores usados no bloco.
        r = evaluate(db, state.month, d.id); // Executa esta etapa.
      return `<button type="button" class="department-card ${d.id === state.departmentId ? 'selected' : ''}" data-department="${d.id}"><span class="dep-icon" style="--dep:${d.color}">${icon('building', 22)}</span><h2>${safe(d.name)}</h2><p>${safe(d.description || '')}</p><div class="dep-summary"><span>${emps.length} funcionários</span><strong>${r.percent}% cobertura</strong></div></button>`; // Retorna o resultado.
    }).join(''), // Continua a organização do bloco.
    conteudo2: safe(department(db, state.departmentId)?.name || ''), // Define esta informação.
    conteudo3: db.shifts.map(s => `<div><span class="dot" style="background:${s.color}"></span><span>${safe(s.name)} (${s.start}–${s.end})</span><strong>${db.rules[state.departmentId]?.minStaff[s.id] || 0} por dia</strong></div>`).join(''), // Monta o conteúdo da interface.
    acao: btn(icon('settings') + ' Configurar regras', 'open-settings', 'outline') // Define esta informação.
  }); // Encerra este bloco.
} // Encerra este bloco.
function departmentModal() { // Define esta rotina.
  openModal('Novo setor', `<form id="department-form"><label>Nome do setor<input name="name" required maxlength="60" placeholder="Ex.: Almoxarifado"></label><label>Descrição<input name="description" maxlength="160" placeholder="Breve descrição do setor"></label><label>Cor<input name="color" type="color" value="#2165c8"></label><button class="btn primary full" type="submit">Criar setor</button></form>`); // Monta o conteúdo da interface.
} // Encerra este bloco.
async function handlePageAction(el) { // Define esta rotina.
  const act = el.dataset.action; // Prepara os valores usados no bloco.
  const id = Number(el.dataset.id || 0); // Prepara os valores usados no bloco.
  switch (act) { // Executa esta etapa.
    case 'new-department': // Trata esta opção.
      departmentModal(); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'open-settings': // Trata esta opção.
      navigate('configuracoes'); // Executa esta etapa.
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
    case 'department-form': // Trata esta opção.
      { // Encerra este bloco.
        const id = ++db.sequence; // Prepara os valores usados no bloco.
        db.departments.push({ // Executa esta etapa.
          id, // Executa esta etapa.
          name: val('name').trim(), // Define esta informação.
          description: val('description').trim(), // Define esta informação.
          color: val('color') // Define esta informação.
        }); // Encerra este bloco.
        db.rules[id] = { // Executa esta etapa.
          minStaff: Object.fromEntries(db.shifts.map(s => [s.id, 1])), // Organiza a lista de dados.
          maxWeeklyHours: 44, // Define esta informação.
          maxConsecutive: 6, // Define esta informação.
          minRest: 11, // Define esta informação.
          balanceWeekends: true, // Define esta informação.
          avoidAlone: false // Define esta informação.
        }; // Encerra este bloco.
        state.departmentId = id; // Executa esta etapa.
        persist(); // Salva os dados locais.
        closeModal(); // Executa esta etapa.
        render(); // Atualiza a página.
        notice('Setor criado.'); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
const events = { // Prepara os valores usados no bloco.
  click(event) { // Executa esta etapa.
    const department = event.target.closest('[data-department]'); // Prepara os valores usados no bloco.
    if (department) { // Confere a condição.
      state.departmentId = Number(department.dataset.department); // Executa esta etapa.
      render(); // Atualiza a página.
    } // Encerra este bloco.
  } // Encerra este bloco.
}; // Encerra este bloco.
startPage({ // Conecta a interação da página.
  id: 'setores', // Define esta informação.
  renderPage: departmentsPage, // Define esta informação.
  onAction: handlePageAction, // Define esta informação.
  onSubmit: submitPageForm, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

