import { db, state, replaceDatabase, persist, navigate, render } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { renderTemplate, title, viewSelect, btn, icon, safe, notice } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { department, defaultRules } from './core.mjs'; // Importa os recursos usados aqui.
import { reset } from './storage.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function settingsPage() { // Define esta rotina.
  const rules = db.rules[state.departmentId] || defaultRules(db.shifts); // Prepara os valores usados no bloco.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Configurações', 'Defina restrições, cobertura e preferências de geração.', `${viewSelect()}${btn(icon('download') + ' Backup', 'export-json', 'outline')}${btn(icon('refresh') + ' Limpar dados', 'reset-data', 'outline red')}`), // Define esta informação.
    conteudo: safe(department(db, state.departmentId)?.name), // Define esta informação.
    conteudo2: rules.maxWeeklyHours, // Define esta informação.
    conteudo3: rules.maxConsecutive, // Define esta informação.
    conteudo4: rules.minRest, // Define esta informação.
    conteudo5: db.shifts.map(s => `<label class="setting-row"><span class="dot" style="background:${s.color}"></span><span><strong>${safe(s.name)}</strong><small>${s.start} – ${s.end}</small></span><input type="number" min="0" max="50" name="coverage_${s.id}" value="${rules.minStaff[s.id] || 0}" required></label>`).join(''), // Monta o conteúdo da interface.
    conteudo6: rules.balanceWeekends ? 'checked' : '', // Define esta informação.
    conteudo7: rules.avoidAlone ? 'checked' : '', // Define esta informação.
    icone: icon('save'), // Define esta informação.
    icone2: icon('alert'), // Define esta informação.
    acao: btn(icon('download') + ' Exportar backup JSON', 'export-json', 'outline'), // Define esta informação.
    acao2: btn(icon('file') + ' Importar backup', 'import-json', 'outline'), // Define esta informação.
    acao3: btn(icon('file') + ' Baixar escala em PDF', 'export-pdf', 'outline'), // Define esta informação.
    conteudo8: db.shifts.map(s => `<div class="setting-row"><span class="dot" style="background:${s.color}"></span><strong>${safe(s.name)}</strong><span>${s.start}–${s.end}</span></div>`).join('') // Monta o conteúdo da interface.
  }); // Encerra este bloco.
} // Encerra este bloco.
async function handlePageAction(el) { // Define esta rotina.
  const act = el.dataset.action; // Prepara os valores usados no bloco.
  const id = Number(el.dataset.id || 0); // Prepara os valores usados no bloco.
  switch (act) { // Executa esta etapa.
    case 'reset-data': // Trata esta opção.
      if (confirm('Tem certeza que deseja limpar os cadastros e escalas para começar do zero?')) { // Confere a condição.
        replaceDatabase(reset()); // Executa esta etapa.
        state.departmentId = db.departments[0]?.id ?? null; // Executa esta etapa.
        state.preview = null; // Executa esta etapa.
        persist(); // Salva os dados locais.
        navigate('escalas'); // Executa esta etapa.
        notice('Dados limpos. Cadastre seu primeiro setor.'); // Executa esta etapa.
      } // Encerra este bloco.
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
    case 'settings-form': // Trata esta opção.
      { // Encerra este bloco.
        const r = db.rules[state.departmentId];
        if (!r) throw Error('Cadastre um setor antes de configurar suas regras.'); // Prepara os valores usados no bloco.
        r.maxWeeklyHours = Number(val('maxWeeklyHours')); // Executa esta etapa.
        r.maxConsecutive = Number(val('maxConsecutive')); // Executa esta etapa.
        r.minRest = Number(val('minRest')); // Executa esta etapa.
        r.balanceWeekends = fd.has('balanceWeekends'); // Executa esta etapa.
        r.avoidAlone = fd.has('avoidAlone'); // Executa esta etapa.
        for (const s of db.shifts) { // Percorre os itens.
          r.minStaff[s.id] = Math.max(Number(val('coverage_' + s.id)), r.avoidAlone && Number(val('coverage_' + s.id)) > 0 ? 2 : 0); // Executa esta etapa.
        } // Encerra este bloco.
        persist(); // Salva os dados locais.
        render(); // Atualiza a página.
        notice('Regras atualizadas.'); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
const events = {}; // Prepara os valores usados no bloco.
startPage({ // Conecta a interação da página.
  id: 'configuracoes', // Define esta informação.
  renderPage: settingsPage, // Define esta informação.
  onAction: handlePageAction, // Define esta informação.
  onSubmit: submitPageForm, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

