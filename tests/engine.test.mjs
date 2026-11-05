import test from 'node:test'; // Confere esta etapa do funcionamento.
import assert from 'node:assert/strict'; // Confere esta etapa do funcionamento.
import { defaults, clone, addDays, validateInsert, putAssignment, removeAssignment, generate, evaluate, applyRequest, publish, weekDay, csvRows } from '../js/core.mjs'; // Confere esta etapa do funcionamento.
const month = '2026-11'; // Confere esta etapa do funcionamento.
test('datas funcionam na virada de mês', () => { // Confere esta etapa do funcionamento.
  assert.equal(addDays('2026-11-30', 1), '2026-12-01'); // Confere esta etapa do funcionamento.
  assert.equal(addDays('2026-11-01', -1), '2026-10-31'); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('distribuição automática respeita todos os mínimos e regras sem IA', () => { // Confere esta etapa do funcionamento.
  let d = defaults(), // Confere esta etapa do funcionamento.
    r = generate(d, month, 1); // Confere esta etapa do funcionamento.
  assert.equal(r.analysis.percent, 100); // Confere esta etapa do funcionamento.
  assert.equal(r.analysis.required.length, 0); // Confere esta etapa do funcionamento.
  assert.equal(r.analysis.conflicts.length, 0); // Confere esta etapa do funcionamento.
  assert.ok(r.db.assignments.length > 100); // Confere esta etapa do funcionamento.
  assert.equal(d.assignments.length, 0, 'simulação não deve alterar original'); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('setor separado tem cobertura independente', () => { // Confere esta etapa do funcionamento.
  const result = generate(defaults(), month, 2); // Confere esta etapa do funcionamento.
  assert.equal(result.analysis.percent, 100); // Confere esta etapa do funcionamento.
  assert.equal(result.analysis.conflicts.length, 0); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('reprova funcionário repetido no dia', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  assert.equal(putAssignment(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).ok, true); // Confere esta etapa do funcionamento.
  assert.match(validateInsert(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    shiftId: 2 // Confere esta etapa do funcionamento.
  }).join(' '), /já está escalado/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('reprova descanso insuficiente entre turnos', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  putAssignment(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    shiftId: 3 // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.match(validateInsert(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-04', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).join(' '), /Descanso inferior/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('reprova carga semanal ultrapassada', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  for (const day of ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06']) assert.equal(putAssignment(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day, // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).ok, true); // Confere esta etapa do funcionamento.
  assert.match(validateInsert(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-07', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).join(' '), /Carga semanal/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('folga aprovada bloqueia alocação', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  assert.match(validateInsert(d, { // Confere esta etapa do funcionamento.
    employeeId: 4, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-18', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).join(' '), /aprovada/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('aprovação exclui do rascunho e impede novas alocações', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  putAssignment(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-12', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  let n = applyRequest(d, 1, 'approved'); // Confere esta etapa do funcionamento.
  assert.equal(n, 1); // Confere esta etapa do funcionamento.
  assert.equal(d.assignments.length, 0); // Confere esta etapa do funcionamento.
  assert.match(validateInsert(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-12', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).join(' '), /aprovada/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('impossível publicar escala incompleta', () => { // Confere esta etapa do funcionamento.
  assert.throws(() => publish(defaults(), month, 1), /Não é possível publicar/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('só publica calendário válido e congela snapshot', () => { // Confere esta etapa do funcionamento.
  const r = generate(defaults(), month, 1); // Confere esta etapa do funcionamento.
  const d = r.db; // Confere esta etapa do funcionamento.
  publish(d, month, 1); // Confere esta etapa do funcionamento.
  let key = '1:2026-11'; // Confere esta etapa do funcionamento.
  assert.equal(d.publications[key].assignments.length, d.assignments.length); // Confere esta etapa do funcionamento.
  removeAssignment(d, d.assignments[0].id); // Confere esta etapa do funcionamento.
  assert.equal(d.publications[key], undefined, 'edição deve revogar publicação'); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('simulação de ausência não edita base original', () => { // Confere esta etapa do funcionamento.
  const d = defaults(), // Confere esta etapa do funcionamento.
    r = generate(d, month, 1, { // Confere esta etapa do funcionamento.
      exclude: [{ // Confere esta etapa do funcionamento.
        employeeId: 1, // Confere esta etapa do funcionamento.
        day: '2026-11-12' // Confere esta etapa do funcionamento.
      }] // Confere esta etapa do funcionamento.
    }); // Confere esta etapa do funcionamento.
  assert.equal(d.assignments.length, 0); // Confere esta etapa do funcionamento.
  assert.ok(!r.db.assignments.some(a => a.employeeId === 1 && a.day === '2026-11-12')); // Confere esta etapa do funcionamento.
  assert.equal(r.analysis.conflicts.length, 0); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('exportação CSV contém turnos e funcionário', () => { // Confere esta etapa do funcionamento.
  const d = generate(defaults(), month, 1).db; // Confere esta etapa do funcionamento.
  let rows = csvRows(d, month, 1); // Confere esta etapa do funcionamento.
  assert.ok(rows.length > 140); // Confere esta etapa do funcionamento.
  assert.deepEqual(rows[0], ['Data', 'Funcionário', 'Setor', 'Turno', 'Início', 'Fim']); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('turno noturno na virada da semana divide horas corretamente', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  d.rules[1].minRest = 0; // Confere esta etapa do funcionamento.
  for (const day of ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06']) assert.equal(putAssignment(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day, // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).ok, true); // Confere esta etapa do funcionamento.
  assert.match(validateInsert(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-01', // Confere esta etapa do funcionamento.
    shiftId: 3 // Confere esta etapa do funcionamento.
  }).join(' '), /Carga semanal/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('pedido de troca aprovado não transforma o dia em indisponibilidade', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  d.requests[0].type = 'troca'; // Confere esta etapa do funcionamento.
  applyRequest(d, 1, 'approved'); // Confere esta etapa do funcionamento.
  assert.equal(validateInsert(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-12', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).length, 0); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
const { // Confere esta etapa do funcionamento.
  dayStatus, // Confere esta etapa do funcionamento.
  setDayStatus, // Confere esta etapa do funcionamento.
  ensure // Confere esta etapa do funcionamento.
} = await import('../js/core.mjs'); // Confere esta etapa do funcionamento.
test('folga altera só a pessoa e a data escolhidas e revoga a publicação', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  for (const record of [{ // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03' // Confere esta etapa do funcionamento.
  }, { // Confere esta etapa do funcionamento.
    employeeId: 2, // Confere esta etapa do funcionamento.
    day: '2026-11-03' // Confere esta etapa do funcionamento.
  }, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-04' // Confere esta etapa do funcionamento.
  }]) assert.ok(putAssignment(d, { // Confere esta etapa do funcionamento.
    ...record, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).ok); // Confere esta etapa do funcionamento.
  d.publications['1:2026-11'] = { // Confere esta etapa do funcionamento.
    assignments: clone(d.assignments) // Confere esta etapa do funcionamento.
  }; // Confere esta etapa do funcionamento.
  const other = d.assignments.filter(a => a.employeeId !== 1 || a.day !== '2026-11-03'); // Confere esta etapa do funcionamento.
  assert.ok(setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }).ok); // Confere esta etapa do funcionamento.
  assert.deepEqual(d.assignments, other); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(d, 1, '2026-11-03').status, 'folga'); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(d, 2, '2026-11-03').status, 'plantao'); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(d, 1, '2026-11-04').status, 'plantao'); // Confere esta etapa do funcionamento.
  assert.equal(d.publications['1:2026-11'], undefined); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('folga manual persiste e a geração automática respeita essa pessoa nessa data', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  assert.ok(setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 2, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }).ok); // Confere esta etapa do funcionamento.
  const restored = ensure(JSON.parse(JSON.stringify(d))); // Confere esta etapa do funcionamento.
  const result = generate(restored, month, 1); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(result.db, 2, '2026-11-03').status, 'folga'); // Confere esta etapa do funcionamento.
  assert.ok(!result.db.assignments.some(a => a.employeeId === 2 && a.day === '2026-11-03')); // Confere esta etapa do funcionamento.
  assert.ok(result.db.assignments.some(a => a.employeeId !== 2 && a.day === '2026-11-03')); // Confere esta etapa do funcionamento.
  assert.match(validateInsert(restored, { // Confere esta etapa do funcionamento.
    employeeId: 2, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).join(' '), /Folga marcada/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('trocar folga por plantão não mexe na folga de outro funcionário', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  for (const employeeId of [1, 2]) assert.ok(setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }).ok); // Confere esta etapa do funcionamento.
  assert.ok(setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    status: 'plantao', // Confere esta etapa do funcionamento.
    shiftId: 2 // Confere esta etapa do funcionamento.
  }).ok); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(d, 1, '2026-11-03').shiftId, 2); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(d, 2, '2026-11-03').status, 'folga'); // Confere esta etapa do funcionamento.
  assert.equal(d.daysOff.length, 1); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('plantão inválido mantém a folga e todos os outros dados intactos', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  putAssignment(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    shiftId: 3 // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-04', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  d.publications['1:2026-11'] = { // Confere esta etapa do funcionamento.
    date: 'teste' // Confere esta etapa do funcionamento.
  }; // Confere esta etapa do funcionamento.
  const before = clone(d); // Confere esta etapa do funcionamento.
  const result = setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-04', // Confere esta etapa do funcionamento.
    status: 'plantao', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.equal(result.ok, false); // Confere esta etapa do funcionamento.
  assert.match(result.errors.join(' '), /Descanso inferior/); // Confere esta etapa do funcionamento.
  assert.deepEqual(d, before); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('situação rápida protege ausências aprovadas e dados de outro setor', () => { // Confere esta etapa do funcionamento.
  const d = defaults(), // Confere esta etapa do funcionamento.
    before = clone(d); // Confere esta etapa do funcionamento.
  assert.equal(setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 4, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-18', // Confere esta etapa do funcionamento.
    status: 'plantao', // Confere esta etapa do funcionamento.
    shiftId: 1 // Confere esta etapa do funcionamento.
  }).ok, false); // Confere esta etapa do funcionamento.
  assert.equal(setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 13, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }).ok, false); // Confere esta etapa do funcionamento.
  assert.equal(setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-02-31', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }).ok, false); // Confere esta etapa do funcionamento.
  assert.deepEqual(d, before); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('não definido não significa folga e permite desfazer só a escolha individual', () => { // Confere esta etapa do funcionamento.
  const d = defaults(); // Confere esta etapa do funcionamento.
  delete d.daysOff; // Confere esta etapa do funcionamento.
  ensure(d); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(d, 1, '2026-11-03').status, 'unassigned'); // Confere esta etapa do funcionamento.
  setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  setDayStatus(d, { // Confere esta etapa do funcionamento.
    employeeId: 1, // Confere esta etapa do funcionamento.
    departmentId: 1, // Confere esta etapa do funcionamento.
    day: '2026-11-03', // Confere esta etapa do funcionamento.
    status: 'unassigned' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.equal(dayStatus(d, 1, '2026-11-03').status, 'unassigned'); // Confere esta etapa do funcionamento.
  assert.deepEqual(d.daysOff, []); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0ZXN0IiwiYXNzZXJ0IiwiZGVmYXVsdHMiLCJjbG9uZSIsImFkZERheXMiLCJ2YWxpZGF0ZUluc2VydCIsInB1dEFzc2lnbm1lbnQiLCJyZW1vdmVBc3NpZ25tZW50IiwiZ2VuZXJhdGUiLCJldmFsdWF0ZSIsImFwcGx5UmVxdWVzdCIsInB1Ymxpc2giLCJ3ZWVrRGF5IiwiY3N2Um93cyIsIm1vbnRoIiwiZXF1YWwiLCJkIiwiciIsImFuYWx5c2lzIiwicGVyY2VudCIsInJlcXVpcmVkIiwibGVuZ3RoIiwiY29uZmxpY3RzIiwib2siLCJkYiIsImFzc2lnbm1lbnRzIiwicmVzdWx0IiwiZW1wbG95ZWVJZCIsImRlcGFydG1lbnRJZCIsImRheSIsInNoaWZ0SWQiLCJtYXRjaCIsImpvaW4iLCJuIiwidGhyb3dzIiwia2V5IiwicHVibGljYXRpb25zIiwiaWQiLCJ1bmRlZmluZWQiLCJleGNsdWRlIiwic29tZSIsImEiLCJyb3dzIiwiZGVlcEVxdWFsIiwicnVsZXMiLCJtaW5SZXN0IiwicmVxdWVzdHMiLCJ0eXBlIiwiZGF5U3RhdHVzIiwic2V0RGF5U3RhdHVzIiwiZW5zdXJlIiwicmVjb3JkIiwib3RoZXIiLCJmaWx0ZXIiLCJzdGF0dXMiLCJyZXN0b3JlZCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImRheXNPZmYiLCJkYXRlIiwiYmVmb3JlIiwiZXJyb3JzIl0sInNvdXJjZXMiOlsiZW5naW5lLnRlc3QubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ25vZGU6dGVzdCc7aW1wb3J0IGFzc2VydCBmcm9tICdub2RlOmFzc2VydC9zdHJpY3QnO1xuaW1wb3J0IHtkZWZhdWx0cyxjbG9uZSxhZGREYXlzLHZhbGlkYXRlSW5zZXJ0LHB1dEFzc2lnbm1lbnQscmVtb3ZlQXNzaWdubWVudCxnZW5lcmF0ZSxldmFsdWF0ZSxhcHBseVJlcXVlc3QscHVibGlzaCx3ZWVrRGF5LGNzdlJvd3N9IGZyb20gJy4uL2pzL2NvcmUubWpzJztcbmNvbnN0IG1vbnRoPScyMDI2LTExJztcbnRlc3QoJ2RhdGFzIGZ1bmNpb25hbSBuYSB2aXJhZGEgZGUgbcOqcycsKCk9Pnthc3NlcnQuZXF1YWwoYWRkRGF5cygnMjAyNi0xMS0zMCcsMSksJzIwMjYtMTItMDEnKTthc3NlcnQuZXF1YWwoYWRkRGF5cygnMjAyNi0xMS0wMScsLTEpLCcyMDI2LTEwLTMxJyl9KTtcbnRlc3QoJ2Rpc3RyaWJ1acOnw6NvIGF1dG9tw6F0aWNhIHJlc3BlaXRhIHRvZG9zIG9zIG3DrW5pbW9zIGUgcmVncmFzIHNlbSBJQScsKCk9PntsZXQgZD1kZWZhdWx0cygpLHI9Z2VuZXJhdGUoZCxtb250aCwxKTthc3NlcnQuZXF1YWwoci5hbmFseXNpcy5wZXJjZW50LDEwMCk7YXNzZXJ0LmVxdWFsKHIuYW5hbHlzaXMucmVxdWlyZWQubGVuZ3RoLDApO2Fzc2VydC5lcXVhbChyLmFuYWx5c2lzLmNvbmZsaWN0cy5sZW5ndGgsMCk7YXNzZXJ0Lm9rKHIuZGIuYXNzaWdubWVudHMubGVuZ3RoPjEwMCk7YXNzZXJ0LmVxdWFsKGQuYXNzaWdubWVudHMubGVuZ3RoLDAsJ3NpbXVsYcOnw6NvIG7Do28gZGV2ZSBhbHRlcmFyIG9yaWdpbmFsJyl9KTtcbnRlc3QoJ3NldG9yIHNlcGFyYWRvIHRlbSBjb2JlcnR1cmEgaW5kZXBlbmRlbnRlJywoKT0+e2NvbnN0IHJlc3VsdD1nZW5lcmF0ZShkZWZhdWx0cygpLG1vbnRoLDIpO2Fzc2VydC5lcXVhbChyZXN1bHQuYW5hbHlzaXMucGVyY2VudCwxMDApO2Fzc2VydC5lcXVhbChyZXN1bHQuYW5hbHlzaXMuY29uZmxpY3RzLmxlbmd0aCwwKX0pO1xudGVzdCgncmVwcm92YSBmdW5jaW9uw6FyaW8gcmVwZXRpZG8gbm8gZGlhJywoKT0+e2NvbnN0IGQ9ZGVmYXVsdHMoKTthc3NlcnQuZXF1YWwocHV0QXNzaWdubWVudChkLHtlbXBsb3llZUlkOjEsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTAzJyxzaGlmdElkOjF9KS5vayx0cnVlKTthc3NlcnQubWF0Y2godmFsaWRhdGVJbnNlcnQoZCx7ZW1wbG95ZWVJZDoxLGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0wMycsc2hpZnRJZDoyfSkuam9pbignICcpLC9qw6EgZXN0w6EgZXNjYWxhZG8vKX0pO1xudGVzdCgncmVwcm92YSBkZXNjYW5zbyBpbnN1ZmljaWVudGUgZW50cmUgdHVybm9zJywoKT0+e2NvbnN0IGQ9ZGVmYXVsdHMoKTtwdXRBc3NpZ25tZW50KGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDMnLHNoaWZ0SWQ6M30pO2Fzc2VydC5tYXRjaCh2YWxpZGF0ZUluc2VydChkLHtlbXBsb3llZUlkOjEsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTA0JyxzaGlmdElkOjF9KS5qb2luKCcgJyksL0Rlc2NhbnNvIGluZmVyaW9yLyl9KTtcbnRlc3QoJ3JlcHJvdmEgY2FyZ2Egc2VtYW5hbCB1bHRyYXBhc3NhZGEnLCgpPT57Y29uc3QgZD1kZWZhdWx0cygpO2Zvcihjb25zdCBkYXkgb2YgWycyMDI2LTExLTAyJywnMjAyNi0xMS0wMycsJzIwMjYtMTEtMDQnLCcyMDI2LTExLTA1JywnMjAyNi0xMS0wNiddKWFzc2VydC5lcXVhbChwdXRBc3NpZ25tZW50KGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXksc2hpZnRJZDoxfSkub2ssdHJ1ZSk7YXNzZXJ0Lm1hdGNoKHZhbGlkYXRlSW5zZXJ0KGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDcnLHNoaWZ0SWQ6MX0pLmpvaW4oJyAnKSwvQ2FyZ2Egc2VtYW5hbC8pfSk7XG50ZXN0KCdmb2xnYSBhcHJvdmFkYSBibG9xdWVpYSBhbG9jYcOnw6NvJywoKT0+e2NvbnN0IGQ9ZGVmYXVsdHMoKTthc3NlcnQubWF0Y2godmFsaWRhdGVJbnNlcnQoZCx7ZW1wbG95ZWVJZDo0LGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0xOCcsc2hpZnRJZDoxfSkuam9pbignICcpLC9hcHJvdmFkYS8pfSk7XG50ZXN0KCdhcHJvdmHDp8OjbyBleGNsdWkgZG8gcmFzY3VuaG8gZSBpbXBlZGUgbm92YXMgYWxvY2HDp8O1ZXMnLCgpPT57Y29uc3QgZD1kZWZhdWx0cygpO3B1dEFzc2lnbm1lbnQoZCx7ZW1wbG95ZWVJZDoxLGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0xMicsc2hpZnRJZDoxfSk7bGV0IG49YXBwbHlSZXF1ZXN0KGQsMSwnYXBwcm92ZWQnKTthc3NlcnQuZXF1YWwobiwxKTthc3NlcnQuZXF1YWwoZC5hc3NpZ25tZW50cy5sZW5ndGgsMCk7YXNzZXJ0Lm1hdGNoKHZhbGlkYXRlSW5zZXJ0KGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMTInLHNoaWZ0SWQ6MX0pLmpvaW4oJyAnKSwvYXByb3ZhZGEvKX0pO1xudGVzdCgnaW1wb3Nzw612ZWwgcHVibGljYXIgZXNjYWxhIGluY29tcGxldGEnLCgpPT57YXNzZXJ0LnRocm93cygoKT0+cHVibGlzaChkZWZhdWx0cygpLG1vbnRoLDEpLC9Ow6NvIMOpIHBvc3PDrXZlbCBwdWJsaWNhci8pfSk7XG50ZXN0KCdzw7MgcHVibGljYSBjYWxlbmTDoXJpbyB2w6FsaWRvIGUgY29uZ2VsYSBzbmFwc2hvdCcsKCk9Pntjb25zdCByPWdlbmVyYXRlKGRlZmF1bHRzKCksbW9udGgsMSk7Y29uc3QgZD1yLmRiO3B1Ymxpc2goZCxtb250aCwxKTtsZXQga2V5PScxOjIwMjYtMTEnO2Fzc2VydC5lcXVhbChkLnB1YmxpY2F0aW9uc1trZXldLmFzc2lnbm1lbnRzLmxlbmd0aCxkLmFzc2lnbm1lbnRzLmxlbmd0aCk7cmVtb3ZlQXNzaWdubWVudChkLGQuYXNzaWdubWVudHNbMF0uaWQpO2Fzc2VydC5lcXVhbChkLnB1YmxpY2F0aW9uc1trZXldLHVuZGVmaW5lZCwnZWRpw6fDo28gZGV2ZSByZXZvZ2FyIHB1YmxpY2HDp8OjbycpfSk7XG50ZXN0KCdzaW11bGHDp8OjbyBkZSBhdXPDqm5jaWEgbsOjbyBlZGl0YSBiYXNlIG9yaWdpbmFsJywoKT0+e2NvbnN0IGQ9ZGVmYXVsdHMoKSxyPWdlbmVyYXRlKGQsbW9udGgsMSx7ZXhjbHVkZTpbe2VtcGxveWVlSWQ6MSxkYXk6JzIwMjYtMTEtMTInfV19KTthc3NlcnQuZXF1YWwoZC5hc3NpZ25tZW50cy5sZW5ndGgsMCk7YXNzZXJ0Lm9rKCFyLmRiLmFzc2lnbm1lbnRzLnNvbWUoYT0+YS5lbXBsb3llZUlkPT09MSYmYS5kYXk9PT0nMjAyNi0xMS0xMicpKTthc3NlcnQuZXF1YWwoci5hbmFseXNpcy5jb25mbGljdHMubGVuZ3RoLDApfSk7XG50ZXN0KCdleHBvcnRhw6fDo28gQ1NWIGNvbnTDqW0gdHVybm9zIGUgZnVuY2lvbsOhcmlvJywoKT0+e2NvbnN0IGQ9Z2VuZXJhdGUoZGVmYXVsdHMoKSxtb250aCwxKS5kYjtsZXQgcm93cz1jc3ZSb3dzKGQsbW9udGgsMSk7YXNzZXJ0Lm9rKHJvd3MubGVuZ3RoPjE0MCk7YXNzZXJ0LmRlZXBFcXVhbChyb3dzWzBdLFsnRGF0YScsJ0Z1bmNpb27DoXJpbycsJ1NldG9yJywnVHVybm8nLCdJbsOtY2lvJywnRmltJ10pfSk7XG50ZXN0KCd0dXJubyBub3R1cm5vIG5hIHZpcmFkYSBkYSBzZW1hbmEgZGl2aWRlIGhvcmFzIGNvcnJldGFtZW50ZScsKCk9Pntjb25zdCBkPWRlZmF1bHRzKCk7ZC5ydWxlc1sxXS5taW5SZXN0PTA7Zm9yKGNvbnN0IGRheSBvZiBbJzIwMjYtMTEtMDInLCcyMDI2LTExLTAzJywnMjAyNi0xMS0wNCcsJzIwMjYtMTEtMDUnLCcyMDI2LTExLTA2J10pYXNzZXJ0LmVxdWFsKHB1dEFzc2lnbm1lbnQoZCx7ZW1wbG95ZWVJZDoxLGRlcGFydG1lbnRJZDoxLGRheSxzaGlmdElkOjF9KS5vayx0cnVlKTthc3NlcnQubWF0Y2godmFsaWRhdGVJbnNlcnQoZCx7ZW1wbG95ZWVJZDoxLGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0wMScsc2hpZnRJZDozfSkuam9pbignICcpLC9DYXJnYSBzZW1hbmFsLyl9KTtcbnRlc3QoJ3BlZGlkbyBkZSB0cm9jYSBhcHJvdmFkbyBuw6NvIHRyYW5zZm9ybWEgbyBkaWEgZW0gaW5kaXNwb25pYmlsaWRhZGUnLCgpPT57Y29uc3QgZD1kZWZhdWx0cygpO2QucmVxdWVzdHNbMF0udHlwZT0ndHJvY2EnO2FwcGx5UmVxdWVzdChkLDEsJ2FwcHJvdmVkJyk7YXNzZXJ0LmVxdWFsKHZhbGlkYXRlSW5zZXJ0KGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMTInLHNoaWZ0SWQ6MX0pLmxlbmd0aCwwKX0pO1xuXG5cbmNvbnN0IHtkYXlTdGF0dXMsc2V0RGF5U3RhdHVzLGVuc3VyZX09YXdhaXQgaW1wb3J0KCcuLi9qcy9jb3JlLm1qcycpO1xuXG50ZXN0KCdmb2xnYSBhbHRlcmEgc8OzIGEgcGVzc29hIGUgYSBkYXRhIGVzY29saGlkYXMgZSByZXZvZ2EgYSBwdWJsaWNhw6fDo28nLCgpPT57XG4gY29uc3QgZD1kZWZhdWx0cygpO1xuIGZvcihjb25zdCByZWNvcmQgb2YgW3tlbXBsb3llZUlkOjEsZGF5OicyMDI2LTExLTAzJ30se2VtcGxveWVlSWQ6MixkYXk6JzIwMjYtMTEtMDMnfSx7ZW1wbG95ZWVJZDoxLGRheTonMjAyNi0xMS0wNCd9XSlhc3NlcnQub2socHV0QXNzaWdubWVudChkLHsuLi5yZWNvcmQsZGVwYXJ0bWVudElkOjEsc2hpZnRJZDoxfSkub2spO1xuIGQucHVibGljYXRpb25zWycxOjIwMjYtMTEnXT17YXNzaWdubWVudHM6Y2xvbmUoZC5hc3NpZ25tZW50cyl9O1xuIGNvbnN0IG90aGVyPWQuYXNzaWdubWVudHMuZmlsdGVyKGE9PmEuZW1wbG95ZWVJZCE9PTF8fGEuZGF5IT09JzIwMjYtMTEtMDMnKTtcbiBhc3NlcnQub2soc2V0RGF5U3RhdHVzKGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDMnLHN0YXR1czonZm9sZ2EnfSkub2spO1xuIGFzc2VydC5kZWVwRXF1YWwoZC5hc3NpZ25tZW50cyxvdGhlcik7XG4gYXNzZXJ0LmVxdWFsKGRheVN0YXR1cyhkLDEsJzIwMjYtMTEtMDMnKS5zdGF0dXMsJ2ZvbGdhJyk7XG4gYXNzZXJ0LmVxdWFsKGRheVN0YXR1cyhkLDIsJzIwMjYtMTEtMDMnKS5zdGF0dXMsJ3BsYW50YW8nKTtcbiBhc3NlcnQuZXF1YWwoZGF5U3RhdHVzKGQsMSwnMjAyNi0xMS0wNCcpLnN0YXR1cywncGxhbnRhbycpO1xuIGFzc2VydC5lcXVhbChkLnB1YmxpY2F0aW9uc1snMToyMDI2LTExJ10sdW5kZWZpbmVkKTtcbn0pO1xuXG50ZXN0KCdmb2xnYSBtYW51YWwgcGVyc2lzdGUgZSBhIGdlcmHDp8OjbyBhdXRvbcOhdGljYSByZXNwZWl0YSBlc3NhIHBlc3NvYSBuZXNzYSBkYXRhJywoKT0+e1xuIGNvbnN0IGQ9ZGVmYXVsdHMoKTtcbiBhc3NlcnQub2soc2V0RGF5U3RhdHVzKGQse2VtcGxveWVlSWQ6MixkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDMnLHN0YXR1czonZm9sZ2EnfSkub2spO1xuIGNvbnN0IHJlc3RvcmVkPWVuc3VyZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGQpKSk7XG4gY29uc3QgcmVzdWx0PWdlbmVyYXRlKHJlc3RvcmVkLG1vbnRoLDEpO1xuIGFzc2VydC5lcXVhbChkYXlTdGF0dXMocmVzdWx0LmRiLDIsJzIwMjYtMTEtMDMnKS5zdGF0dXMsJ2ZvbGdhJyk7XG4gYXNzZXJ0Lm9rKCFyZXN1bHQuZGIuYXNzaWdubWVudHMuc29tZShhPT5hLmVtcGxveWVlSWQ9PT0yJiZhLmRheT09PScyMDI2LTExLTAzJykpO1xuIGFzc2VydC5vayhyZXN1bHQuZGIuYXNzaWdubWVudHMuc29tZShhPT5hLmVtcGxveWVlSWQhPT0yJiZhLmRheT09PScyMDI2LTExLTAzJykpO1xuIGFzc2VydC5tYXRjaCh2YWxpZGF0ZUluc2VydChyZXN0b3JlZCx7ZW1wbG95ZWVJZDoyLGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0wMycsc2hpZnRJZDoxfSkuam9pbignICcpLC9Gb2xnYSBtYXJjYWRhLyk7XG59KTtcblxudGVzdCgndHJvY2FyIGZvbGdhIHBvciBwbGFudMOjbyBuw6NvIG1leGUgbmEgZm9sZ2EgZGUgb3V0cm8gZnVuY2lvbsOhcmlvJywoKT0+e1xuIGNvbnN0IGQ9ZGVmYXVsdHMoKTtcbiBmb3IoY29uc3QgZW1wbG95ZWVJZCBvZiBbMSwyXSlhc3NlcnQub2soc2V0RGF5U3RhdHVzKGQse2VtcGxveWVlSWQsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTAzJyxzdGF0dXM6J2ZvbGdhJ30pLm9rKTtcbiBhc3NlcnQub2soc2V0RGF5U3RhdHVzKGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDMnLHN0YXR1czoncGxhbnRhbycsc2hpZnRJZDoyfSkub2spO1xuIGFzc2VydC5lcXVhbChkYXlTdGF0dXMoZCwxLCcyMDI2LTExLTAzJykuc2hpZnRJZCwyKTtcbiBhc3NlcnQuZXF1YWwoZGF5U3RhdHVzKGQsMiwnMjAyNi0xMS0wMycpLnN0YXR1cywnZm9sZ2EnKTtcbiBhc3NlcnQuZXF1YWwoZC5kYXlzT2ZmLmxlbmd0aCwxKTtcbn0pO1xuXG50ZXN0KCdwbGFudMOjbyBpbnbDoWxpZG8gbWFudMOpbSBhIGZvbGdhIGUgdG9kb3Mgb3Mgb3V0cm9zIGRhZG9zIGludGFjdG9zJywoKT0+e1xuIGNvbnN0IGQ9ZGVmYXVsdHMoKTtcbiBwdXRBc3NpZ25tZW50KGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMTEtMDMnLHNoaWZ0SWQ6M30pO1xuIHNldERheVN0YXR1cyhkLHtlbXBsb3llZUlkOjEsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTA0JyxzdGF0dXM6J2ZvbGdhJ30pO1xuIGQucHVibGljYXRpb25zWycxOjIwMjYtMTEnXT17ZGF0ZTondGVzdGUnfTtcbiBjb25zdCBiZWZvcmU9Y2xvbmUoZCk7XG4gY29uc3QgcmVzdWx0PXNldERheVN0YXR1cyhkLHtlbXBsb3llZUlkOjEsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTA0JyxzdGF0dXM6J3BsYW50YW8nLHNoaWZ0SWQ6MX0pO1xuIGFzc2VydC5lcXVhbChyZXN1bHQub2ssZmFsc2UpO1xuIGFzc2VydC5tYXRjaChyZXN1bHQuZXJyb3JzLmpvaW4oJyAnKSwvRGVzY2Fuc28gaW5mZXJpb3IvKTtcbiBhc3NlcnQuZGVlcEVxdWFsKGQsYmVmb3JlKTtcbn0pO1xuXG50ZXN0KCdzaXR1YcOnw6NvIHLDoXBpZGEgcHJvdGVnZSBhdXPDqm5jaWFzIGFwcm92YWRhcyBlIGRhZG9zIGRlIG91dHJvIHNldG9yJywoKT0+e1xuIGNvbnN0IGQ9ZGVmYXVsdHMoKSxiZWZvcmU9Y2xvbmUoZCk7XG4gYXNzZXJ0LmVxdWFsKHNldERheVN0YXR1cyhkLHtlbXBsb3llZUlkOjQsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTE4JyxzdGF0dXM6J3BsYW50YW8nLHNoaWZ0SWQ6MX0pLm9rLGZhbHNlKTtcbiBhc3NlcnQuZXF1YWwoc2V0RGF5U3RhdHVzKGQse2VtcGxveWVlSWQ6MTMsZGVwYXJ0bWVudElkOjEsZGF5OicyMDI2LTExLTAzJyxzdGF0dXM6J2ZvbGdhJ30pLm9rLGZhbHNlKTtcbiBhc3NlcnQuZXF1YWwoc2V0RGF5U3RhdHVzKGQse2VtcGxveWVlSWQ6MSxkZXBhcnRtZW50SWQ6MSxkYXk6JzIwMjYtMDItMzEnLHN0YXR1czonZm9sZ2EnfSkub2ssZmFsc2UpO1xuIGFzc2VydC5kZWVwRXF1YWwoZCxiZWZvcmUpO1xufSk7XG5cbnRlc3QoJ27Do28gZGVmaW5pZG8gbsOjbyBzaWduaWZpY2EgZm9sZ2EgZSBwZXJtaXRlIGRlc2ZhemVyIHPDsyBhIGVzY29saGEgaW5kaXZpZHVhbCcsKCk9PntcbiBjb25zdCBkPWRlZmF1bHRzKCk7ZGVsZXRlIGQuZGF5c09mZjtlbnN1cmUoZCk7XG4gYXNzZXJ0LmVxdWFsKGRheVN0YXR1cyhkLDEsJzIwMjYtMTEtMDMnKS5zdGF0dXMsJ3VuYXNzaWduZWQnKTtcbiBzZXREYXlTdGF0dXMoZCx7ZW1wbG95ZWVJZDoxLGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0wMycsc3RhdHVzOidmb2xnYSd9KTtcbiBzZXREYXlTdGF0dXMoZCx7ZW1wbG95ZWVJZDoxLGRlcGFydG1lbnRJZDoxLGRheTonMjAyNi0xMS0wMycsc3RhdHVzOid1bmFzc2lnbmVkJ30pO1xuIGFzc2VydC5lcXVhbChkYXlTdGF0dXMoZCwxLCcyMDI2LTExLTAzJykuc3RhdHVzLCd1bmFzc2lnbmVkJyk7XG4gYXNzZXJ0LmRlZXBFcXVhbChkLmRheXNPZmYsW10pO1xufSk7XG4iXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLElBQUksTUFBTSxXQUFXO0FBQUMsT0FBT0MsTUFBTSxNQUFNLG9CQUFvQjtBQUNwRSxTQUFRQyxRQUFRLEVBQUNDLEtBQUssRUFBQ0MsT0FBTyxFQUFDQyxjQUFjLEVBQUNDLGFBQWEsRUFBQ0MsZ0JBQWdCLEVBQUNDLFFBQVEsRUFBQ0MsUUFBUSxFQUFDQyxZQUFZLEVBQUNDLE9BQU8sRUFBQ0MsT0FBTyxFQUFDQyxPQUFPLFFBQU8sZ0JBQWdCO0FBQzFKLE1BQU1DLEtBQUssR0FBQyxTQUFTO0FBQ3JCZCxJQUFJLENBQUMsa0NBQWtDLEVBQUMsTUFBSTtFQUFDQyxNQUFNLENBQUNjLEtBQUssQ0FBQ1gsT0FBTyxDQUFDLFlBQVksRUFBQyxDQUFDLENBQUMsRUFBQyxZQUFZLENBQUM7RUFBQ0gsTUFBTSxDQUFDYyxLQUFLLENBQUNYLE9BQU8sQ0FBQyxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxZQUFZLENBQUM7QUFBQSxDQUFDLENBQUM7QUFDckpKLElBQUksQ0FBQyxtRUFBbUUsRUFBQyxNQUFJO0VBQUMsSUFBSWdCLENBQUMsR0FBQ2QsUUFBUSxDQUFDLENBQUM7SUFBQ2UsQ0FBQyxHQUFDVCxRQUFRLENBQUNRLENBQUMsRUFBQ0YsS0FBSyxFQUFDLENBQUMsQ0FBQztFQUFDYixNQUFNLENBQUNjLEtBQUssQ0FBQ0UsQ0FBQyxDQUFD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 // Confere esta etapa do funcionamento.
