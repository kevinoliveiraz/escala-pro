import { createSchedulePdf } from '../schedule-pdf.mjs'; // Importa os recursos usados aqui.
import { db, state } from './context.mjs'; // Importa os recursos usados aqui.
import { department, labelMonth } from '../core.mjs'; // Importa os recursos usados aqui.
import { openModal, safe, btn, icon, setModalCleanup, $ } from './ui.mjs'; // Importa os recursos usados aqui.
import { exportFile } from './data-tools.mjs'; // Importa os recursos usados aqui.
let pdfPreview = null; // Prepara os valores usados no bloco.
function openPdfPreview() { // Define esta rotina.
  const content = createSchedulePdf(db, state.month, state.departmentId); // Prepara os valores usados no bloco.
  const name = `EscalaPro_${state.month}.pdf`; // Prepara os valores usados no bloco.
  const url = URL.createObjectURL(new Blob([content], { // Prepara os valores usados no bloco.
    type: 'application/pdf' // Define esta informação.
  })); // Encerra este bloco.
  const description = `${department(db, state.departmentId)?.name || 'Setor'} · ${labelMonth(state.month)}`; // Prepara os valores usados no bloco.
  openModal('Prévia da escala em PDF', `<p class="pdf-preview-summary">${safe(description)}</p><iframe class="pdf-preview-frame" src="${safe(url)}#toolbar=0&navpanes=0&view=FitH" title="Prévia do PDF da escala"></iframe>`, `${btn('Fechar', 'close-modal', 'outline')}${btn(icon('download') + ' Baixar PDF', 'download-pdf', 'primary')}`, 'pdf-preview-modal'); // Monta o conteúdo da interface.
  pdfPreview = { // Executa esta etapa.
    content, // Executa esta etapa.
    name, // Executa esta etapa.
    url // Executa esta etapa.
  }; // Encerra este bloco.
  setModalCleanup(() => { // Executa esta etapa.
    URL.revokeObjectURL(url); // Executa esta etapa.
    pdfPreview = null; // Executa esta etapa.
  }); // Encerra este bloco.
  $('[data-action="download-pdf"]')?.focus(); // Posiciona o foco do teclado.
} // Encerra este bloco.
function downloadPdfPreview() { // Define esta rotina.
  if (pdfPreview) exportFile(pdfPreview.name, pdfPreview.content, 'application/pdf'); // Confere a condição.
} // Encerra este bloco.
export { openPdfPreview, downloadPdfPreview }; // Disponibiliza este recurso para outros arquivos.

