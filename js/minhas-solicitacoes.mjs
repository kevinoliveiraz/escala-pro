import { employee, requestText } from './core.mjs'; // Importa os recursos usados aqui.
import { db, state } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { renderTemplate, title, btn, icon, safe, status } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function myRequestsPage() { // Define esta rotina.
  const emp = employee(db, state.portalEmployee), // Prepara os valores usados no bloco.
    rs = db.requests.filter(r => r.employeeId === emp.id); // Organiza a lista de dados.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Minhas solicitações', 'Acompanhe suas folgas e indisponibilidades.', btn(icon('plus') + ' Nova solicitação', 'new-request', 'primary')), // Define esta informação.
    conteudo: rs.length ? rs.map(r => `<div class="portal-request"><div><b>${safe(requestText[r.type])}</b><small>${safe(r.start)} ${r.end !== r.start ? 'até ' + safe(r.end) : ''} • ${safe(r.reason || 'Sem motivo informado')}</small></div>${status(r.status)}</div>`).join('') : '<p>Você ainda não enviou solicitações.</p>' // Monta o conteúdo da interface.
  }); // Encerra este bloco.
} // Encerra este bloco.
const events = {}; // Prepara os valores usados no bloco.
startPage({ // Conecta a interação da página.
  id: 'my-requests', // Define esta informação.
  renderPage: myRequestsPage, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

