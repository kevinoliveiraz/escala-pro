import { state, db, render, persist, navigate } from './shared/context.mjs'; // Importa os recursos usados aqui.
import { evaluate, eachDay, clone, putAssignment, generate } from './core.mjs'; // Importa os recursos usados aqui.
import { renderTemplate, title, monthBar, viewSelect, btn, icon, safe, cardMetric, notice } from './shared/ui.mjs'; // Importa os recursos usados aqui.
import { startPage } from './shared/boot.mjs'; // Importa os recursos usados aqui.
function simulationsPage() { // Define esta rotina.
  const p = state.preview, // Prepara os valores usados no bloco.
    now = evaluate(db, state.month, state.departmentId), // Executa esta etapa.
    out = p?.analysis; // Executa esta etapa.
  const types = [['absence', 'calendaroff', 'Funcionário precisa de folga', 'Encontrar substituição para uma data específica'], ['swap', 'swap', 'Trocar folgas ou turnos', 'Reorganizar sem refazer toda a escala'], ['rebuild', 'spark', 'Melhorar a escala inteira', 'Gerar uma distribuição equilibrada'], ['reduced', 'users', 'Equipe reduzida', 'Testar uma ausência mantendo cobertura']]; // Prepara os valores usados no bloco.
  return renderTemplate({ // Retorna o resultado.
    cabecalho: title('Simulações', 'Teste alterações antes de aplicar na escala oficial.', `${monthBar()}${viewSelect()}${btn(icon('refresh') + ' Limpar prévia', 'clear-preview', 'outline')}`), // Define esta informação.
    conteudo: types.map(([id, ic, name, desc]) => `<button type="button" class="choice ${state.scenario === id ? 'active' : ''}" data-scenario="${id}"><span>${icon(ic, 23)}</span><strong>${name}</strong><small>${desc}</small></button>`).join(''), // Monta o conteúdo da interface.
    conteudo2: state.scenario === 'rebuild' ? 'disabled' : '', // Define esta informação.
    conteudo3: db.employees.filter(e => e.active && e.departmentId === state.departmentId).map(e => `<option value="${e.id}" ${state.scenarioEmployee === e.id ? 'selected' : ''}>${safe(e.name)}</option>`).join(''), // Monta o conteúdo da interface.
    conteudo4: state.scenarioDate, // Define esta informação.
    conteudo5: state.scenario === 'rebuild' ? 'disabled' : '', // Define esta informação.
    conteudo6: state.scenario === 'swap' ? `<label>Funcionário que vai assumir<select name="employee2">${db.employees.filter(e => e.active && e.departmentId === state.departmentId && e.id !== state.scenarioEmployee).map(e => `<option value="${e.id}">${safe(e.name)}</option>`).join('')}</select></label>` : '', // Monta o conteúdo da interface.
    icone: icon('spark'), // Define esta informação.
    conteudo7: p ? `<span class="tag ${out.complete ? 'success' : 'warning'}">${out.complete ? 'Viável' : 'Com pendências'}</span>` : '', // Monta o conteúdo da interface.
    conteudo8: p ? `<div class="result-intro">${out.complete ? 'A proposta atende às restrições configuradas.' : 'A proposta possui lacunas ou conflitos e precisa de ajustes.'}</div><div class="diff-metrics">${cardMetric(out.percent + '%', 'Cobertura', 'Proposta', 'check')}${cardMetric(out.required.length, 'Lacunas', 'Faltas de pessoal', 'alert')}${cardMetric(out.conflicts.length, 'Conflitos', 'Restrições violadas', 'clock')}</div><div class="compare-list"><h3>Comparação</h3><div><span>Escala atual</span><strong>${now.percent}% cobertura</strong></div><div><span>Proposta</span><strong>${out.percent}% cobertura</strong></div><div><span>Alocações propostas</span><strong>${p.db.assignments.filter(a => a.departmentId === state.departmentId && a.day.startsWith(state.month)).length}</strong></div></div><div class="result-actions">${btn(icon('check') + ' Aplicar ao rascunho', 'apply-preview', 'primary')}${btn('Descartar', 'clear-preview', 'outline')}</div>` : `<div class="empty-simulation">${icon('spark', 40)}<h3>Nenhuma simulação executada</h3><p>Selecione o tipo de alteração, informe os dados e gere uma proposta. Nenhuma mudança será aplicada antes da sua confirmação.</p></div>`, // Monta o conteúdo da interface.
    conteudo9: p ? `<div class="panel extra-simulation"><h2>3. Visualização de cobertura no mês</h2><div class="coverage-days">${eachDay(state.month).map(day => { // Monta o conteúdo da interface.
      const req = p.analysis.coverage.filter(c => c.day === day), // Prepara os valores usados no bloco.
        ok = req.every(c => c.got >= c.min); // Executa esta etapa.
      return `<div title="${day}" class="coverage-square ${ok ? 'good' : 'bad'}"><small>${day.slice(-2)}</small></div>`; // Retorna o resultado.
    }).join('')}</div><p class="subdued">Verde: cobertura mínima cumprida. Laranja: faltam pessoas em algum turno. Esta é uma prévia, não uma publicação.</p></div>` : '' // Continua a organização do bloco.
  }); // Encerra este bloco.
} // Encerra este bloco.
async function handlePageAction(el) { // Define esta rotina.
  const act = el.dataset.action; // Prepara os valores usados no bloco.
  const id = Number(el.dataset.id || 0); // Prepara os valores usados no bloco.
  switch (act) { // Executa esta etapa.
    case 'clear-preview': // Trata esta opção.
      state.preview = null; // Executa esta etapa.
      render(); // Atualiza a página.
      break; // Finaliza esta opção.
    case 'apply-preview': // Trata esta opção.
      if (!state.preview) return; // Confere a condição.
      { // Encerra este bloco.
        const proposal = state.preview; // Prepara os valores usados no bloco.
        if (!confirm(`Aplicar ${proposal.db.assignments.filter(a => a.day.startsWith(state.month) && a.departmentId === state.departmentId).length} alocações na escala do mês?`)) break; // Confere a condição.
        db.assignments = proposal.db.assignments; // Executa esta etapa.
        db.sequence = proposal.db.sequence; // Executa esta etapa.
        delete db.publications[`${state.departmentId}:${state.month}`]; // Executa esta etapa.
        persist(); // Salva os dados locais.
        state.preview = null; // Executa esta etapa.
        navigate('escalas', { // Executa esta etapa.
          preview: null // Define esta informação.
        }); // Encerra este bloco.
        notice('Proposta aplicada ao rascunho.'); // Executa esta etapa.
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
  switch (form.id) { // Executa esta etapa.
    case 'simulation-form': // Trata esta opção.
      { // Encerra este bloco.
        const emp = Number(val('employee')), // Prepara os valores usados no bloco.
          date = val('date'), // Executa esta etapa.
          exclude = state.scenario === 'rebuild' ? [] : [{ // Executa esta etapa.
            employeeId: emp, // Define esta informação.
            day: date // Define esta informação.
          }]; // Encerra este bloco.
        if (exclude.length && !date.startsWith(state.month)) throw Error('A data precisa estar dentro do mês selecionado.'); // Confere a condição.
        let generated; // Prepara os valores usados no bloco.
        if (state.scenario === 'swap') { // Confere a condição.
          const otherId = Number(val('employee2')), // Prepara os valores usados no bloco.
            source = db.assignments.find(a => a.employeeId === emp && a.day === date && a.departmentId === state.departmentId); // Executa esta etapa.
          if (!source) throw Error('O funcionário de origem não está escalado nessa data.'); // Confere a condição.
          if (emp === otherId) throw Error('Escolha dois funcionários diferentes.'); // Confere a condição.
          const alternate = db.assignments.find(a => a.employeeId === otherId && a.day === date && a.departmentId === state.departmentId), // Prepara os valores usados no bloco.
            preview = clone(db); // Executa esta etapa.
          preview.assignments = preview.assignments.filter(a => a.id !== source.id && a.id !== alternate?.id); // Organiza a lista de dados.
          const one = putAssignment(preview, { // Prepara os valores usados no bloco.
            employeeId: otherId, // Define esta informação.
            departmentId: state.departmentId, // Define esta informação.
            day: date, // Define esta informação.
            shiftId: source.shiftId // Define esta informação.
          }); // Encerra este bloco.
          if (!one.ok) throw Error('Troca inviável: ' + one.errors.join(' ')); // Confere a condição.
          if (alternate) { // Confere a condição.
            const two = putAssignment(preview, { // Prepara os valores usados no bloco.
              employeeId: emp, // Define esta informação.
              departmentId: state.departmentId, // Define esta informação.
              day: date, // Define esta informação.
              shiftId: alternate.shiftId // Define esta informação.
            }); // Encerra este bloco.
            if (!two.ok) throw Error('Troca inviável: ' + two.errors.join(' ')); // Confere a condição.
          } // Encerra este bloco.
          generated = { // Executa esta etapa.
            db: preview, // Define esta informação.
            analysis: evaluate(preview, state.month, state.departmentId) // Define esta informação.
          }; // Encerra este bloco.
        } else generated = generate(db, state.month, state.departmentId, { // Continua a organização do bloco.
          preserve: fd.has('preserve'), // Define esta informação.
          exclude // Executa esta etapa.
        }); // Encerra este bloco.
        state.preview = generated; // Executa esta etapa.
        state.scenarioEmployee = emp; // Executa esta etapa.
        state.scenarioDate = date; // Executa esta etapa.
        render(); // Atualiza a página.
        notice(generated.analysis.complete ? 'Proposta gerada sem conflitos.' : 'Prévia gerada com pendências de cobertura.', generated.analysis.complete ? 'ok' : 'warn'); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
    default: // Define esta informação.
      return false; // Retorna o resultado.
  } // Encerra este bloco.
  return true; // Retorna o resultado.
} // Encerra este bloco.
const events = { // Prepara os valores usados no bloco.
  click(event) { // Executa esta etapa.
    const option = event.target.closest('[data-scenario]'); // Prepara os valores usados no bloco.
    if (option) { // Confere a condição.
      state.scenario = option.dataset.scenario; // Executa esta etapa.
      state.preview = null; // Executa esta etapa.
      render(); // Atualiza a página.
    } // Encerra este bloco.
  } // Encerra este bloco.
}; // Encerra este bloco.
startPage({ // Conecta a interação da página.
  id: 'simulacoes', // Define esta informação.
  renderPage: simulationsPage, // Define esta informação.
  onAction: handlePageAction, // Define esta informação.
  onSubmit: submitPageForm, // Define esta informação.
  events // Executa esta etapa.
}); // Encerra este bloco.

