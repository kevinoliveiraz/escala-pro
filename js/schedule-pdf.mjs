import { eachDay, labelMonth, weekDay, dayStatus } from './core.mjs'; // Importa os recursos usados aqui.
const STATUS = { // Prepara os valores usados no bloco.
  plantao: 'P', // Define esta informação.
  folga: 'F', // Define esta informação.
  ferias: 'FE', // Define esta informação.
  ausencia: 'A', // Define esta informação.
  unassigned: '-' // Define esta informação.
}; // Encerra este bloco.
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; // Prepara os valores usados no bloco.
const PALETTE = ['#24558a', '#176b69', '#6c528d']; // Prepara os valores usados no bloco.
const cp1252 = new Map([[0x20ac, 128], [0x201a, 130], [0x192, 131], [0x201e, 132], [0x2026, 133], [0x2020, 134], [0x2021, 135], [0x2c6, 136], [0x2030, 137], [0x160, 138], [0x2039, 139], [0x152, 140], [0x17d, 142], [0x2018, 145], [0x2019, 146], [0x201c, 147], [0x201d, 148], [0x2022, 149], [0x2013, 150], [0x2014, 151], [0x2dc, 152], [0x2122, 153], [0x161, 154], [0x203a, 155], [0x153, 156], [0x17e, 158], [0x178, 159]]); // Prepara os valores usados no bloco.
const REGULAR = [761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 761, 556, 556, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 556, 611, 556, 556, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 556, 500, 667, 278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500]; // Prepara os valores usados no bloco.
const BOLD = [761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 761, 278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 761, 556, 611, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 611, 611, 611, 611, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 611, 500, 667, 278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556]; // Prepara os valores usados no bloco.
function encoded(text) { // Define esta rotina.
  return Array.from(String(text ?? '').replace(/[\r\n\t]/g, ' '), ch => { // Retorna o resultado.
    const n = ch.codePointAt(0); // Prepara os valores usados no bloco.
    if (n >= 32 && n <= 255) return n; // Confere a condição.
    return cp1252.get(n) ?? ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').charCodeAt(0); // Retorna o resultado.
  }).map(n => n >= 32 && n <= 255 ? n : 63); // Continua a organização do bloco.
} // Encerra este bloco.
function literal(text) { // Define esta rotina.
  return '(' + encoded(text).map(n => n === 40 || n === 41 || n === 92 ? '\\' + String.fromCharCode(n) : n >= 127 ? '\\' + n.toString(8).padStart(3, '0') : String.fromCharCode(n)).join('') + ')'; // Retorna o resultado.
} // Encerra este bloco.
function width(text, size, bold = false) { // Define esta rotina.
  const metrics = bold ? BOLD : REGULAR; // Prepara os valores usados no bloco.
  return encoded(text).reduce((sum, n) => sum + (metrics[n] || 556), 0) * size / 1000; // Retorna o resultado.
} // Encerra este bloco.
function wrap(text, maxWidth, size, bold = false) { // Define esta rotina.
  const words = String(text || '').trim().split(/\s+/), // Prepara os valores usados no bloco.
    lines = []; // Executa esta etapa.
  let line = ''; // Prepara os valores usados no bloco.
  for (const word of words) { // Percorre os itens.
    if (width((line ? line + ' ' : '') + word, size, bold) <= maxWidth) { // Confere a condição.
      line += (line ? ' ' : '') + word; // Executa esta etapa.
      continue; // Executa esta etapa.
    } // Encerra este bloco.
    if (line) { // Confere a condição.
      lines.push(line); // Executa esta etapa.
      line = ''; // Executa esta etapa.
    } // Encerra este bloco.
    for (const char of word) { // Percorre os itens.
      if (line && width(line + char, size, bold) > maxWidth) { // Confere a condição.
        lines.push(line); // Executa esta etapa.
        line = ''; // Executa esta etapa.
      } // Encerra este bloco.
      line += char; // Executa esta etapa.
    } // Encerra este bloco.
  } // Encerra este bloco.
  if (line) lines.push(line); // Confere a condição.
  return lines.length ? lines : ['']; // Retorna o resultado.
} // Encerra este bloco.
function fit(text, maxWidth, size, bold = false) { // Define esta rotina.
  let out = String(text || ''); // Prepara os valores usados no bloco.
  if (width(out, size, bold) <= maxWidth) return out; // Confere a condição.
  while (out && width(out + '...', size, bold) > maxWidth) out = out.slice(0, -1); // Percorre os itens.
  return out + '...'; // Retorna o resultado.
} // Encerra este bloco.
export function buildScheduleReport(db, month, departmentId) { // Disponibiliza este recurso para outros arquivos.
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw Error('Mês inválido para o PDF.'); // Confere a condição.
  const department = db.departments.find(item => item.id === Number(departmentId)); // Prepara os valores usados no bloco.
  if (!department) throw Error('Setor não encontrado para o PDF.'); // Confere a condição.
  const days = eachDay(month); // Prepara os valores usados no bloco.
  const assignments = db.assignments.filter(item => item.departmentId === department.id && item.day.startsWith(month)); // Prepara os valores usados no bloco.
  const assignedIds = new Set(assignments.map(item => item.employeeId)); // Prepara os valores usados no bloco.
  const workers = db.employees.filter(person => person.active && person.departmentId === department.id || assignedIds.has(person.id)); // Prepara os valores usados no bloco.
  const shifts = db.shifts.map((item, i) => ({ // Prepara os valores usados no bloco.
    ...item, // Executa esta etapa.
    code: 'P' + (i + 1), // Define esta informação.
    color: PALETTE[i % PALETTE.length], // Define esta informação.
    rows: [] // Define esta informação.
  })); // Encerra este bloco.
  let hasAlternate = false; // Prepara os valores usados no bloco.
  for (const person of workers) { // Percorre os itens.
    const own = assignments.filter(item => item.employeeId === person.id); // Prepara os valores usados no bloco.
    const counts = new Map(shifts.map(item => [item.id, own.filter(a => a.shiftId === item.id).length])); // Prepara os valores usados no bloco.
    const primary = [...shifts].sort((a, b) => counts.get(b.id) - counts.get(a.id) || (b.id === person.preferredShiftId) - (a.id === person.preferredShiftId) || a.id - b.id)[0]; // Prepara os valores usados no bloco.
    if (!primary) continue; // Confere a condição.
    const cells = days.map(day => { // Prepara os valores usados no bloco.
      const info = dayStatus(db, person.id, day); // Prepara os valores usados no bloco.
      const assignment = own.find(item => item.day === day); // Prepara os valores usados no bloco.
      if (info.status === 'plantao' && !assignment) return { // Confere a condição.
        day, // Executa esta etapa.
        status: 'unassigned', // Define esta informação.
        code: '-' // Define esta informação.
      }; // Encerra este bloco.
      const alternate = info.status === 'plantao' && assignment.shiftId !== primary.id; // Prepara os valores usados no bloco.
      const actual = alternate ? shifts.find(item => item.id === assignment.shiftId) : null; // Prepara os valores usados no bloco.
      if (actual) hasAlternate = true; // Confere a condição.
      return { // Retorna o resultado.
        day, // Executa esta etapa.
        status: info.status, // Define esta informação.
        code: actual?.code || STATUS[info.status] || '-' // Define esta informação.
      }; // Encerra este bloco.
    }); // Encerra este bloco.
    primary.rows.push({ // Executa esta etapa.
      id: person.id, // Define esta informação.
      name: person.name, // Define esta informação.
      role: person.role || '', // Define esta informação.
      cells // Executa esta etapa.
    }); // Encerra este bloco.
  } // Encerra este bloco.
  for (const group of shifts) group.rows.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR') || a.id - b.id); // Percorre os itens.
  return { // Retorna o resultado.
    month, // Executa esta etapa.
    title: labelMonth(month).replace(' de ', ' '), // Define esta informação.
    department: department.name, // Define esta informação.
    organization: db.org === 'Minha organização' ? '' : db.org || '', // Define esta informação.
    days, // Executa esta etapa.
    groups: shifts.filter(item => item.rows.length), // Organiza a lista de dados.
    staff: workers.length, // Define esta informação.
    hasAlternate, // Executa esta etapa.
    shifts, // Executa esta etapa.
    published: !!db.publications?.[`${department.id}:${month}`] // Define esta informação.
  }; // Encerra este bloco.
} // Encerra este bloco.
const PAGE_W = 841.89, // Prepara os valores usados no bloco.
  PAGE_H = 595.28, // Executa esta etapa.
  MARGIN = 28, // Executa esta etapa.
  TABLE_W = PAGE_W - MARGIN * 2, // Executa esta etapa.
  NAME_W = 170, // Executa esta etapa.
  TIME_W = 62, // Executa esta etapa.
  HEADER_Y = 108, // Executa esta etapa.
  HEADER_H = 29, // Executa esta etapa.
  CONTENT_BOTTOM = 516; // Executa esta etapa.
