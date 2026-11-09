import { db, state, setRenderer, render, saveView, navigate, moveMonth, restoreSchedulePreview, selectSchedulePreview } from './context.mjs'; // Importa os recursos usados aqui.
import { $, layout, closeModal, notice } from './ui.mjs'; // Importa os recursos usados aqui.
import { openSchedulePreviewForm, submitSchedulePreview } from './schedule-preview-ui.mjs';
async function sharedAction(button) { // Define esta rotina.
  switch (button.dataset.action) { // Executa esta etapa.
    case 'toggle-menu': // Trata esta opção.
      state.menuOpen = !state.menuOpen; // Executa esta etapa.
      render(); // Atualiza a página.
      $(state.menuOpen ? '.header-nav a' : '.menu-toggle')?.focus(); // Posiciona o foco do teclado.
      break; // Finaliza esta opção.
    case 'switch-role': // Trata esta opção.
      navigate(state.currentRole === 'admin' ? 'portal' : 'escalas'); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'notification': // Trata esta opção.
      notice(`${db.requests.filter(request => request.status === 'pending').length} solicitação(ões) pendente(s).`); // Organiza a lista de dados.
      break; // Finaliza esta opção.
    case 'previous-month': // Trata esta opção.
      moveMonth(-1); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'next-month': // Trata esta opção.
      moveMonth(1); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'close-modal': // Trata esta opção.
      closeModal(); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'new-schedule-preview':
      openSchedulePreviewForm(button.dataset.source === 'simulation');
      break;
    case 'new-request': // Trata esta opção.
      { // Encerra este bloco.
        const requests = await import('./requests.mjs'); // Prepara os valores usados no bloco.
        requests.requestModal(); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'export-pdf': // Trata esta opção.
      { // Encerra este bloco.
        const pdf = await import('./pdf-preview.mjs'); // Prepara os valores usados no bloco.
        pdf.openPdfPreview(); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'download-pdf': // Trata esta opção.
      { // Encerra este bloco.
        const pdf = await import('./pdf-preview.mjs'); // Prepara os valores usados no bloco.
        pdf.downloadPdfPreview(); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    case 'export-csv': // Trata esta opção.
    case 'export-json': // Trata esta opção.
    case 'import-json': // Trata esta opção.
      { // Encerra este bloco.
        const tools = await import('./data-tools.mjs'); // Prepara os valores usados no bloco.
        await tools.handleDataAction(button.dataset.action); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
export function startPage({ // Disponibiliza este recurso para outros arquivos.
  id, // Executa esta etapa.
  renderPage, // Executa esta etapa.
  onAction = () => false, // Executa esta etapa.
  onSubmit = () => false, // Executa esta etapa.
  events = {} // Executa esta etapa.
}) { // Continua a organização do bloco.
  state.page = id; // Executa esta etapa.
  restoreSchedulePreview();
  state.currentRole = ['portal', 'my-requests'].includes(id) ? 'employee' : 'admin'; // Executa esta etapa.
  state.menuOpen = false; // Executa esta etapa.
  setRenderer(() => { // Executa esta etapa.
    $('#app').innerHTML = layout(renderPage()); // Monta o conteúdo da interface.
    document.title = `${document.body.dataset.title || 'Escalas'} • EscalaPro`; // Executa esta etapa.
  }); // Encerra este bloco.
  document.addEventListener('click', async event => { // Conecta a interação da página.
    const backdrop = event.target.closest('.modal-backdrop'); // Prepara os valores usados no bloco.
    if (backdrop && event.target === backdrop) { // Confere a condição.
      closeModal(); // Executa esta etapa.
      return; // Retorna o resultado.
    } // Encerra este bloco.
    const link = event.target.closest('a[data-page]'); // Identifica somente os links do menu.
    if (link) { // Confere a condição.
      saveView(); // Executa esta etapa.
      return; // Retorna o resultado.
    } // Encerra este bloco.
    const button = event.target.closest('[data-action]'); // Prepara os valores usados no bloco.
    if (button) { // Confere a condição.
      if (event.target.closest('[data-day]')) event.stopPropagation(); // Confere a condição.
      try { // Controla possíveis falhas.
        if (!(await sharedAction(button))) await onAction(button); // Confere a condição.
      } catch (error) { // Continua a organização do bloco.
        notice(error.message, 'error'); // Executa esta etapa.
      } // Encerra este bloco.
      return; // Retorna o resultado.
    } // Encerra este bloco.
    events.click?.(event); // Executa esta etapa.
  }); // Encerra este bloco.
  document.addEventListener('submit', async event => { // Conecta a interação da página.
    const formId = event.target.getAttribute('id');
    if (!formId) return; // Confere a condição.
    event.preventDefault(); // Executa esta etapa.
    try { // Controla possíveis falhas.
      if (formId === 'request-form') { // Confere a condição.
        const requests = await import('./requests.mjs'); // Prepara os valores usados no bloco.
        requests.submitRequest(event.target); // Executa esta etapa.
      } else if (formId === 'schedule-preview-form') {
        submitSchedulePreview(event.target);
      } else await onSubmit(event.target); // Continua a organização do bloco.
    } catch (error) { // Continua a organização do bloco.
      notice(error.message, 'error'); // Executa esta etapa.
    } // Encerra este bloco.
  }); // Encerra este bloco.
  document.addEventListener('change', event => { // Conecta a interação da página.
    const input = event.target; // Prepara os valores usados no bloco.
    if (input.id === 'schedule-preview-select') {
      try {
        selectSchedulePreview(input.value);
        render();
        $('#schedule-preview-select')?.focus();
      } catch (error) {
        input.value = state.schedulePreviewId;
        notice(error.message, 'error');
      }
    } else if (input.id === 'department-switch') { // Confere a condição.
      state.departmentId = Number(input.value); // Executa esta etapa.
      state.selectedEmployee = null; // Executa esta etapa.
      state.preview = null; // Executa esta etapa.
      render(); // Atualiza a página.
    } else if (input.id === 'month-choice') { // Continua a organização do bloco.
      state.month = input.value; // Executa esta etapa.
      state.day = state.month + '-01'; // Executa esta etapa.
      state.scenarioDate = state.day; // Executa esta etapa.
      state.preview = null; // Executa esta etapa.
      render(); // Atualiza a página.
    } else if (input.id === 'portal-employee') { // Continua a organização do bloco.
      state.portalEmployee = Number(input.value); // Executa esta etapa.
      render(); // Atualiza a página.
    } else events.change?.(event); // Continua a organização do bloco.
  }); // Encerra este bloco.
  document.addEventListener('keydown', event => { // Conecta a interação da página.
    if (event.key === 'Escape') { // Confere a condição.
      closeModal(); // Executa esta etapa.
      if (state.menuOpen) { // Confere a condição.
        state.menuOpen = false; // Executa esta etapa.
        render(); // Atualiza a página.
        $('.menu-toggle')?.focus(); // Posiciona o foco do teclado.
      } // Encerra este bloco.
    } // Encerra este bloco.
    events.keydown?.(event); // Executa esta etapa.
  }); // Encerra este bloco.
  for (const [name, handler] of Object.entries(events)) if (!['click', 'change', 'keydown'].includes(name)) document.addEventListener(name, handler); // Percorre os itens.
  render(); // Atualiza a página.
} // Encerra este bloco.

