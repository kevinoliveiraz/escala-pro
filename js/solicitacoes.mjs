import { state, db, persist, render } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { employee, department, requestText, addDays, assignmentsOn, applyRequest } from './core.mjs'; // Importa os recursos usados aqui.
import { avatar, safe, status, icon, btn, renderTemplate, title, viewSelect, cardMetric, openModal, closeModal, notice } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function requestRows(list, selectedId = state.selectedRequest) { // Define esta rotina.
  return list.map(r => { // Retorna o resultado.
    const e = employee(db, r.employeeId); // Prepara os valores usados no bloco.
    return `<button type="button" class="request-row ${r.id === selectedId ? 'selected' : ''}" data-request="${r.id}"><span class="cell-person">${avatar(e)}<span><b>${safe(e?.name || '')}</b><small>${safe(department(db, e?.departmentId)?.name || '')}</small></span></span><span>${safe(requestText[r.type] || r.type)}</span><span>${safe(r.start === r.end ? r.start.split('-').reverse().join('/') : r.start + ' a ' + r.end)}</span><span class="clip-text">${safe(r.reason || 'Sem justificativa')}</span>${status(r.status)}</button>`; // Retorna o resultado.
  }).join(''); // Continua a organização do bloco.
} // Encerra este bloco.
function requestDetails(r) { // Define esta rotina.
  if (!r) return `<div class="empty-list">Selecione uma solicitação para analisar.</div>`; // Confere a condição.
  const e = employee(db, r.employeeId), // Prepara os valores usados no bloco.
    issues = []; // Executa esta etapa.
  for (let d = r.start; d <= r.end; d = addDays(d, 1)) { // Percorre os itens.
    const on = assignmentsOn(db, d, e.departmentId).filter(a => a.employeeId === e.id); // Prepara os valores usados no bloco.
    if (on.length) issues.push(d); // Confere a condição.
  } // Encerra este bloco.
  return `<div class="request-detail"><div class="person-profile">${avatar(e, 'large')}<div><h2>${safe(e?.name)}</h2><p>${safe(department(db, e?.departmentId)?.name)}</p></div>${status(r.status)}</div><dl><dt>Tipo</dt><dd>${safe(requestText[r.type])}</dd><dt>Período</dt><dd>${safe(r.start)}${r.end !== r.start ? ' a ' + safe(r.end) : ''}</dd><dt>Motivo informado</dt><dd>${safe(r.reason || 'Não informado')}</dd><dt>Observações da gestão</dt><dd>${safe(r.note || 'Nenhuma')}</dd></dl><div class="callout ${issues.length ? 'warm' : 'cool'}">${icon(issues.length ? 'alert' : 'check')} ${issues.length ? `A aprovação retirará ${issues.length} alocação(ões) do funcionário. Será necessário revisar a cobertura.` : 'Não há alocações desse funcionário nessas datas.'}</div>${r.status === 'pending' ? `<div class="decision-actions">${btn(icon('check') + ' Aprovar', 'approve-request', 'primary', `data-id="${r.id}"`)}${btn(icon('close') + ' Recusar', 'reject-request', 'outline red', `data-id="${r.id}"`)}</div>` : ''}</div>`; // Retorna o resultado.
} // Encerra este bloco.
function requestsPage() { // Define esta rotina.
  const list = db.requests.filter(r => (state.requestFilter === 'all' || r.status === state.requestFilter) && employee(db, r.employeeId)?.departmentId === state.departmentId).sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1)); // Prepara os valores usados no bloco.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Solicitações', 'Pedidos de folga, trocas de turno e indisponibilidades da equipe.', `${viewSelect()}${btn(icon('plus') + ' Nova solicitação', 'new-request', 'primary')}`), // Define esta informação.
    conteudo: cardMetric(db.requests.filter(r => r.status === 'pending').length, 'Pendentes', 'Aguardando análise', 'clock'), // Organiza a lista de dados.
    conteudo2: cardMetric(db.requests.filter(r => r.status === 'approved').length, 'Aprovadas', 'Conferidas pela gestão', 'check'), // Organiza a lista de dados.
    conteudo3: cardMetric(db.requests.filter(r => r.status === 'rejected').length, 'Recusadas', 'Histórico de decisões', 'alert'), // Organiza a lista de dados.
    conteudo4: state.requestFilter === 'all' ? 'selected' : '', // Define esta informação.
    conteudo5: state.requestFilter === 'pending' ? 'selected' : '', // Define esta informação.
    conteudo6: state.requestFilter === 'approved' ? 'selected' : '', // Define esta informação.
    conteudo7: state.requestFilter === 'rejected' ? 'selected' : '', // Define esta informação.
    conteudo8: list.length ? requestRows(list) : '<div class="empty-list">Nenhuma solicitação com este filtro.</div>', // Monta o conteúdo da interface.
    detalhesDoPedido: requestDetails(db.requests.find(r => r.id === state.selectedRequest) || list[0]) // Define esta informação.
  }); // Encerra este bloco.
} // Encerra este bloco.
function decision(id, approval) { // Define esta rotina.
  const req = db.requests.find(r => r.id === id); // Prepara os valores usados no bloco.
  if (!req) return; // Confere a condição.
  openModal(approval ? 'Aprovar solicitação' : 'Recusar solicitação', `<form id="decision-form"><input type="hidden" name="id" value="${id}"><input type="hidden" name="status" value="${approval ? 'approved' : 'rejected'}"><p>${approval ? 'Ao aprovar, eventuais alocações do funcionário serão retiradas, e a escala deverá ser revisada.' : 'A decisão será registrada e comunicada no portal local.'}</p><label>Observação da gestão<textarea name="note" rows="3" placeholder="Opcional"></textarea></label><button class="btn ${approval ? 'primary' : 'danger-btn'} full" type="submit">Confirmar ${approval ? 'aprovação' : 'recusa'}</button></form>`); // Monta o conteúdo da interface.
} // Encerra este bloco.
async function handlePageAction(el) { // Define esta rotina.
  const act = el.dataset.action; // Prepara os valores usados no bloco.
  const id = Number(el.dataset.id || 0); // Prepara os valores usados no bloco.
  switch (act) { // Executa esta etapa.
    case 'approve-request': // Trata esta opção.
      decision(id, true); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'reject-request': // Trata esta opção.
      decision(id, false); // Executa esta etapa.
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
    case 'decision-form': // Trata esta opção.
      { // Encerra este bloco.
        const removed = applyRequest(db, Number(val('id')), val('status'), val('note')); // Prepara os valores usados no bloco.
        persist(); // Salva os dados locais.
        closeModal(); // Executa esta etapa.
        render(); // Atualiza a página.
        notice(`Decisão registrada. ${removed} alocação(ões) afetada(s).`); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
const events = { // Prepara os valores usados no bloco.
  click(event) { // Executa esta etapa.
    const row = event.target.closest('[data-request]'); // Prepara os valores usados no bloco.
    if (row) { // Confere a condição.
      state.selectedRequest = Number(row.dataset.request); // Executa esta etapa.
      render(); // Atualiza a página.
    } // Encerra este bloco.
  }, // Encerra este bloco.
  change(event) { // Executa esta etapa.
    if (event.target.id === 'request-filter') { // Confere a condição.
      state.requestFilter = event.target.value; // Executa esta etapa.
      render(); // Atualiza a página.
    } // Encerra este bloco.
  } // Encerra este bloco.
}; // Encerra este bloco.
startPage({ // Conecta a interação da página.
  id: 'solicitacoes', // Define esta informação.
  renderPage: requestsPage, // Define esta informação.
  onAction: handlePageAction, // Define esta informação.
  onSubmit: submitPageForm, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

