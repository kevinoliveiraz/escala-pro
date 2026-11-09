import { evaluate, eachDay } from './core.mjs'; // Importa os recursos usados aqui.
import { db, state } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { renderTemplate, title, monthBar, viewSelect, btn, icon, cardMetric, safe } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
import { schedulePreviewBar } from './shared/schedule-preview-ui.mjs';
function reportsPage() { // Define esta rotina.
  const data = evaluate(db, state.month, state.departmentId), // Prepara os valores usados no bloco.
    weekends = [...data.balance].sort((a, b) => b.days - a.days); // Organiza a lista de dados.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Relatórios', 'Indicadores derivados das alocações e regras reais, sem dados inventados.', `${monthBar()}${viewSelect()}${btn(icon('download') + ' Exportar CSV', 'export-csv', 'primary')}`), // Define esta informação.
    versoes: schedulePreviewBar(),
    conteudo: cardMetric(data.staff, 'Funcionários', 'Neste setor', 'users'), // Define esta informação.
    conteudo2: cardMetric(data.percent + '%', 'Cobertura', `${data.filled}/${data.need} posições`, 'chart'), // Define esta informação.
    conteudo3: cardMetric(data.required.length, 'Lacunas', 'Turnos sem cobertura', 'alert'), // Define esta informação.
    conteudo4: cardMetric(data.spread, 'Diferença de jornadas', 'Maior – menor nº de dias', 'clock'), // Define esta informação.
    conteudo5: eachDay(state.month).map(day => { // Organiza a lista de dados.
      const list = data.coverage.filter(c => c.day === day), // Prepara os valores usados no bloco.
        n = list.reduce((a, c) => a + c.min, 0), // Executa esta etapa.
        f = list.reduce((a, c) => a + Math.min(c.min, c.got), 0), // Executa esta etapa.
        percent = n ? f / n * 100 : 100; // Executa esta etapa.
      return `<div class="bar-col" title="${day}: ${Math.round(percent)}%"><div class="bar" style="height:${Math.max(4, percent)}%;--fill:${percent === 100 ? '#169b86' : '#e09e4a'}"></div><small>${day.slice(-2)}</small></div>`; // Retorna o resultado.
    }).join(''), // Continua a organização do bloco.
    conteudo6: weekends.slice(0, 12).map(row => `<div class="person-bar"><span>${safe(row.name)}</span><div><i style="width:${Math.round(row.days / Math.max(...weekends.map(x => x.days), 1) * 100)}%"></i></div><b>${row.days}</b></div>`).join(''), // Monta o conteúdo da interface.
    conteudo7: data.balance.map(row => `<div class="data-row"><span>${safe(row.name)}</span><span>${row.days}</span><span>${row.hours.toFixed(0)}h</span><span>${row.weekends}</span></div>`).join('') // Monta o conteúdo da interface.
  }); // Encerra este bloco.
} // Encerra este bloco.
const events = {}; // Prepara os valores usados no bloco.
startPage({ // Conecta a interação da página.
  id: 'relatorios', // Define esta informação.
  renderPage: reportsPage, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

