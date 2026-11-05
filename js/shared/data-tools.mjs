import { state, db, replaceDatabase, persist, render } from './context.mjs'; // Importa os recursos usados aqui.
import { csvRows } from '../core.mjs'; // Importa os recursos usados aqui.
import { $, notice } from './ui.mjs'; // Importa os recursos usados aqui.
function exportFile(name, content, type) { // Define esta rotina.
  const blob = new Blob([content], { // Prepara os valores usados no bloco.
      type // Executa esta etapa.
    }), // Encerra este bloco.
    url = URL.createObjectURL(blob), // Executa esta etapa.
    a = document.createElement('a'); // Executa esta etapa.
  a.href = url; // Executa esta etapa.
  a.download = name; // Executa esta etapa.
  document.body.appendChild(a); // Executa esta etapa.
  a.click(); // Executa esta etapa.
  a.remove(); // Executa esta etapa.
  setTimeout(() => URL.revokeObjectURL(url), 3000); // Executa esta etapa.
} // Encerra este bloco.
function csvContent(rows) { // Define esta rotina.
  return '\ufeff' + rows.map(row => row.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(';')).join('\r\n'); // Retorna o resultado.
} // Encerra este bloco.
export async function handleDataAction(action) { // Disponibiliza este recurso para outros arquivos.
  switch (action) { // Executa esta etapa.
    case 'export-csv': // Trata esta opção.
      exportFile(`EscalaPro_${state.month}.csv`, csvContent(csvRows(db, state.month, state.departmentId)), 'text/csv;charset=utf-8'); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'export-json': // Trata esta opção.
      exportFile(`EscalaPro_backup_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(db, null, 2), 'application/json'); // Executa esta etapa.
      break; // Finaliza esta opção.
    case 'import-json': // Trata esta opção.
      { // Encerra este bloco.
        $('#backup-input')?.remove(); // Executa esta etapa.
        const input = document.createElement('input'); // Prepara os valores usados no bloco.
        input.id = 'backup-input'; // Executa esta etapa.
        input.type = 'file'; // Executa esta etapa.
        input.accept = '.json,application/json'; // Executa esta etapa.
        input.style.display = 'none'; // Executa esta etapa.
        input.onchange = async () => { // Executa esta etapa.
          try { // Controla possíveis falhas.
            if (!input.files?.[0]) return; // Confere a condição.
            const data = JSON.parse(await input.files[0].text()); // Prepara os valores usados no bloco.
            if (!Array.isArray(data.employees) || !Array.isArray(data.departments) || !Array.isArray(data.shifts) || !Array.isArray(data.assignments) || !data.rules || data.daysOff !== undefined && !Array.isArray(data.daysOff)) throw Error('Estrutura de backup inválida.'); // Confere a condição.
            if (confirm('Substituir todos os dados atuais pelo backup?')) { // Confere a condição.
              replaceDatabase(data); // Executa esta etapa.
              state.departmentId = db.departments[0].id; // Executa esta etapa.
              state.preview = null; // Executa esta etapa.
              persist(); // Salva os dados locais.
              render(); // Atualiza a página.
              notice('Backup importado.'); // Executa esta etapa.
            } // Encerra este bloco.
          } catch (error) { // Continua a organização do bloco.
            notice(error.message, 'error'); // Executa esta etapa.
          } finally { // Continua a organização do bloco.
            input.remove(); // Executa esta etapa.
          } // Encerra este bloco.
        }; // Encerra este bloco.
        document.body.appendChild(input); // Executa esta etapa.
        input.click(); // Executa esta etapa.
        break; // Finaliza esta opção.
      } // Encerra este bloco.
  } // Encerra este bloco.
} // Encerra este bloco.
export { exportFile, csvContent }; // Disponibiliza este recurso para outros arquivos.

