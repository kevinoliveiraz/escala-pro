import { fixtureDatabase as defaults } from './fixtures.mjs';
import test from 'node:test'; // Confere esta etapa do funcionamento.
import assert from 'node:assert/strict'; // Confere esta etapa do funcionamento.
import { clone } from '../js/core.mjs'; // Confere esta etapa do funcionamento.
import { buildScheduleReport, createSchedulePdf } from '../js/schedule-pdf.mjs'; // Confere esta etapa do funcionamento.
test('PDF mantém 31 dias e inclui a equipe só uma vez, separada por turno', () => { // Confere esta etapa do funcionamento.
  const db = defaults(), // Confere esta etapa do funcionamento.
    report = buildScheduleReport(db, '2026-12', 1); // Confere esta etapa do funcionamento.
  assert.equal(report.days.length, 31); // Confere esta etapa do funcionamento.
  const rows = report.groups.flatMap(group => group.rows); // Confere esta etapa do funcionamento.
  assert.equal(rows.length, 12); // Confere esta etapa do funcionamento.
  assert.equal(new Set(rows.map(row => row.id)).size, 12); // Confere esta etapa do funcionamento.
  assert.ok(rows.every(row => row.cells.length === 31)); // Confere esta etapa do funcionamento.
  assert.equal(buildScheduleReport(db, '2028-02', 1).days.length, 29); // Confere esta etapa do funcionamento.
  assert.equal(buildScheduleReport(db, '2026-02', 1).days.length, 28); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('PDF diferencia folga, plantão e ausência de marcação sem alterar dados', () => { // Confere esta etapa do funcionamento.
  const db = defaults(); // Confere esta etapa do funcionamento.
  db.assignments = [{ // Confere esta etapa do funcionamento.
    id: 201, // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-01', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }, { // Confere esta etapa do funcionamento.
    id: 202, // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-02', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }, { // Confere esta etapa do funcionamento.
    id: 203, // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    shiftId: 2 // Confere esta etapa do funcionamento.
  }]; // Confere esta etapa do funcionamento.
  db.daysOff = [{ // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-04' // Confere esta etapa do funcionamento.
  }]; // Confere esta etapa do funcionamento.
  db.requests.push({ // Confere esta etapa do funcionamento.
    id: 4, // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    status: 'approved', // Confere esta etapa do funcionamento.
    type: 'ferias', // Confere esta etapa do funcionamento.
    start: '2026-11-05', // Confere esta etapa do funcionamento.
    end: '2026-11-06' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  const before = clone(db), // Confere esta etapa do funcionamento.
    report = buildScheduleReport(db, '2026-11', 1), // Confere esta etapa do funcionamento.
    ana = report.groups.flatMap(group => group.rows).find(row => row.id === 1); // Confere esta etapa do funcionamento.
  assert.deepEqual(ana.cells.slice(0, 7).map(cell => cell.code), ['P', 'P', 'P2', 'F', 'FE', 'FE', '-']); // Confere esta etapa do funcionamento.
  assert.equal(report.hasAlternate, true); // Confere esta etapa do funcionamento.
  createSchedulePdf(db, '2026-11', 1); // Confere esta etapa do funcionamento.
  assert.deepEqual(db, before); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('PDF preserva histórico de inativo e ignora quem pertence somente a outro setor', () => { // Confere esta etapa do funcionamento.
  const db = defaults(); // Confere esta etapa do funcionamento.
  db.employees[0].active = false; // Confere esta etapa do funcionamento.
  db.assignments = [{ // Confere esta etapa do funcionamento.
    id: 201, // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-01', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }]; // Confere esta etapa do funcionamento.
  const rows = buildScheduleReport(db, '2026-11', 1).groups.flatMap(group => group.rows); // Confere esta etapa do funcionamento.
  assert.ok(rows.some(row => row.id === 1)); // Confere esta etapa do funcionamento.
  assert.ok(!rows.some(row => row.id === 13)); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('PDF pagina equipes grandes e repete cabeçalhos sem perder nomes', () => { // Confere esta etapa do funcionamento.
  const db = defaults(); // Confere esta etapa do funcionamento.
  db.employees = Array.from({ // Confere esta etapa do funcionamento.
    length: 90 // Confere esta etapa do funcionamento.
  }, (_, i) => ({ // Confere esta etapa do funcionamento.
    ...db.employees[0], // Confere esta etapa do funcionamento.
    id: i + 1, // Confere esta etapa do funcionamento.
    name: `Pessoa ${String(i + 1).padStart(3, '0')} de Nome Extenso para Conferir a Escala`, // Confere esta etapa do funcionamento.
    preferredShiftId: i % 3 + 1 // Confere esta etapa do funcionamento.
  })); // Confere esta etapa do funcionamento.
  const pdf = createSchedulePdf(db, '2026-12', 1), // Confere esta etapa do funcionamento.
    text = new TextDecoder().decode(pdf); // Confere esta etapa do funcionamento.
  assert.ok(pdf instanceof Uint8Array); // Confere esta etapa do funcionamento.
  assert.ok(text.startsWith('%PDF-1.4')); // Confere esta etapa do funcionamento.
  assert.match(text, /%%EOF\n$/); // Confere esta etapa do funcionamento.
  assert.ok((text.match(/\/Type \/Page\b/g) || []).length > 1); // Confere esta etapa do funcionamento.
  for (let i = 1; i <= 90; i++) assert.ok(text.includes(`Pessoa ${String(i).padStart(3, '0')}`)); // Confere esta etapa do funcionamento.
  assert.equal((text.match(/FUNCION/g) || []).length, (text.match(/\/Type \/Page\b/g) || []).length); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('PDF aceita setor vazio e rejeita mês ou setor inválido', () => { // Confere esta etapa do funcionamento.
  const db = defaults(); // Confere esta etapa do funcionamento.
  db.employees = []; // Confere esta etapa do funcionamento.
  assert.match(new TextDecoder().decode(createSchedulePdf(db, '2026-11', 1)), /Nenhum funcion/); // Confere esta etapa do funcionamento.
  assert.throws(() => createSchedulePdf(db, '2026-13', 1), /Mês inválido/); // Confere esta etapa do funcionamento.
  assert.throws(() => createSchedulePdf(db, '2026-11', 99), /Setor não encontrado/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0ZXN0IiwiYXNzZXJ0IiwiZGVmYXVsdHMiLCJjbG9uZSIsImJ1aWxkU2NoZWR1bGVSZXBvcnQiLCJjcmVhdGVTY2hlZHVsZVBkZiIsImRiIiwicmVwb3J0IiwiZXF1YWwiLCJkYXlzIiwibGVuZ3RoIiwicm93cyIsImdyb3VwcyIsImZsYXRNYXAiLCJncm91cCIsIlNldCIsIm1hcCIsInJvdyIsImlkIiwic2l6ZSIsIm9rIiwiZXZlcnkiLCJjZWxscyIsImFzc2lnbm1lbnRzIiwiZW1wbG95ZWVJZCIsImRlcGFydG1lbnRJZCIsImRheSIsInNoaWZ0SWQiLCJkYXlzT2ZmIiwicmVxdWVzdHMiLCJwdXNoIiwic3RhdHVzIiwidHlwZSIsInN0YXJ0IiwiZW5kIiwiYmVmb3JlIiwiYW5hIiwiZmluZCIsImRlZXBFcXVhbCIsInNsaWNlIiwiY2VsbCIsImNvZGUiLCJoYXNBbHRlcm5hdGUiLCJlbXBsb3llZXMiLCJhY3RpdmUiLCJzb21lIiwiQXJyYXkiLCJmcm9tIiwiXyIsImkiLCJuYW1lIiwiU3RyaW5nIiwicGFkU3RhcnQiLCJwcmVmZXJyZWRTaGlmdElkIiwicGRmIiwidGV4dCIsIlRleHREZWNvZGVyIiwiZGVjb2RlIiwiVWludDhBcnJheSIsInN0YXJ0c1dpdGgiLCJtYXRjaCIsImluY2x1ZGVzIiwidGhyb3dzIl0sInNvdXJjZXMiOlsicGRmLnRlc3QubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ25vZGU6dGVzdCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ25vZGU6YXNzZXJ0L3N0cmljdCc7XG5pbXBvcnQge2RlZmF1bHRzLGNsb25lfSBmcm9tICcuLi9qcy9jb3JlLm1qcyc7XG5pbXBvcnQge2J1aWxkU2NoZWR1bGVSZXBvcnQsY3JlYXRlU2NoZWR1bGVQZGZ9IGZyb20gJy4uL2pzL3NjaGVkdWxlLXBkZi5tanMnO1xuXG50ZXN0KCdQREYgbWFudMOpbSAzMSBkaWFzIGUgaW5jbHVpIGEgZXF1aXBlIHPDsyB1bWEgdmV6LCBzZXBhcmFkYSBwb3IgdHVybm8nLCgpPT57XG4gY29uc3QgZGI9ZGVmYXVsdHMoKSxyZXBvcnQ9YnVpbGRTY2hlZHVsZVJlcG9ydChkYiwnMjAyNi0xMicsMSk7XG4gYXNzZXJ0LmVxdWFsKHJlcG9ydC5kYXlzLmxlbmd0aCwzMSk7XG4gY29uc3Qgcm93cz1yZXBvcnQuZ3JvdXBzLmZsYXRNYXAoZ3JvdXA9Pmdyb3VwLnJvd3MpO1xuIGFzc2VydC5lcXVhbChyb3dzLmxlbmd0aCwxMik7YXNzZXJ0LmVxdWFsKG5ldyBTZXQocm93cy5tYXAocm93PT5yb3cuaWQpKS5zaXplLDEyKTtcbiBhc3NlcnQub2socm93cy5ldmVyeShyb3c9PnJvdy5jZWxscy5sZW5ndGg9PT0zMSkpO1xuIGFzc2VydC5lcXVhbChidWlsZFNjaGVkdWxlUmVwb3J0KGRiLCcyMDI4LTAyJywxKS5kYXlzLmxlbmd0aCwyOSk7XG4gYXNzZXJ0LmVxdWFsKGJ1aWxkU2NoZWR1bGVSZXBvcnQoZGIsJzIwMjYtMDInLDEpLmRheXMubGVuZ3RoLDI4KTtcbn0pO1xuXG50ZXN0KCdQREYgZGlmZXJlbmNpYSBmb2xnYSwgcGxhbnTDo28gZSBhdXPDqm5jaWEgZGUgbWFyY2HDp8OjbyBzZW0gYWx0ZXJhciBkYWRvcycsKCk9PntcbiBjb25zdCBkYj1kZWZhdWx0cygpO1xuIGRiLmFzc2lnbm1lbnRzPVt7aWQ6MjAxLGVtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDEnLHNoaWZ0SWQ6MX0se2lkOjIwMixlbXBsb3llZUlkOjEsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTAyJyxzaGlmdElkOjF9LHtpZDoyMDMsZW1wbG95ZWVJZDoxLGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0wMycsc2hpZnRJZDoyfV07XG4gZGIuZGF5c09mZj1be2VtcGxveWVlSWQ6MSxkYXk6JzIwMjYtMTEtMDQnfV07XG4gZGIucmVxdWVzdHMucHVzaCh7aWQ6NCxlbXBsb3llZUlkOjEsc3RhdHVzOidhcHByb3ZlZCcsdHlwZTonZmVyaWFzJyxzdGFydDonMjAyNi0xMS0wNScsZW5kOicyMDI2LTExLTA2J30pO1xuIGNvbnN0IGJlZm9yZT1jbG9uZShkYikscmVwb3J0PWJ1aWxkU2NoZWR1bGVSZXBvcnQoZGIsJzIwMjYtMTEnLDEpLGFuYT1yZXBvcnQuZ3JvdXBzLmZsYXRNYXAoZ3JvdXA9Pmdyb3VwLnJvd3MpLmZpbmQocm93PT5yb3cuaWQ9PT0xKTtcbiBhc3NlcnQuZGVlcEVxdWFsKGFuYS5jZWxscy5zbGljZSgwLDcpLm1hcChjZWxsPT5jZWxsLmNvZGUpLFsnUCcsJ1AnLCdQMicsJ0YnLCdGRScsJ0ZFJywnLSddKTtcbiBhc3NlcnQuZXF1YWwocmVwb3J0Lmhhc0FsdGVybmF0ZSx0cnVlKTtcbiBjcmVhdGVTY2hlZHVsZVBkZihkYiwnMjAyNi0xMScsMSk7YXNzZXJ0LmRlZXBFcXVhbChkYixiZWZvcmUpO1xufSk7XG5cbnRlc3QoJ1BERiBwcmVzZXJ2YSBoaXN0w7NyaWNvIGRlIGluYXRpdm8gZSBpZ25vcmEgcXVlbSBwZXJ0ZW5jZSBzb21lbnRlIGEgb3V0cm8gc2V0b3InLCgpPT57XG4gY29uc3QgZGI9ZGVmYXVsdHMoKTtkYi5lbXBsb3llZXNbMF0uYWN0aXZlPWZhbHNlO1xuIGRiLmFzc2lnbm1lbnRzPVt7aWQ6MjAxLGVtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDEnLHNoaWZ0SWQ6MX1dO1xuIGNvbnN0IHJvd3M9YnVpbGRTY2hlZHVsZVJlcG9ydChkYiwnMjAyNi0xMScsMSkuZ3JvdXBzLmZsYXRNYXAoZ3JvdXA9Pmdyb3VwLnJvd3MpO1xuIGFzc2VydC5vayhyb3dzLnNvbWUocm93PT5yb3cuaWQ9PT0xKSk7YXNzZXJ0Lm9rKCFyb3dzLnNvbWUocm93PT5yb3cuaWQ9PT0xMykpO1xufSk7XG5cbnRlc3QoJ1BERiBwYWdpbmEgZXF1aXBlcyBncmFuZGVzIGUgcmVwZXRlIGNhYmXDp2FsaG9zIHNlbSBwZXJkZXIgbm9tZXMnLCgpPT57XG4gY29uc3QgZGI9ZGVmYXVsdHMoKTtkYi5lbXBsb3llZXM9QXJyYXkuZnJvbSh7bGVuZ3RoOjkwfSwoXyxpKT0+KHsuLi5kYi5lbXBsb3llZXNbMF0saWQ6aSsxLG5hbWU6YFBlc3NvYSAke1N0cmluZyhpKzEpLnBhZFN0YXJ0KDMsJzAnKX0gZGUgTm9tZSBFeHRlbnNvIHBhcmEgQ29uZmVyaXIgYSBFc2NhbGFgLHByZWZlcnJlZFNoaWZ0SWQ6aSUzKzF9KSk7XG4gY29uc3QgcGRmPWNyZWF0ZVNjaGVkdWxlUGRmKGRiLCcyMDI2LTEyJywxKSx0ZXh0PW5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShwZGYpO1xuIGFzc2VydC5vayhwZGYgaW5zdGFuY2VvZiBVaW50OEFycmF5KTthc3NlcnQub2sodGV4dC5zdGFydHNXaXRoKCclUERGLTEuNCcpKTtcbiBhc3NlcnQubWF0Y2godGV4dCwvJSVFT0ZcXG4kLyk7YXNzZXJ0Lm9rKCh0ZXh0Lm1hdGNoKC9cXC9UeXBlIFxcL1BhZ2VcXGIvZyl8fFtdKS5sZW5ndGg+MSk7XG4gZm9yKGxldCBpPTE7aTw9OTA7aSsrKWFzc2VydC5vayh0ZXh0LmluY2x1ZGVzKGBQZXNzb2EgJHtTdHJpbmcoaSkucGFkU3RhcnQoMywnMCcpfWApKTtcbiBhc3NlcnQuZXF1YWwoKHRleHQubWF0Y2goL0ZVTkNJT04vZyl8fFtdKS5sZW5ndGgsKHRleHQubWF0Y2goL1xcL1R5cGUgXFwvUGFnZVxcYi9nKXx8W10pLmxlbmd0aCk7XG59KTtcblxudGVzdCgnUERGIGFjZWl0YSBzZXRvciB2YXppbyBlIHJlamVpdGEgbcOqcyBvdSBzZXRvciBpbnbDoWxpZG8nLCgpPT57XG4gY29uc3QgZGI9ZGVmYXVsdHMoKTtkYi5lbXBsb3llZXM9W107XG4gYXNzZXJ0Lm1hdGNoKG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShjcmVhdGVTY2hlZHVsZVBkZihkYiwnMjAyNi0xMScsMSkpLC9OZW5odW0gZnVuY2lvbi8pO1xuIGFzc2VydC50aHJvd3MoKCk9PmNyZWF0ZVNjaGVkdWxlUGRmKGRiLCcyMDI2LTEzJywxKSwvTcOqcyBpbnbDoWxpZG8vKTtcbiBhc3NlcnQudGhyb3dzKCgpPT5jcmVhdGVTY2hlZHVsZVBkZihkYiwnMjAyNi0xMScsOTkpLC9TZXRvciBuw6NvIGVuY29udHJhZG8vKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxJQUFJLE1BQU0sV0FBVztBQUM1QixPQUFPQyxNQUFNLE1BQU0sb0JBQW9CO0FBQ3ZDLFNBQVFDLFFBQVEsRUFBQ0MsS0FBSyxRQUFPLGdCQUFnQjtBQUM3QyxTQUFRQyxtQkFBbUIsRUFBQ0MsaUJBQWlCLFFBQU8sd0JBQXdCO0FBRTVFTCxJQUFJLENBQUMscUVBQXFFLEVBQUMsTUFBSTtFQUM5RSxNQUFNTSxFQUFFLEdBQUNKLFFBQVEsQ0FBQyxDQUFDO0lBQUNLLE1BQU0sR0FBQ0gsbUJBQW1CLENBQUNFLEVBQUUsRUFBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO0VBQzlETCxNQUFNLENBQUNPLEtBQUssQ0FBQ0QsTUFBTSxDQUFDRSxJQUFJLENBQUNDLE1BQU0sRUFBQyxFQUFFLENBQUM7RUFDbkMsTUFBTUMsSUFBSSxHQUFDSixNQUFNLENBQUNLLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDQyxLQUFLLElBQUVBLEtBQUssQ0FBQ0gsSUFBSSxDQUFDO0VBQ25EVixNQUFNLENBQUNPLEtBQUssQ0FBQ0csSUFBSSxDQUFDRCxNQUFNLEVBQUMsRUFBRSxDQUFDO0VBQUNULE1BQU0sQ0FBQ08sS0FBSyxDQUFDLElBQUlPLEdBQUcsQ0FBQ0osSUFBSSxDQUFDSyxHQUFHLENBQUNDLEdBQUcsSUFBRUEsR0FBRyxDQUFDQyxFQUFFLENBQUMsQ0FBQyxDQUFDQyxJQUFJLEVBQUMsRUFBRSxDQUFDO0VBQ2pGbEIsTUFBTSxDQUFDbUIsRUFBRSxDQUFDVCxJQUFJLENBQUNVLEtBQUssQ0FBQ0osR0FBRyxJQUFFQSxHQUFHLENBQUNLLEtBQUssQ0FBQ1osTUFBTSxLQUFHLEVBQUUsQ0FBQyxDQUFDO0VBQ2pEVCxNQUFNLENBQUNPLEtBQUssQ0FBQ0osbUJBQW1CLENBQUNFLEVBQUUsRUFBQyxTQUFTLEVB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TSxDQUFDSCxHQUFHLENBQUM7RUFDOUVyRCxNQUFNLENBQUNtQixFQUFFLENBQUNrQyxHQUFHLFlBQVlJLFVBQVUsQ0FBQztFQUFDekQsTUFBTSxDQUFDbUIsRUFBRSxDQUFDbUMsSUFBSSxDQUFDSSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDM0UxRCxNQUFNLENBQUMyRCxLQUFLLENBQUNMLElBQUksRUFBQyxVQUFVLENBQUM7RUFBQ3RELE1BQU0sQ0FBQ21CLEVBQUUsQ0FBQyxDQUFDbUMsSUFBSSxDQUFDSyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBRSxFQUFFLEVBQUVsRCxNQUFNLEdBQUMsQ0FBQyxDQUFDO0VBQ3RGLEtBQUksSUFBSXVDLENBQUMsR0FBQyxDQUFDLEVBQUNBLENBQUMsSUFBRSxFQUFFLEVBQUNBLENBQUMsRUFBRSxFQUFDaEQsTUFBTSxDQUFDbUIsRUFBRSxDQUFDbUMsSUFBSSxDQUFDTSxRQUFRLENBQUMsVUFBVVYsTUFBTSxDQUFDRixDQUFDLENBQUMsQ0FBQ0csUUFBUSxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDckZuRCxNQUFNLENBQUNPLEtBQUssQ0FBQyxDQUFDK0MsSUFBSSxDQUFDSyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUUsRUFBRSxFQUFFbEQsTUFBTSxFQUFDLENBQUM2QyxJQUFJLENBQUNLLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFFLEVBQUUsRUFBRWxELE1BQU0sQ0FBQztBQUM5RixDQUFDLENBQUM7QUFFRlYsSUFBSSxDQUFDLHdEQUF3RCxFQUFDLE1BQUk7RUFDakUsTUFBTU0sRUFBRSxHQUFDSixRQUFRLENBQUMsQ0FBQztFQUFDSSxFQUFFLENBQUNxQyxTQUFTLEdBQUMsRUFBRTtFQUNuQzFDLE1BQU0sQ0FBQzJELEtBQUssQ0FBQyxJQUFJSixXQUFXLENBQUMsQ0FBQyxDQUFDQyxNQUFNLENBQUNwRCxpQkFBaUIsQ0FBQ0MsRUFBRSxFQUFDLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGdCQUFnQixDQUFDO0VBQzFGTCxNQUFNLENBQUM2RCxNQUFNLENBQUMsTUFBSXpELGlCQUFpQixDQUFDQyxFQUFFLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxFQUFDLGNBQWMsQ0FBQztFQUNuRUwsTUFBTSxDQUFDNkQsTUFBTSxDQUFDLE1BQUl6RCxpQkFBaUIsQ0FBQ0MsRUFBRSxFQUFDLFNBQVMsRUFBQyxFQUFFLENBQUMsRUFBQyxzQkFBc0IsQ0FBQztBQUM3RSxDQUFDLENBQUMiLCJpZ25vcmVMaXN0IjpbXX0= // Confere esta etapa do funcionamento.
