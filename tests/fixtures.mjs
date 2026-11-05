export function fixtureDatabase() { // Disponibiliza este recurso para outros arquivos.
  const deps = [{ // Prepara os valores usados no bloco.
    id: 1, // Define esta informação.
    name: 'Farmácia', // Define esta informação.
    color: '#2165c8', // Define esta informação.
    description: 'Equipe de atendimento e apoio.' // Define esta informação.
  }, { // Continua a organização do bloco.
    id: 2, // Define esta informação.
    name: 'Recepção', // Define esta informação.
    color: '#158c82', // Define esta informação.
    description: 'Atendimento e recepção.' // Define esta informação.
  }]; // Encerra este bloco.
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
  const names = ['Ana Silva', 'Bruno Santos', 'Carla Oliveira', 'Diego Lima', 'Eduarda Souza', 'Fernando Costa', 'Gabriela Rocha', 'Igor Martins', 'Juliana Alves', 'Leonardo Souza', 'Mariana Lopes', 'Paulo Henrique', 'Camila Ribeiro', 'Rafael Almeida', 'Patrícia Mendes']; // Prepara os valores usados no bloco.
  const employees = names.map((name, i) => ({ // Prepara os valores usados no bloco.
    id: i + 1, // Define esta informação.
    name, // Executa esta etapa.
    email: `colaborador${i + 1}@exemplo.com`, // Define esta informação.
    departmentId: i < 12 ? 1 : 2, // Define esta informação.
    role: i % 5 === 0 ? 'Técnico(a)' : 'Colaborador(a)', // Define esta informação.
    active: true, // Define esta informação.
    preferredShiftId: i % 3 + 1 // Define esta informação.
  })); // Encerra este bloco.
  const rules = { // Prepara os valores usados no bloco.
    1: { // Define esta informação.
      minStaff: { // Define esta informação.
        1: 2, // Define esta informação.
        2: 2, // Define esta informação.
        3: 2 // Define esta informação.
      }, // Encerra este bloco.
      maxWeeklyHours: 44, // Define esta informação.
      maxConsecutive: 6, // Define esta informação.
      minRest: 11, // Define esta informação.
      balanceWeekends: true, // Define esta informação.
      avoidAlone: true // Define esta informação.
    }, // Encerra este bloco.
    2: { // Define esta informação.
      minStaff: { // Define esta informação.
        1: 1, // Define esta informação.
        2: 1, // Define esta informação.
        3: 0 // Define esta informação.
      }, // Encerra este bloco.
      maxWeeklyHours: 44, // Define esta informação.
      maxConsecutive: 6, // Define esta informação.
      minRest: 11, // Define esta informação.
      balanceWeekends: true, // Define esta informação.
      avoidAlone: false // Define esta informação.
    } // Encerra este bloco.
  }; // Encerra este bloco.
  const requests = [{ // Prepara os valores usados no bloco.
    id: 1, // Define esta informação.
    employeeId: 1, // Define esta informação.
    type: 'folga', // Define esta informação.
    start: '2026-11-12', // Define esta informação.
    end: '2026-11-12', // Define esta informação.
    reason: 'Compromisso pessoal', // Define esta informação.
    status: 'pending', // Define esta informação.
    note: '', // Define esta informação.
    createdAt: '2026-10-25' // Define esta informação.
  }, { // Continua a organização do bloco.
    id: 2, // Define esta informação.
    employeeId: 4, // Define esta informação.
    type: 'folga', // Define esta informação.
    start: '2026-11-18', // Define esta informação.
    end: '2026-11-18', // Define esta informação.
    reason: 'Consulta médica', // Define esta informação.
    status: 'approved', // Define esta informação.
    note: 'Aprovado pela gestão', // Define esta informação.
    createdAt: '2026-10-26' // Define esta informação.
  }, { // Continua a organização do bloco.
    id: 3, // Define esta informação.
    employeeId: 7, // Define esta informação.
    type: 'troca', // Define esta informação.
    start: '2026-11-20', // Define esta informação.
    end: '2026-11-20', // Define esta informação.
    reason: 'Preferência por outro turno', // Define esta informação.
    status: 'pending', // Define esta informação.
    note: '', // Define esta informação.
    createdAt: '2026-10-27' // Define esta informação.
  }]; // Encerra este bloco.
  return { // Retorna o resultado.
    version: 2, // Define esta informação.
    org: 'Minha organização', // Define esta informação.
    activeDepartment: 1, // Define esta informação.
    employees, // Executa esta etapa.
    departments: deps, // Define esta informação.
    shifts, // Executa esta etapa.
    assignments: [], // Define esta informação.
    daysOff: [], // Define esta informação.
    requests, // Executa esta etapa.
    rules, // Executa esta etapa.
    publications: {}, // Define esta informação.
    audit: [], // Define esta informação.
    sequence: 200, // Define esta informação.
    createdAt: new Date().toISOString() // Define esta informação.
  }; // Encerra este bloco.
} // Encerra este bloco.
