export const KEY = 'escalapro-standalone-v2'; // Disponibiliza este recurso para outros arquivos.
export const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; // Disponibiliza este recurso para outros arquivos.
export const addDays = (day, n) => { // Disponibiliza este recurso para outros arquivos.
  let d = new Date(`${day}T12:00:00`); // Prepara os valores usados no bloco.
  d.setDate(d.getDate() + n); // Executa esta etapa.
  return iso(d.getFullYear(), d.getMonth() + 1, d.getDate()); // Retorna o resultado.
}; // Encerra este bloco.
export const daysIn = month => { // Disponibiliza este recurso para outros arquivos.
  let [y, m] = month.split('-').map(Number); // Prepara os valores usados no bloco.
  return new Date(y, m, 0).getDate(); // Retorna o resultado.
}; // Encerra este bloco.
export const eachDay = month => Array.from({ // Disponibiliza este recurso para outros arquivos.
  length: daysIn(month) // Define esta informação.
}, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`); // Continua a organização do bloco.
export const labelMonth = month => new Intl.DateTimeFormat('pt-BR', { // Disponibiliza este recurso para outros arquivos.
  month: 'long', // Define esta informação.
  year: 'numeric' // Define esta informação.
}).format(new Date(`${month}-01T12:00:00`)).replace(/^./, c => c.toUpperCase()); // Continua a organização do bloco.
export const labelDate = day => new Intl.DateTimeFormat('pt-BR', { // Disponibiliza este recurso para outros arquivos.
  weekday: 'long', // Define esta informação.
  day: 'numeric', // Define esta informação.
  month: 'long' // Define esta informação.
}).format(new Date(`${day}T12:00:00`)); // Continua a organização do bloco.
export const diffDays = (a, b) => Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000); // Disponibiliza este recurso para outros arquivos.
export const weekDay = day => new Date(`${day}T12:00:00`).getDay(); // Disponibiliza este recurso para outros arquivos.
export const monday = d => addDays(d, -((weekDay(d) + 6) % 7)); // Disponibiliza este recurso para outros arquivos.
export const mondayKey = d => monday(d); // Disponibiliza este recurso para outros arquivos.
export const shiftHours = s => { // Disponibiliza este recurso para outros arquivos.
  const [h1, m1] = s.start.split(':').map(Number), // Prepara os valores usados no bloco.
    [h2, m2] = s.end.split(':').map(Number); // Organiza a lista de dados.
  let a = h1 * 60 + m1, // Prepara os valores usados no bloco.
    b = h2 * 60 + m2; // Executa esta etapa.
  return ((b <= a ? b + 1440 : b) - a) / 60; // Retorna o resultado.
}; // Encerra este bloco.
const shiftMinutes = s => s.start.split(':').map(Number)[0] * 60 + Number(s.start.split(':')[1]); // Prepara os valores usados no bloco.
const endMinutes = s => shiftMinutes(s) + shiftHours(s) * 60; // Prepara os valores usados no bloco.
export const employee = (db, id) => db.employees.find(e => e.id === Number(id)); // Disponibiliza este recurso para outros arquivos.
export const shift = (db, id) => db.shifts.find(s => s.id === Number(id)); // Disponibiliza este recurso para outros arquivos.
export const department = (db, id) => db.departments.find(d => d.id === Number(id)); // Disponibiliza este recurso para outros arquivos.
export const assignmentsOn = (db, day, dep) => db.assignments.filter(a => a.day === day && (!dep || a.departmentId === dep)); // Disponibiliza este recurso para outros arquivos.
export const approvedAbsences = (db, id, day) => db.requests.filter(r => r.employeeId === Number(id) && r.status === 'approved' && r.type !== 'troca' && r.start <= day && r.end >= day); // Disponibiliza este recurso para outros arquivos.
export const requestText = { // Disponibiliza este recurso para outros arquivos.
  folga: 'Folga', // Define esta informação.
  troca: 'Troca de turno', // Define esta informação.
  ferias: 'Férias', // Define esta informação.
  ausencia: 'Indisponibilidade' // Define esta informação.
}; // Encerra este bloco.
export const clone = v => JSON.parse(JSON.stringify(v)); // Disponibiliza este recurso para outros arquivos.
export function defaultRules(shifts = [], minimum = 0) {
  return {
    minStaff: Object.fromEntries(shifts.map(item => [item.id, minimum])),
    maxWeeklyHours: 44,
    maxConsecutive: 6,
    minRest: 11,
    balanceWeekends: true,
    avoidAlone: false
  };
}
export function defaults() {
  const shifts = [{ // Prepara os valores usados no bloco.
    id: 1, // Define esta informação.
    name: 'Manhã', // Define esta informação.
    start: '07:00', // Define esta informação.
    end: '15:00', // Define esta informação.
    color: '#2876d4' // Define esta informação.
  }, { // Continua a organização do bloco.
    id: 2, // Define esta informação.
    name: 'Tarde', // Define esta informação.
    start: '13:00', // Define esta informação.
    end: '21:00', // Define esta informação.
    color: '#9d62dd' // Define esta informação.
  }, { // Continua a organização do bloco.
    id: 3, // Define esta informação.
    name: 'Noite', // Define esta informação.
    start: '21:00', // Define esta informação.
    end: '07:00', // Define esta informação.
    color: '#149b92' // Define esta informação.
  }]; // Encerra este bloco.
  return {
    version: 2,
    initializationVersion: 1,
    org: 'Minha organização',
    activeDepartment: null,
    employees: [],
    departments: [],
    shifts,
    assignments: [],
    daysOff: [],
    requests: [],
    rules: {},
    publications: {},
    audit: [],
    sequence: 0,
    createdAt: new Date().toISOString()
  };
}
export function ensure(db) { // Disponibiliza este recurso para outros arquivos.
  if (!db || !Array.isArray(db.employees) || !Array.isArray(db.assignments)) throw Error('Arquivo de dados inválido.'); // Confere a condição.
  if (db.daysOff === undefined) db.daysOff = []; // Confere a condição.
  if (!Array.isArray(db.daysOff)) throw Error('Lista de folgas inválida.'); // Confere a condição.
  return db; // Retorna o resultado.
} // Encerra este bloco.
function spans(a, s) { // Define esta rotina.
  let start = Date.parse(`${a.day}T00:00:00Z`) + shiftMinutes(s) * 60000, // Prepara os valores usados no bloco.
    end = start + shiftHours(s) * 3600000; // Executa esta etapa.
  return [start, end]; // Retorna o resultado.
} // Encerra este bloco.
export function validateInsert(db, record, { // Disponibiliza este recurso para outros arquivos.
  ignoreId = null // Executa esta etapa.
} = {}) { // Continua a organização do bloco.
  const errors = []; // Prepara os valores usados no bloco.
  const emp = employee(db, record.employeeId), // Prepara os valores usados no bloco.
    sh = shift(db, record.shiftId); // Executa esta etapa.
  if (!emp || !emp.active) errors.push('Funcionário inexistente ou inativo.'); // Confere a condição.
  if (!sh) errors.push('Turno não encontrado.'); // Confere a condição.
  if (!/^\d{4}-\d\d-\d\d$/.test(record.day) || Number.isNaN(Date.parse(record.day + 'T12:00:00'))) errors.push('Data inválida.'); // Confere a condição.
  if (errors.length) return errors; // Confere a condição.
  if (record.departmentId !== emp.departmentId) errors.push('Funcionário não pertence ao setor escolhido.'); // Confere a condição.
  if ((db.daysOff || []).some(item => item.employeeId === emp.id && item.day === record.day)) errors.push('Folga marcada para este funcionário nesta data.'); // Confere a condição.
  if (approvedAbsences(db, emp.id, record.day).length) errors.push('Folga ou indisponibilidade já aprovada para esta data.'); // Confere a condição.
  if (db.assignments.some(a => a.id !== ignoreId && a.day === record.day && a.employeeId === emp.id)) errors.push('Este funcionário já está escalado nesse dia.'); // Confere a condição.
  const rules = db.rules[record.departmentId] || defaultRules(db.shifts); // Prepara os valores usados no bloco.
  const [start, end] = spans(record, sh); // Prepara os valores usados no bloco.
  for (const a of db.assignments) { // Percorre os itens.
    if (a.id === ignoreId || a.employeeId !== emp.id) continue; // Confere a condição.
    const other = shift(db, a.shiftId); // Prepara os valores usados no bloco.
    if (!other) continue; // Confere a condição.
    const [s, e] = spans(a, other); // Prepara os valores usados no bloco.
    if (start < e && end > s) { // Confere a condição.
      errors.push('Os turnos se sobrepõem.'); // Executa esta etapa.
      break; // Finaliza esta opção.
    } // Encerra este bloco.
    const gap = Math.min(Math.abs(start - e), Math.abs(s - end)) / 3600000; // Prepara os valores usados no bloco.
    if ((start >= e || s >= end) && gap < rules.minRest) { // Confere a condição.
      errors.push(`Descanso inferior a ${rules.minRest} horas entre turnos.`); // Executa esta etapa.
      break; // Finaliza esta opção.
    } // Encerra este bloco.
  } // Encerra este bloco.
  const dates = new Set(db.assignments.filter(a => a.employeeId === emp.id && a.id !== ignoreId).map(a => a.day)); // Prepara os valores usados no bloco.
  dates.add(record.day); // Executa esta etapa.
  let streak = 1; // Prepara os valores usados no bloco.
  for (let d = addDays(record.day, -1); dates.has(d); d = addDays(d, -1)) streak++; // Percorre os itens.
  for (let d = addDays(record.day, 1); dates.has(d); d = addDays(d, 1)) streak++; // Percorre os itens.
  if (streak > rules.maxConsecutive) errors.push(`Mais de ${rules.maxConsecutive} dias seguidos trabalhando.`); // Confere a condição.
  const all = [...db.assignments.filter(a => a.employeeId === emp.id && a.id !== ignoreId), record]; // Prepara os valores usados no bloco.
  const affectedWeeks = new Set([mondayKey(record.day), mondayKey(addDays(record.day, 1))]); // Prepara os valores usados no bloco.
  for (const week of affectedWeeks) { // Percorre os itens.
    const begin = Date.parse(`${week}T00:00:00Z`), // Prepara os valores usados no bloco.
      finish = begin + 7 * 86400000; // Executa esta etapa.
    let weeklyHours = 0; // Prepara os valores usados no bloco.
    for (const a of all) { // Percorre os itens.
      const s = shift(db, a.shiftId); // Prepara os valores usados no bloco.
      if (!s) continue; // Confere a condição.
      const [start, end] = spans(a, s); // Prepara os valores usados no bloco.
      weeklyHours += Math.max(0, Math.min(end, finish) - Math.max(start, begin)) / 3600000; // Executa esta etapa.
    } // Encerra este bloco.
    if (weeklyHours > rules.maxWeeklyHours + 1e-8) { // Confere a condição.
      errors.push(`Carga semanal supera ${rules.maxWeeklyHours} horas.`); // Executa esta etapa.
      break; // Finaliza esta opção.
    } // Encerra este bloco.
  } // Encerra este bloco.
  return [...new Set(errors)]; // Retorna o resultado.
} // Encerra este bloco.
export function putAssignment(db, record) { // Disponibiliza este recurso para outros arquivos.
  const errors = validateInsert(db, record); // Prepara os valores usados no bloco.
  if (errors.length) return { // Confere a condição.
    ok: false, // Define esta informação.
    errors // Executa esta etapa.
  }; // Encerra este bloco.
  const a = { // Prepara os valores usados no bloco.
    id: ++db.sequence, // Define esta informação.
    ...record, // Executa esta etapa.
    locked: !!record.locked // Define esta informação.
  }; // Encerra este bloco.
  db.assignments.push(a); // Executa esta etapa.
  delete db.publications[`${a.departmentId}:${a.day.slice(0, 7)}`]; // Executa esta etapa.
  return { // Retorna o resultado.
    ok: true, // Define esta informação.
    assignment: a // Define esta informação.
  }; // Encerra este bloco.
} // Encerra este bloco.
export function removeAssignment(db, id) { // Disponibiliza este recurso para outros arquivos.
  const i = db.assignments.findIndex(a => a.id === Number(id)); // Prepara os valores usados no bloco.
  if (i < 0) return false; // Confere a condição.
  const a = db.assignments[i]; // Prepara os valores usados no bloco.
  db.assignments.splice(i, 1); // Executa esta etapa.
  delete db.publications[`${a.departmentId}:${a.day.slice(0, 7)}`]; // Executa esta etapa.
  return true; // Retorna o resultado.
} // Encerra este bloco.
export function evaluate(db, month, dep) { // Disponibiliza este recurso para outros arquivos.
  const workers = db.employees.filter(e => e.active && e.departmentId === dep), // Prepara os valores usados no bloco.
    rules = db.rules[dep] || defaultRules(db.shifts), // Executa esta etapa.
    days = eachDay(month), // Executa esta etapa.
    required = [], // Executa esta etapa.
    conflicts = [], // Executa esta etapa.
    coverage = [], // Executa esta etapa.
    hours = {}, // Executa esta etapa.
    weekends = {}; // Executa esta etapa.
  for (const emp of workers) { // Percorre os itens.
    hours[emp.id] = 0; // Executa esta etapa.
    weekends[emp.id] = 0; // Executa esta etapa.
  } // Encerra este bloco.
  for (const day of days) { // Percorre os itens.
    const actual = assignmentsOn(db, day, dep); // Prepara os valores usados no bloco.
    for (const sh of db.shifts) { // Percorre os itens.
      const configured = Number(rules.minStaff[sh.id] || 0); // Prepara os valores usados no bloco.
      const min = rules.avoidAlone && configured > 0 ? Math.max(2, configured) : configured; // Prepara os valores usados no bloco.
      const got = actual.filter(a => a.shiftId === sh.id).length; // Prepara os valores usados no bloco.
      coverage.push({ // Executa esta etapa.
        day, // Executa esta etapa.
        shiftId: sh.id, // Define esta informação.
        min, // Executa esta etapa.
        got // Executa esta etapa.
      }); // Encerra este bloco.
      if (got < min) required.push({ // Confere a condição.
        day, // Executa esta etapa.
        shiftId: sh.id, // Define esta informação.
        missing: min - got // Define esta informação.
      }); // Encerra este bloco.
    } // Encerra este bloco.
  } // Encerra este bloco.
  for (const a of db.assignments.filter(a => a.departmentId === dep && a.day.startsWith(month))) { // Percorre os itens.
    const sh = shift(db, a.shiftId); // Prepara os valores usados no bloco.
    hours[a.employeeId] = (hours[a.employeeId] || 0) + shiftHours(sh); // Executa esta etapa.
    if ([0, 6].includes(weekDay(a.day))) weekends[a.employeeId] = (weekends[a.employeeId] || 0) + 1; // Confere a condição.
    const rest = validateInsert(db, a, { // Prepara os valores usados no bloco.
      ignoreId: a.id // Define esta informação.
    }); // Encerra este bloco.
    if (rest.length) conflicts.push({ // Confere a condição.
      assignmentId: a.id, // Define esta informação.
      day: a.day, // Define esta informação.
      employeeId: a.employeeId, // Define esta informação.
      issues: rest // Define esta informação.
    }); // Encerra este bloco.
  } // Encerra este bloco.
  const need = coverage.reduce((sum, c) => sum + c.min, 0), // Prepara os valores usados no bloco.
    filled = coverage.reduce((sum, c) => sum + Math.min(c.min, c.got), 0); // Executa esta etapa.
  const balance = workers.map(e => ({ // Prepara os valores usados no bloco.
    employeeId: e.id, // Define esta informação.
    name: e.name, // Define esta informação.
    days: db.assignments.filter(a => a.employeeId === e.id && a.day.startsWith(month)).length, // Organiza a lista de dados.
    hours: hours[e.id], // Define esta informação.
    weekends: weekends[e.id] // Define esta informação.
  })); // Encerra este bloco.
  const values = balance.map(x => x.days); // Prepara os valores usados no bloco.
  return { // Retorna o resultado.
    required, // Executa esta etapa.
    conflicts, // Executa esta etapa.
    coverage, // Executa esta etapa.
    need, // Executa esta etapa.
    filled, // Executa esta etapa.
    percent: need ? Math.round(100 * filled / need) : 100, // Define esta informação.
    complete: required.length === 0 && conflicts.length === 0, // Define esta informação.
    balance, // Executa esta etapa.
    spread: values.length ? Math.max(...values) - Math.min(...values) : 0, // Define esta informação.
    staff: workers.length // Define esta informação.
  }; // Encerra este bloco.
} // Encerra este bloco.
export function generate(source, month, dep, { // Disponibiliza este recurso para outros arquivos.
  preserve = false, // Executa esta etapa.
  exclude = [] // Executa esta etapa.
} = {}) { // Continua a organização do bloco.
  const db = clone(source), // Prepara os valores usados no bloco.
    days = eachDay(month), // Executa esta etapa.
    rules = db.rules[dep] || defaultRules(db.shifts); // Executa esta etapa.
  const excluded = new Set(exclude.map(n => `${n.employeeId}:${n.day}`)); // Prepara os valores usados no bloco.
  db.assignments = db.assignments.filter(a => a.departmentId !== dep || !a.day.startsWith(month) || preserve && a.locked && !excluded.has(`${a.employeeId}:${a.day}`)); // Organiza a lista de dados.
  for (const day of days) { // Percorre os itens.
    for (const sh of db.shifts) { // Percorre os itens.
      const configured = Number(rules.minStaff[sh.id] || 0); // Prepara os valores usados no bloco.
      const min = rules.avoidAlone && configured > 0 ? Math.max(2, configured) : configured; // Prepara os valores usados no bloco.
      for (let k = 0; k < min; k++) { // Percorre os itens.
        if (assignmentsOn(db, day, dep).filter(a => a.shiftId === sh.id).length >= min) break; // Confere a condição.
        const candidates = db.employees.filter(e => e.active && e.departmentId === dep && !excluded.has(`${e.id}:${day}`) && !validateInsert(db, { // Prepara os valores usados no bloco.
          employeeId: e.id, // Define esta informação.
          departmentId: dep, // Define esta informação.
          day, // Executa esta etapa.
          shiftId: sh.id // Define esta informação.
        }).length); // Continua a organização do bloco.
        const score = e => { // Prepara os valores usados no bloco.
          const own = db.assignments.filter(a => a.employeeId === e.id), // Prepara os valores usados no bloco.
            m = own.filter(a => a.day.startsWith(month)), // Organiza a lista de dados.
            week = own.filter(a => mondayKey(a.day) === mondayKey(day)); // Organiza a lista de dados.
          const preferred = e.preferredShiftId === sh.id ? -.35 : 0; // Prepara os valores usados no bloco.
          const weekend = [0, 6].includes(weekDay(day)) ? m.filter(a => [0, 6].includes(weekDay(a.day))).length * 2 : 0; // Prepara os valores usados no bloco.
          return m.length * 3 + week.length * .5 + weekend + preferred; // Retorna o resultado.
        }; // Encerra este bloco.
        candidates.sort((a, b) => score(a) - score(b) || a.id - b.id); // Organiza a lista de dados.
        if (candidates.length) putAssignment(db, { // Confere a condição.
          employeeId: candidates[0].id, // Define esta informação.
          departmentId: dep, // Define esta informação.
          day, // Executa esta etapa.
          shiftId: sh.id // Define esta informação.
        }); // Encerra este bloco.
      } // Encerra este bloco.
    } // Encerra este bloco.
  } // Encerra este bloco.
  return { // Retorna o resultado.
    db, // Executa esta etapa.
    analysis: evaluate(db, month, dep) // Define esta informação.
  }; // Encerra este bloco.
} // Encerra este bloco.
export function applyRequest(db, id, status, note = '') { // Disponibiliza este recurso para outros arquivos.
  const req = db.requests.find(r => r.id === Number(id)); // Prepara os valores usados no bloco.
  if (!req) throw Error('Solicitação não encontrada.'); // Confere a condição.
  if (req.status !== 'pending') throw Error('A solicitação já foi analisada.'); // Confere a condição.
  if (!['approved', 'rejected'].includes(status)) throw Error('Decisão inválida.'); // Confere a condição.
  req.status = status; // Executa esta etapa.
  req.note = note; // Executa esta etapa.
  let removed = 0; // Prepara os valores usados no bloco.
  if (status === 'approved' && req.type !== 'troca') for (const a of [...db.assignments]) if (a.employeeId === req.employeeId && a.day >= req.start && a.day <= req.end) { // Confere a condição.
    removeAssignment(db, a.id); // Executa esta etapa.
    removed++; // Executa esta etapa.
  } // Encerra este bloco.
  db.audit.unshift({ // Executa esta etapa.
    time: new Date().toISOString(), // Define esta informação.
    message: `Solicitação #${id} ${status === 'approved' ? 'aprovada' : 'recusada'}; ${removed} alocação(ões) afetada(s).` // Define esta informação.
  }); // Encerra este bloco.
  return removed; // Retorna o resultado.
} // Encerra este bloco.
export function publish(db, month, dep) { // Disponibiliza este recurso para outros arquivos.
  const report = evaluate(db, month, dep); // Prepara os valores usados no bloco.
  if (!report.complete) throw Error(`Não é possível publicar: ${report.required.length} lacuna(s) de cobertura e ${report.conflicts.length} conflito(s).`); // Confere a condição.
  db.publications[`${dep}:${month}`] = { // Executa esta etapa.
    date: new Date().toISOString(), // Define esta informação.
    assignments: clone(db.assignments.filter(a => a.departmentId === dep && a.day.startsWith(month))) // Organiza a lista de dados.
  }; // Encerra este bloco.
  return report; // Retorna o resultado.
} // Encerra este bloco.
export function csvRows(db, month, dep) { // Disponibiliza este recurso para outros arquivos.
  const records = db.assignments.filter(a => a.departmentId === dep && a.day.startsWith(month)).sort((a, b) => a.day.localeCompare(b.day) || a.shiftId - b.shiftId); // Prepara os valores usados no bloco.
  return [['Data', 'Funcionário', 'Setor', 'Turno', 'Início', 'Fim'], ...records.map(a => [a.day, employee(db, a.employeeId)?.name || '', department(db, dep)?.name || '', shift(db, a.shiftId)?.name || '', shift(db, a.shiftId)?.start || '', shift(db, a.shiftId)?.end || ''])]; // Retorna o resultado.
} // Encerra este bloco.
export function dayStatus(db, employeeId, day) { // Disponibiliza este recurso para outros arquivos.
  const absence = approvedAbsences(db, employeeId, day)[0]; // Prepara os valores usados no bloco.
  if (absence) return { // Confere a condição.
    status: absence.type, // Define esta informação.
    source: 'approved', // Define esta informação.
    requestId: absence.id // Define esta informação.
  }; // Encerra este bloco.
  if ((db.daysOff || []).some(item => item.employeeId === Number(employeeId) && item.day === day)) return { // Confere a condição.
    status: 'folga', // Define esta informação.
    source: 'manual' // Define esta informação.
  }; // Encerra este bloco.
  const assignment = db.assignments.find(item => item.employeeId === Number(employeeId) && item.day === day); // Prepara os valores usados no bloco.
  return assignment ? { // Retorna o resultado.
    status: 'plantao', // Define esta informação.
    source: 'assignment', // Define esta informação.
    shiftId: assignment.shiftId // Define esta informação.
  } : { // Continua a organização do bloco.
    status: 'unassigned', // Define esta informação.
    source: 'none' // Define esta informação.
  }; // Encerra este bloco.
} // Encerra este bloco.
export function setDayStatus(db, { // Disponibiliza este recurso para outros arquivos.
  employeeId, // Executa esta etapa.
  departmentId, // Executa esta etapa.
  day, // Executa esta etapa.
  status, // Executa esta etapa.
  shiftId // Executa esta etapa.
}) { // Continua a organização do bloco.
  employeeId = Number(employeeId); // Executa esta etapa.
  departmentId = Number(departmentId); // Executa esta etapa.
  shiftId = Number(shiftId); // Executa esta etapa.
  const emp = employee(db, employeeId), // Prepara os valores usados no bloco.
    errors = []; // Executa esta etapa.
  if (!emp || !emp.active) errors.push('Funcionário inexistente ou inativo.');else if (emp.departmentId !== departmentId) errors.push('Funcionário não pertence ao setor escolhido.'); // Confere a condição.
  const parsed = new Date(`${day}T12:00:00Z`); // Prepara os valores usados no bloco.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) errors.push('Data inválida.'); // Confere a condição.
  if (!['folga', 'plantao', 'unassigned'].includes(status)) errors.push('Situação inválida.'); // Confere a condição.
  if (errors.length) return { // Confere a condição.
    ok: false, // Define esta informação.
    errors // Executa esta etapa.
  }; // Encerra este bloco.
  if (approvedAbsences(db, employeeId, day).length) return { // Confere a condição.
    ok: false, // Define esta informação.
    errors: ['Há uma ausência aprovada para esta pessoa. Altere a solicitação antes de modificar este dia.'] // Define esta informação.
  }; // Encerra este bloco.
  const current = dayStatus(db, employeeId, day); // Prepara os valores usados no bloco.
  if (current.status === status && (status !== 'plantao' || current.shiftId === shiftId)) return { // Confere a condição.
    ok: true, // Define esta informação.
    changed: false // Define esta informação.
  }; // Encerra este bloco.
  const draft = clone(db), // Prepara os valores usados no bloco.
    previous = draft.assignments.find(item => item.employeeId === employeeId && item.day === day); // Executa esta etapa.
  draft.daysOff = (draft.daysOff || []).filter(item => item.employeeId !== employeeId || item.day !== day); // Organiza a lista de dados.
  for (const assignment of [...draft.assignments]) if (assignment.employeeId === employeeId && assignment.day === day) removeAssignment(draft, assignment.id); // Percorre os itens.
  if (status === 'folga') draft.daysOff.push({ // Confere a condição.
    employeeId, // Executa esta etapa.
    departmentId, // Executa esta etapa.
    day // Executa esta etapa.
  }); // Encerra este bloco.
  if (status === 'plantao') { // Confere a condição.
    const result = putAssignment(draft, { // Prepara os valores usados no bloco.
      employeeId, // Executa esta etapa.
      departmentId, // Executa esta etapa.
      day, // Executa esta etapa.
      shiftId, // Executa esta etapa.
      locked: !!previous?.locked // Define esta informação.
    }); // Encerra este bloco.
    if (!result.ok) return result; // Confere a condição.
  } // Encerra este bloco.
  delete draft.publications[`${departmentId}:${day.slice(0, 7)}`]; // Executa esta etapa.
  db.assignments = draft.assignments; // Executa esta etapa.
  db.daysOff = draft.daysOff; // Executa esta etapa.
  db.sequence = draft.sequence; // Executa esta etapa.
  db.publications = draft.publications; // Executa esta etapa.
  return { // Retorna o resultado.
    ok: true, // Define esta informação.
    changed: true // Define esta informação.
  }; // Encerra este bloco.
} // Encerra este bloco.