const INK = '#18354c', // Prepara os valores usados no bloco.
  MUTED = '#6b7c8d', // Executa esta etapa.
  GRID = '#dde5ec'; // Executa esta etapa.
const number = n => Number(n.toFixed(3)).toString(); // Prepara os valores usados no bloco.
const rgb = hex => hex.replace('#', '').match(/../g).map(part => number(parseInt(part, 16) / 255)).join(' '); // Prepara os valores usados no bloco.
class Page { // Executa esta etapa.
  constructor() { // Executa esta etapa.
    this.commands = []; // Executa esta etapa.
  } // Encerra este bloco.
  rect(x, y, w, h, fill) { // Executa esta etapa.
    this.commands.push(`${rgb(fill)} rg ${number(x)} ${number(PAGE_H - y - h)} ${number(w)} ${number(h)} re f`); // Executa esta etapa.
  } // Encerra este bloco.
  line(x1, y1, x2, y2, color = GRID, thickness = .4) { // Executa esta etapa.
    this.commands.push(`${rgb(color)} RG ${number(thickness)} w ${number(x1)} ${number(PAGE_H - y1)} m ${number(x2)} ${number(PAGE_H - y2)} l S`); // Executa esta etapa.
  } // Encerra este bloco.
  text(text, x, y, size = 8, color = INK, bold = false, align = 'left') { // Executa esta etapa.
    const offset = align === 'center' ? width(text, size, bold) / 2 : align === 'right' ? width(text, size, bold) : 0; // Prepara os valores usados no bloco.
    this.commands.push(`BT /F${bold ? 2 : 1} ${number(size)} Tf ${rgb(color)} rg 1 0 0 1 ${number(x - offset)} ${number(PAGE_H - y - size * .82)} Tm ${literal(text)} Tj ET`); // Executa esta etapa.
  } // Encerra este bloco.
} // Encerra este bloco.
function pageHeader(page, report, sample) { // Define esta rotina.
  page.rect(MARGIN, 25, 24, 24, INK); // Executa esta etapa.
  page.line(MARGIN + 6, 33, MARGIN + 18, 33, '#ffffff', 1); // Executa esta etapa.
  page.line(MARGIN + 6, 37, MARGIN + 18, 37, '#ffffff', 1); // Executa esta etapa.
  page.line(MARGIN + 6, 41, MARGIN + 13, 41, '#ffffff', 1); // Executa esta etapa.
  page.text('EscalaPro', MARGIN + 33, 26, 18, INK, true); // Executa esta etapa.
  page.text('ESCALA MENSAL DE TRABALHO', MARGIN + 34, 47, 6.5, MUTED, true); // Executa esta etapa.
  page.text(report.title, PAGE_W - MARGIN, 26, 21, INK, true, 'right'); // Executa esta etapa.
  page.text(`${report.staff} funcionários  /  ${report.days.length} dias  /  ${report.groups.length} turnos`, PAGE_W - MARGIN, 52, 8, MUTED, false, 'right'); // Executa esta etapa.
  page.text(fit(report.department, TABLE_W - 180, 17, true), MARGIN, 71, 17, INK, true); // Executa esta etapa.
  const status = sample ? 'MODELO DE TESTE' : report.published ? 'ESCALA PUBLICADA' : 'RASCUNHO'; // Prepara os valores usados no bloco.
  page.text(status, PAGE_W - MARGIN, 76, 7.5, report.published ? '#176b69' : '#6c7b8a', true, 'right'); // Executa esta etapa.
  if (report.organization) page.text(fit(report.organization, TABLE_W - 200, 7), MARGIN, 92, 7, MUTED); // Confere a condição.
  page.line(MARGIN, 102, PAGE_W - MARGIN, 102, INK, .7); // Executa esta etapa.
} // Encerra este bloco.
function tableHeader(page, report) { // Define esta rotina.
  const dayW = (TABLE_W - NAME_W - TIME_W) / report.days.length; // Prepara os valores usados no bloco.
  page.rect(MARGIN, HEADER_Y, TABLE_W, HEADER_H, '#eef3f7'); // Executa esta etapa.
  page.text('FUNCIONÁRIO', MARGIN + 10, HEADER_Y + 11, 7, INK, true); // Executa esta etapa.
  page.text('HORÁRIO', MARGIN + NAME_W + TIME_W / 2, HEADER_Y + 11, 6.5, INK, true, 'center'); // Executa esta etapa.
  report.days.forEach((day, i) => { // Executa esta etapa.
    const x = MARGIN + NAME_W + TIME_W + i * dayW, // Prepara os valores usados no bloco.
      weekend = [0, 6].includes(weekDay(day)); // Executa esta etapa.
    if (weekend) page.rect(x, HEADER_Y, dayW, HEADER_H, '#e0e9f0'); // Confere a condição.
    page.text(String(i + 1).padStart(2, '0'), x + dayW / 2, HEADER_Y + 5, 8, INK, true, 'center'); // Executa esta etapa.
    page.text(WEEKDAYS[weekDay(day)], x + dayW / 2, HEADER_Y + 17, 6.3, MUTED, false, 'center'); // Executa esta etapa.
  }); // Encerra este bloco.
  page.line(MARGIN, HEADER_Y + HEADER_H, PAGE_W - MARGIN, HEADER_Y + HEADER_H, GRID, .7); // Executa esta etapa.
} // Encerra este bloco.
function groupHeader(page, group, y, continued = false) { // Define esta rotina.
  page.rect(MARGIN, y, TABLE_W, 22, '#edf2f6'); // Executa esta etapa.
  page.rect(MARGIN, y, 3, 22, group.color); // Executa esta etapa.
  page.text(fit(group.name.toLocaleUpperCase('pt-BR') + (continued ? ' (CONTINUAÇÃO)' : ''), TABLE_W - 220, 8, true), MARGIN + 10, y + 7, 8, group.color, true); // Executa esta etapa.
  page.text(`${group.rows.length} funcionários  /  ${group.start}-${group.end}`, PAGE_W - MARGIN - 10, y + 7, 7, MUTED, false, 'right'); // Executa esta etapa.
} // Encerra este bloco.
function employeeRow(page, report, group, row, y, height, index) { // Define esta rotina.
  const dayW = (TABLE_W - NAME_W - TIME_W) / report.days.length; // Prepara os valores usados no bloco.
  page.rect(MARGIN, y, TABLE_W, height, index % 2 ? '#f8fafc' : '#ffffff'); // Executa esta etapa.
  const nameLines = wrap(row.name, NAME_W - 20, 8, true); // Prepara os valores usados no bloco.
  nameLines.forEach((line, i) => page.text(line, MARGIN + 10, y + 5 + i * 9, 8, INK, true)); // Executa esta etapa.
  if (row.role) page.text(fit(row.role, NAME_W - 20, 6.2), MARGIN + 10, y + 6 + nameLines.length * 9, 6.2, MUTED); // Confere a condição.
  page.text(`${group.start}-${group.end}`, MARGIN + NAME_W + TIME_W / 2, y + (height - 7) / 2, 7, MUTED, false, 'center'); // Executa esta etapa.
  row.cells.forEach((cell, i) => { // Executa esta etapa.
    const x = MARGIN + NAME_W + TIME_W + i * dayW; // Prepara os valores usados no bloco.
    if ([0, 6].includes(weekDay(cell.day))) page.rect(x, y, dayW, height, index % 2 ? '#edf2f6' : '#f2f6f9'); // Confere a condição.
    let color = cell.status === 'plantao' ? group.color : '#a1adb8'; // Prepara os valores usados no bloco.
    const fill = { // Prepara os valores usados no bloco.
      folga: '#e6f3ee', // Define esta informação.
      ferias: '#fff0d7', // Define esta informação.
      ausencia: '#eee8f5' // Define esta informação.
    }[cell.status]; // Continua a organização do bloco.
    if (fill) { // Confere a condição.
      page.rect(x + 1.5, y + (height - 16) / 2, dayW - 3, 16, fill); // Executa esta etapa.
      color = { // Executa esta etapa.
        folga: '#246d54', // Define esta informação.
        ferias: '#94610d', // Define esta informação.
        ausencia: '#73558c' // Define esta informação.
      }[cell.status]; // Continua a organização do bloco.
    } // Encerra este bloco.
    page.text(cell.code, x + dayW / 2, y + (height - 7.5) / 2, cell.code.length > 1 ? 6.8 : 7.5, color, cell.status !== 'unassigned', 'center'); // Executa esta etapa.
    page.line(x, y, x, y + height, GRID, .25); // Executa esta etapa.
  }); // Encerra este bloco.
  page.line(MARGIN + NAME_W, y, MARGIN + NAME_W, y + height, GRID, .4); // Executa esta etapa.
  page.line(MARGIN, y + height, PAGE_W - MARGIN, y + height, GRID, .35); // Executa esta etapa.
} // Encerra este bloco.
function pageFooter(page, report, pageNumber, totalPages, generatedAt, sample) { // Define esta rotina.
  const legend = [['P', 'Plantão', INK], ['F', 'Folga', '#246d54'], ['FE', 'Férias', '#94610d'], ['A', 'Ausência', '#73558c'], ['-', 'Sem marcação', MUTED]]; // Prepara os valores usados no bloco.
  let x = MARGIN; // Prepara os valores usados no bloco.
  for (const [code, label, color] of legend) { // Percorre os itens.
    page.text(code, x, 531, 8, color, true); // Executa esta etapa.
    page.text(label, x + 17, 531, 7.2, MUTED); // Executa esta etapa.
    x += width(label, 7.2) + 39; // Executa esta etapa.
  } // Encerra este bloco.
  page.text('Sábados e domingos têm colunas sombreadas.', PAGE_W - MARGIN, 532, 6.7, MUTED, false, 'right'); // Executa esta etapa.
  const alternate = report.hasAlternate ? 'Outros turnos: ' + report.shifts.map(s => `${s.code} ${s.name}`).join('  /  ') : 'Cada linha representa um funcionário; cada coluna representa um dia do mês.'; // Prepara os valores usados no bloco.
  page.text(fit(alternate, TABLE_W, 6.8), MARGIN, 547, 6.8, MUTED); // Executa esta etapa.
  page.line(MARGIN, 562, PAGE_W - MARGIN, 562, GRID, .6); // Executa esta etapa.
  const date = new Intl.DateTimeFormat('pt-BR', { // Prepara os valores usados no bloco.
    day: '2-digit', // Define esta informação.
    month: '2-digit', // Define esta informação.
    year: 'numeric' // Define esta informação.
  }).format(generatedAt); // Continua a organização do bloco.
  page.text(sample ? 'Modelo de teste com dados fictícios.' : `Gerado em ${date}  /  EscalaPro`, MARGIN, 574, 6.8, MUTED); // Executa esta etapa.
  page.text(`${pageNumber} / ${totalPages}`, PAGE_W - MARGIN, 574, 7, MUTED, true, 'right'); // Executa esta etapa.
} // Encerra este bloco.
function serialize(pages) { // Define esta rotina.
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>']; // Prepara os valores usados no bloco.
  const pageIds = []; // Prepara os valores usados no bloco.
  for (const page of pages) { // Percorre os itens.
    const pageId = objects.length + 1, // Prepara os valores usados no bloco.
      contentId = pageId + 1; // Executa esta etapa.
    pageIds.push(pageId); // Executa esta etapa.
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`); // Executa esta etapa.
    const content = page.commands.join('\n'); // Prepara os valores usados no bloco.
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`); // Executa esta etapa.
  } // Encerra este bloco.
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`; // Organiza a lista de dados.
  objects.push('<< /Title (EscalaPro - Escala mensal de trabalho) /Creator (EscalaPro) >>'); // Executa esta etapa.
  let out = '%PDF-1.4\n', // Prepara os valores usados no bloco.
    offsets = [0]; // Executa esta etapa.
  objects.forEach((obj, i) => { // Executa esta etapa.
    offsets.push(out.length); // Executa esta etapa.
    out += `${i + 1} 0 obj\n${obj}\nendobj\n`; // Executa esta etapa.
  }); // Encerra este bloco.
  const xref = out.length; // Prepara os valores usados no bloco.
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`; // Executa esta etapa.
  out += offsets.slice(1).map(offset => String(offset).padStart(10, '0') + ' 00000 n \n').join(''); // Organiza a lista de dados.
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xref}\n%%EOF\n`; // Executa esta etapa.
  return new TextEncoder().encode(out); // Retorna o resultado.
} // Encerra este bloco.
export function createSchedulePdf(db, month, departmentId, { // Disponibiliza este recurso para outros arquivos.
  generatedAt = new Date(), // Executa esta etapa.
  sample = false // Executa esta etapa.
} = {}) { // Continua a organização do bloco.
  const report = buildScheduleReport(db, month, departmentId), // Prepara os valores usados no bloco.
    pages = []; // Executa esta etapa.
  let page, // Prepara os valores usados no bloco.
    y, // Executa esta etapa.
    index = 0; // Executa esta etapa.
  const nextPage = () => { // Prepara os valores usados no bloco.
    page = new Page(); // Executa esta etapa.
    pageHeader(page, report, sample); // Executa esta etapa.
    tableHeader(page, report); // Executa esta etapa.
    pages.push(page); // Executa esta etapa.
    y = HEADER_Y + HEADER_H; // Executa esta etapa.
  }; // Encerra este bloco.
  nextPage(); // Executa esta etapa.
  for (const group of report.groups) { // Percorre os itens.
    let started = false; // Prepara os valores usados no bloco.
    for (const row of group.rows) { // Percorre os itens.
      const nameLines = wrap(row.name, NAME_W - 20, 8, true); // Prepara os valores usados no bloco.
      const height = Math.max(26, nameLines.length * 9 + (row.role ? 14 : 9)); // Prepara os valores usados no bloco.
      if (height > CONTENT_BOTTOM - (HEADER_Y + HEADER_H) - 22) throw Error('Nome extenso demais para o relatório.'); // Confere a condição.
      if (y + height + (started ? 0 : 22) > CONTENT_BOTTOM) { // Confere a condição.
        nextPage(); // Executa esta etapa.
        groupHeader(page, group, y, started); // Executa esta etapa.
        y += 22; // Executa esta etapa.
        started = true; // Executa esta etapa.
      } // Encerra este bloco.
      if (!started) { // Confere a condição.
        groupHeader(page, group, y); // Executa esta etapa.
        y += 22; // Executa esta etapa.
        started = true; // Executa esta etapa.
      } // Encerra este bloco.
      employeeRow(page, report, group, row, y, height, index++); // Executa esta etapa.
      y += height; // Executa esta etapa.
    } // Encerra este bloco.
  } // Encerra este bloco.
  if (!report.groups.length) page.text('Nenhum funcionário neste setor para o mês selecionado.', MARGIN + 10, y + 24, 10, MUTED); // Confere a condição.
  pages.forEach((item, i) => pageFooter(item, report, i + 1, pages.length, generatedAt, sample)); // Executa esta etapa.
  return serialize(pages); // Retorna o resultado.
} // Encerra este bloco.

