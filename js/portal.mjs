import { employee, labelMonth, eachDay, shift, requestText } from './core.mjs'; // Importa os recursos usados aqui.
import { db, state } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { renderTemplate, title, safe, monthBar, btn, icon, cardMetric, status } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function portalPage() { // Define esta rotina.
  const emp = employee(db, state.portalEmployee), // Prepara os valores usados no bloco.
    pub = db.publications[`${emp?.departmentId}:${state.month}`]; // Executa esta etapa.
  const ass = pub?.assignments.filter(a => a.employeeId === emp.id) || []; // Prepara os valores usados no bloco.
  const req = db.requests.filter(r => r.employeeId === emp?.id); // Prepara os valores usados no bloco.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Minha escala', `Olá, ${safe(emp?.name?.split(' ')[0] || 'colaborador')}. Confira seus turnos publicados.`, `${monthBar()}${btn(icon('plus') + ' Solicitar folga', 'new-request', 'primary')}`), // Define esta informação.
    conteudo: db.employees.filter(e => e.active).map(e => `<option value="${e.id}" ${emp?.id === e.id ? 'selected' : ''}>${safe(e.name)}</option>`).join(''), // Monta o conteúdo da interface.
    conteudo2: cardMetric(ass.length, 'Turnos publicados', 'Neste mês', 'calendar'), // Define esta informação.
    conteudo3: cardMetric(req.filter(r => r.status === 'approved').length, 'Pedidos aprovados', 'Meus pedidos', 'check'), // Organiza a lista de dados.
    conteudo4: cardMetric(req.filter(r => r.status === 'pending').length, 'Em análise', 'Aguardando gestor', 'clock'), // Organiza a lista de dados.
    conteudo5: safe(labelMonth(state.month)), // Define esta informação.
    conteudo6: pub ? '<span class="tag success">Escala publicada</span>' : '<span class="tag warning">Ainda não publicada</span>', // Monta o conteúdo da interface.
    conteudo7: pub ? `<div class="portal-days">${eachDay(state.month).map(day => { // Monta o conteúdo da interface.
      const a = ass.find(a => a.day === day), // Prepara os valores usados no bloco.
        s = a && shift(db, a.shiftId); // Executa esta etapa.
      return `<div class="portal-day ${a ? 'work' : 'off'}"><small>${day.slice(-2)}</small><strong>${s ? s.name : 'Folga'}</strong><span>${s ? s.start + ' – ' + s.end : '—'}</span></div>`; // Retorna o resultado.
    }).join('')}</div>` : '<div class="empty-simulation"><h3>A escala ainda não foi publicada</h3><p>Quando o gestor publicar o mês, seus turnos aparecerão aqui.</p></div>', // Continua a organização do bloco.
    conteudo8: req.length ? req.slice(0, 5).map(r => `<div class="portal-request"><div><b>${safe(requestText[r.type])}</b><small>${safe(r.start)}</small></div>${status(r.status)}</div>`).join('') : '<p>Nenhuma solicçitação.</p>', // Monta o conteúdo da interface.
    acao: btn(icon('plus') + ' Fazer solicitação', 'new-request', 'primary full') // Define esta informação.
  }); // Encerra este bloco.
} // Encerra este bloco.
const events = {}; // Prepara os valores usados no bloco.
startPage({ // Conecta a interação da página.
  id: 'portal', // Define esta informação.
  renderPage: portalPage, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

