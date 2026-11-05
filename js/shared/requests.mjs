import { state, db, persist, render } from './context.mjs'; // Importa os recursos usados aqui.
import { openModal, safe, icon, closeModal, notice } from './ui.mjs'; // Importa os recursos usados aqui.
import { employee, diffDays } from '../core.mjs'; // Importa os recursos usados aqui.
function requestModal() { // Define esta rotina.
  const portal = state.currentRole === 'employee', // Prepara os valores usados no bloco.
    id = portal ? state.portalEmployee : state.selectedEmployee || db.employees.find(e => e.departmentId === state.departmentId)?.id; // Executa esta etapa.
  if (!db.employees.some(e => e.active) || (portal && !employee(db, id)?.active)) {
    notice('Cadastre um funcionário ativo antes de criar solicitações.', 'error');
    return;
  }
  openModal('Nova solicitação', `<form id="request-form">${!portal ? `<label>Funcionário<select name="employeeId">${db.employees.filter(e => e.active).map(e => `<option value="${e.id}" ${id === e.id ? 'selected' : ''}>${safe(e.name)}</option>`).join('')}</select></label>` : `<div class="callout cool">${safe(employee(db, id)?.name)}</div>`}<label>Tipo<select name="type"><option value="folga">Folga</option><option value="troca">Troca de turno</option><option value="ferias">Férias</option><option value="ausencia">Indisponibilidade</option></select></label><div class="form-grid"><label>Data inicial<input name="start" type="date" value="${state.day}" required></label><label>Data final<input name="end" type="date" value="${state.day}" required></label></div><label>Motivo (opcional)<textarea name="reason" rows="3" placeholder="Ex.: compromisso pessoal"></textarea></label><p class="subdued">Evite inserir diagnósticos médicos ou dados sensíveis.</p><button type="submit" class="btn primary full">${icon('send')} Enviar solicitação</button></form>`); // Monta o conteúdo da interface.
} // Encerra este bloco.
function submitRequest(form) { // Define esta rotina.
  const fd = new FormData(form); // Prepara os valores usados no bloco.
  const val = key => String(fd.get(key) || ''); // Prepara os valores usados no bloco.
  switch (form.getAttribute('id')) { // Executa esta etapa.
    case 'request-form': // Trata esta opção.
      { // Encerra este bloco.
        const start = val('start'), // Prepara os valores usados no bloco.
          end = val('end'); // Executa esta etapa.
        if (start > end) throw Error('Data final não pode ser anterior à inicial.'); // Confere a condição.
        if (diffDays(start, end) > 45) throw Error('O intervalo não pode exceder 45 dias por solicitação.'); // Confere a condição.
        const employeeId = state.currentRole === 'employee' ? state.portalEmployee : Number(val('employeeId')); // Prepara os valores usados no bloco.
        if (!employee(db, employeeId)?.active) throw Error('Selecione um funcionário ativo.');
        db.requests.push({ // Executa esta etapa.
          id: ++db.sequence, // Define esta informação.
          employeeId, // Executa esta etapa.
          type: val('type'), // Define esta informação.
          start, // Executa esta etapa.
          end, // Executa esta etapa.
          reason: val('reason').trim().slice(0, 500), // Define esta informação.
          status: 'pending', // Define esta informação.
          note: '', // Define esta informação.
          createdAt: new Date().toISOString() // Define esta informação.
        }); // Encerra este bloco.
        persist(); // Salva os dados locais.
        closeModal(); // Executa esta etapa.
        render(); // Atualiza a página.
        notice('Solicitação registrada.'); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
  } // Encerra este bloco.
} // Encerra este bloco.
export { requestModal, submitRequest }; // Disponibiliza este recurso para outros arquivos.

