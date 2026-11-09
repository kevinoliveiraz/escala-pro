import test from 'node:test'; // Confere esta etapa do funcionamento.
import assert from 'node:assert/strict'; // Confere esta etapa do funcionamento.
import fs from 'node:fs'; // Confere esta etapa do funcionamento.
const nodes = { // Confere esta etapa do funcionamento.
  '#app': { // Confere esta etapa do funcionamento.
    innerHTML: '' // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  '#page-template': { // Confere esta etapa do funcionamento.
    innerHTML: '' // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  '#overlay': { // Confere esta etapa do funcionamento.
    innerHTML: '', // Confere esta etapa do funcionamento.
    classList: { // Confere esta etapa do funcionamento.
      add() {}, // Confere esta etapa do funcionamento.
      remove() {} // Confere esta etapa do funcionamento.
    } // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  '#toast': { // Confere esta etapa do funcionamento.
    appendChild(toast) { this.last = toast; }
  }, // Confere esta etapa do funcionamento.
  '#drop-status-error': { // Confere esta etapa do funcionamento.
    textContent: '' // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}; // Confere esta etapa do funcionamento.
let handlers = {}, // Confere esta etapa do funcionamento.
  lastNavigation = '', // Confere esta etapa do funcionamento.
  serial = 0; // Confere esta etapa do funcionamento.
global.localStorage = { // Confere esta etapa do funcionamento.
  value: {}, // Confere esta etapa do funcionamento.
  get length() {
    return Object.keys(this.value).length;
  },
  key(index) {
    return Object.keys(this.value)[index] ?? null;
  },
  getItem(key) { // Confere esta etapa do funcionamento.
    return this.value[key] || null; // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  setItem(key, value) { // Confere esta etapa do funcionamento.
    this.value[key] = String(value); // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}; // Confere esta etapa do funcionamento.
global.sessionStorage = { // Confere esta etapa do funcionamento.
  value: {}, // Confere esta etapa do funcionamento.
  getItem(key) { // Confere esta etapa do funcionamento.
    return this.value[key] || null; // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  setItem(key, value) { // Confere esta etapa do funcionamento.
    this.value[key] = String(value); // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}; // Confere esta etapa do funcionamento.
global.document = { // Confere esta etapa do funcionamento.
  body: { // Confere esta etapa do funcionamento.
    dataset: {}, // Confere esta etapa do funcionamento.
    appendChild() {} // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  title: '', // Confere esta etapa do funcionamento.
  querySelector(query) { // Confere esta etapa do funcionamento.
    return nodes[query] || null; // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  querySelectorAll() { // Confere esta etapa do funcionamento.
    return []; // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  addEventListener(name, handler) { // Confere esta etapa do funcionamento.
    handlers[name] = handler; // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  createElement() { // Confere esta etapa do funcionamento.
    return { // Confere esta etapa do funcionamento.
      style: {}, // Confere esta etapa do funcionamento.
      click() {}, // Confere esta etapa do funcionamento.
      remove() {} // Confere esta etapa do funcionamento.
    }; // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}; // Confere esta etapa do funcionamento.
global.window = { // Confere esta etapa do funcionamento.
  location: { // Confere esta etapa do funcionamento.
    assign(url) { // Confere esta etapa do funcionamento.
      lastNavigation = url; // Confere esta etapa do funcionamento.
    } // Confere esta etapa do funcionamento.
  }, // Confere esta etapa do funcionamento.
  print() {} // Confere esta etapa do funcionamento.
}; // Confere esta etapa do funcionamento.
global.confirm = () => true; // Confere esta etapa do funcionamento.
global.FormData = class { // Confere esta etapa do funcionamento.
  constructor(form) { // Confere esta etapa do funcionamento.
    this.fields = form.fields || {}; // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
  get(key) { // Confere esta etapa do funcionamento.
    return this.fields[key] ?? null; // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
  has(key) { // Confere esta etapa do funcionamento.
    return Object.hasOwn(this.fields, key); // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}; // Confere esta etapa do funcionamento.
const pages = [['escalas', 'index', 'Escalas', 'Novembro de 2026'], ['simulacoes', 'simulacoes', 'Simulações', 'Simulações'], ['solicitacoes', 'solicitacoes', 'Solicitações', 'Solicitações'], ['funcionarios', 'funcionarios', 'Funcionários', 'Funcionários'], ['setores', 'setores', 'Setores', 'Setores'], ['relatorios', 'relatorios', 'Relatórios', 'Relatórios'], ['configuracoes', 'configuracoes', 'Configurações', 'Configurações'], ['portal', 'portal', 'Minha escala', 'Minha escala'], ['my-requests', 'minhas-solicitacoes', 'Minhas solicitações', 'Minhas solicitações']]; // Confere esta etapa do funcionamento.
async function loadPage(id) { // Confere esta etapa do funcionamento.
  const [, file, title] = pages.find(page => page[0] === id), // Confere esta etapa do funcionamento.
    html = fs.readFileSync(new URL('../' + file + '.html', import.meta.url), 'utf8'); // Confere esta etapa do funcionamento.
  nodes['#page-template'].innerHTML = html.match(/<template id="page-template">([\s\S]*?)<\/template>/)[1]; // Confere esta etapa do funcionamento.
  nodes['#app'].innerHTML = ''; // Confere esta etapa do funcionamento.
  document.body.dataset = { // Confere esta etapa do funcionamento.
    page: id, // Confere esta etapa do funcionamento.
    title // Confere esta etapa do funcionamento.
  }; // Confere esta etapa do funcionamento.
  handlers = {}; // Confere esta etapa do funcionamento.
  await import(new URL('../js/' + (file === 'index' ? 'escalas' : file) + '.mjs?test=' + serial++, import.meta.url)); // Confere esta etapa do funcionamento.
} // Confere esta etapa do funcionamento.
const action = (name, data = {}) => handlers.click({ // Confere esta etapa do funcionamento.
  preventDefault() {}, // Confere esta etapa do funcionamento.
  stopPropagation() {}, // Confere esta etapa do funcionamento.
  target: { // Confere esta etapa do funcionamento.
    closest(query) { // Confere esta etapa do funcionamento.
      return query === '[data-action]' ? { // Confere esta etapa do funcionamento.
        dataset: { // Confere esta etapa do funcionamento.
          action: name, // Confere esta etapa do funcionamento.
          ...data // Confere esta etapa do funcionamento.
        }, // Confere esta etapa do funcionamento.
        setAttribute() {} // Confere esta etapa do funcionamento.
      } : query === '[data-page]' ? { // Confere esta etapa do funcionamento.
        tagName: 'BODY', // Confere esta etapa do funcionamento.
        dataset: { // Confere esta etapa do funcionamento.
          page: 'escalas' // Confere esta etapa do funcionamento.
        } // Confere esta etapa do funcionamento.
      } : null; // Confere esta etapa do funcionamento.
    } // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
const submit = (id, fields) => handlers.submit({ // Confere esta etapa do funcionamento.
  preventDefault() {}, // Confere esta etapa do funcionamento.
  target: { // Confere esta etapa do funcionamento.
    id: ['employee-form', 'assignment-form', 'decision-form'].includes(id) ? { value: fields.id || '' } : id, // Named inputs shadow form.id in real browsers.
    getAttribute(name) { return name === 'id' ? id : null; },
    fields // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
const change = (id, value) => handlers.change({ // Confere esta etapa do funcionamento.
  target: { // Confere esta etapa do funcionamento.
    id, // Confere esta etapa do funcionamento.
    value // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
const snapshot = () => JSON.parse(localStorage.value['escalapro-standalone-v2']); // Confere esta etapa do funcionamento.
function dragEmployee(employeeId, day) { // Confere esta etapa do funcionamento.
  handlers.dragstart({ // Confere esta etapa do funcionamento.
    target: { // Confere esta etapa do funcionamento.
      closest() { // Confere esta etapa do funcionamento.
        return { // Confere esta etapa do funcionamento.
          dataset: { // Confere esta etapa do funcionamento.
            employee: String(employeeId) // Confere esta etapa do funcionamento.
          } // Confere esta etapa do funcionamento.
        }; // Confere esta etapa do funcionamento.
      } // Confere esta etapa do funcionamento.
    }, // Confere esta etapa do funcionamento.
    dataTransfer: { // Confere esta etapa do funcionamento.
      setData() {} // Confere esta etapa do funcionamento.
    } // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  handlers.drop({ // Confere esta etapa do funcionamento.
    preventDefault() {}, // Confere esta etapa do funcionamento.
    target: { // Confere esta etapa do funcionamento.
      closest() { // Confere esta etapa do funcionamento.
        return { // Confere esta etapa do funcionamento.
          dataset: { // Confere esta etapa do funcionamento.
            day // Confere esta etapa do funcionamento.
          } // Confere esta etapa do funcionamento.
        }; // Confere esta etapa do funcionamento.
      } // Confere esta etapa do funcionamento.
    } // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
} // Confere esta etapa do funcionamento.
test('as nove páginas abrem sem cadastros ou dados de exemplo', async () => {
  for (const [id] of pages) {
    await loadPage(id);
    assert.match(nodes['#app'].innerHTML, /<h1>/);
    assert.doesNotMatch(nodes['#app'].innerHTML, /NaN|undefined|Ana Silva|Farmácia|Recepção/);
  }
  for (const field of ['employees', 'departments', 'assignments', 'requests', 'daysOff', 'audit']) {
    assert.deepEqual(snapshot()[field], []);
  }
});

test('cadastro inicial cria o primeiro setor e mantém o funcionário salvo', async () => {
  await loadPage('funcionarios');
  await action('new-employee');
  assert.match(nodes['#overlay'].innerHTML, /name="departmentName"/);
  assert.doesNotMatch(nodes['#overlay'].innerHTML, /class="modal-backdrop" data-action/);
  const before = snapshot();
  await submit('employee-form', { name: 'Pessoa de teste', email: 'teste@example.com', role: 'Atendente', preferredShiftId: '1' });
  assert.deepEqual(snapshot(), before);
  assert.match(nodes['#overlay'].innerHTML, /employee-form/);
  await submit('employee-form', { name: 'Pessoa de teste', email: 'teste@example.com', role: 'Atendente', preferredShiftId: '1', departmentName: 'Meu setor' });
  const saved = snapshot();
  assert.equal(saved.departments.length, 1);
  assert.equal(saved.employees.length, 1);
  assert.equal(saved.employees[0].departmentId, saved.departments[0].id);
  assert.match(nodes['#app'].innerHTML, /Pessoa de teste/);
  const { load } = await import('../js/storage.mjs');
  assert.deepEqual(load(), saved);
  await loadPage('configuracoes');
  assert.match(nodes['#app'].innerHTML, /Limpar dados/);
  await action('reset-data');
  assert.deepEqual(snapshot().employees, []);
  assert.deepEqual(snapshot().departments, []);
});

test('prepara uma equipe apenas para os cenários de teste seguintes', async () => {
  const { fixtureDatabase } = await import('./fixtures.mjs');
  const { generate } = await import('../js/core.mjs');
  const { replaceDatabase, persist, state } = await import('../js/shared/context.mjs');
  replaceDatabase(generate(fixtureDatabase(), '2026-11', 1).db);
  Object.assign(state, { departmentId: 1, portalEmployee: 1, selectedStaff: 1, selectedRequest: 1 });
  persist();
});

test('cada item do menu abre seu HTML, CSS e JavaScript próprios', async () => { // Confere esta etapa do funcionamento.
  for (const [id, file,, heading] of pages) { // Confere esta etapa do funcionamento.
    await loadPage(id); // Confere esta etapa do funcionamento.
    assert.match(nodes['#app'].innerHTML, new RegExp(heading)); // Confere esta etapa do funcionamento.
    assert.doesNotMatch(nodes['#app'].innerHTML, /NaN|\{\{\w+\}\}/); // Confere esta etapa do funcionamento.
    const html = fs.readFileSync(new URL('../' + file + '.html', import.meta.url), 'utf8'); // Confere esta etapa do funcionamento.
    const slug = file === 'index' ? 'escalas' : file; // Confere esta etapa do funcionamento.
    assert.ok(html.includes(`./css/${slug}.css`)); // Confere esta etapa do funcionamento.
    assert.ok(html.includes(`./js/${slug}.mjs`)); // Confere esta etapa do funcionamento.
    if (!['portal', 'my-requests'].includes(id)) for (const [, target] of pages.slice(0, 7)) assert.ok(nodes['#app'].innerHTML.includes(`href="./${target}.html"`)); // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('mês e setor permanecem selecionados ao mudar de página', async () => { // Confere esta etapa do funcionamento.
  await loadPage('escalas'); // Confere esta etapa do funcionamento.
  change('month-choice', '2026-12'); // Confere esta etapa do funcionamento.
  change('department-switch', '2'); // Confere esta etapa do funcionamento.
  await loadPage('relatorios'); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /value="2026-12"/); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /<option value="2" selected/); // Confere esta etapa do funcionamento.
  const view = JSON.parse(sessionStorage.value['escalapro-view-v1']); // Confere esta etapa do funcionamento.
  assert.equal(view.month, '2026-12'); // Confere esta etapa do funcionamento.
  assert.equal(view.departmentId, 2); // Confere esta etapa do funcionamento.
  change('department-switch', '1'); // Confere esta etapa do funcionamento.
  change('month-choice', '2026-11'); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('arraste abre Folga ou Plantão e só salva depois da escolha', async () => { // Confere esta etapa do funcionamento.
  await loadPage('escalas'); // Confere esta etapa do funcionamento.
  change('month-choice', '2026-12'); // Confere esta etapa do funcionamento.
  const before = snapshot(); // Confere esta etapa do funcionamento.
  dragEmployee(1, '2026-12-10'); // Confere esta etapa do funcionamento.
  assert.match(nodes['#overlay'].innerHTML, /Folga ou plantão\?/); // Confere esta etapa do funcionamento.
  assert.match(nodes['#overlay'].innerHTML, /data-action="choose-duty-turn"/); // Confere esta etapa do funcionamento.
  assert.match(nodes['#overlay'].innerHTML, /<fieldset id="drop-shift-choices"[^>]*hidden/); // Confere esta etapa do funcionamento.
  assert.deepEqual(snapshot(), before); // Confere esta etapa do funcionamento.
  await action('close-modal'); // Confere esta etapa do funcionamento.
  assert.deepEqual(snapshot(), before); // Confere esta etapa do funcionamento.
  dragEmployee(1, '2026-12-10'); // Confere esta etapa do funcionamento.
  await action('confirm-day-status', { // Confere esta etapa do funcionamento.
    id: '1', // Confere esta etapa do funcionamento.
    targetDay: '2026-12-10', // Confere esta etapa do funcionamento.
    status: 'folga' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.ok(snapshot().daysOff.some(item => item.employeeId === 1 && item.day === '2026-12-10')); // Confere esta etapa do funcionamento.
  assert.deepEqual(snapshot().assignments, before.assignments); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('Plantão revela os turnos e grava somente a pessoa e a data escolhidas', async () => { // Confere esta etapa do funcionamento.
  const before = snapshot(); // Confere esta etapa do funcionamento.
  dragEmployee(1, '2026-12-10'); // Confere esta etapa do funcionamento.
  nodes['#drop-shift-choices'] = { // Confere esta etapa do funcionamento.
    hidden: true, // Confere esta etapa do funcionamento.
    querySelector() { // Confere esta etapa do funcionamento.
      return null; // Confere esta etapa do funcionamento.
    } // Confere esta etapa do funcionamento.
  }; // Confere esta etapa do funcionamento.
  await action('choose-duty-turn'); // Confere esta etapa do funcionamento.
  assert.equal(nodes['#drop-shift-choices'].hidden, false); // Confere esta etapa do funcionamento.
  assert.deepEqual(snapshot(), before); // Confere esta etapa do funcionamento.
  delete nodes['#drop-shift-choices']; // Confere esta etapa do funcionamento.
  for (const shiftId of [1, 2, 3]) { // Confere esta etapa do funcionamento.
    if (shiftId > 1) dragEmployee(1, '2026-12-10'); // Confere esta etapa do funcionamento.
    await action('confirm-day-status', { // Confere esta etapa do funcionamento.
      id: '1', // Confere esta etapa do funcionamento.
      targetDay: '2026-12-10', // Confere esta etapa do funcionamento.
      status: 'plantao', // Confere esta etapa do funcionamento.
      shiftId: String(shiftId) // Confere esta etapa do funcionamento.
    }); // Confere esta etapa do funcionamento.
    const after = snapshot(); // Confere esta etapa do funcionamento.
    assert.equal(after.assignments.find(item => item.employeeId === 1 && item.day === '2026-12-10').shiftId, shiftId); // Confere esta etapa do funcionamento.
    assert.deepEqual(after.assignments.filter(item => item.employeeId !== 1 || item.day !== '2026-12-10'), before.assignments); // Confere esta etapa do funcionamento.
    assert.equal(nodes['#overlay'].innerHTML, ''); // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('clicar no plantão existente abre a escolha rápida e protege folgas aprovadas', async () => { // Confere esta etapa do funcionamento.
  const before = snapshot(), // Confere esta etapa do funcionamento.
    assigned = before.assignments.find(item => item.employeeId === 1 && item.day === '2026-12-10'); // Confere esta etapa do funcionamento.
  await action('edit-assignment', { // Confere esta etapa do funcionamento.
    id: String(assigned.id) // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.match(nodes['#overlay'].innerHTML, /Folga ou plantão\?/); // Confere esta etapa do funcionamento.
  assert.doesNotMatch(nodes['#overlay'].innerHTML, /Editar alocação/); // Confere esta etapa do funcionamento.
  assert.deepEqual(snapshot(), before); // Confere esta etapa do funcionamento.
  await action('close-modal'); // Confere esta etapa do funcionamento.
  dragEmployee(4, '2026-11-18'); // Confere esta etapa do funcionamento.
  const buttons = nodes['#overlay'].innerHTML.match(/<button[^>]*data-action="confirm-day-status"[^>]*>/g); // Confere esta etapa do funcionamento.
  assert.equal(buttons.length, 4); // Confere esta etapa do funcionamento.
  assert.ok(buttons.every(button => button.includes('disabled'))); // Confere esta etapa do funcionamento.
  await action('close-modal'); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('PDF abre a prévia sem baixar e usa o mesmo conteúdo no download', async () => { // Confere esta etapa do funcionamento.
  const before = snapshot(), // Confere esta etapa do funcionamento.
    oldCreate = document.createElement, // Confere esta etapa do funcionamento.
    oldURL = URL.createObjectURL, // Confere esta etapa do funcionamento.
    oldRevoke = URL.revokeObjectURL, // Confere esta etapa do funcionamento.
    blobs = [], // Confere esta etapa do funcionamento.
    downloads = [], // Confere esta etapa do funcionamento.
    revoked = []; // Confere esta etapa do funcionamento.
  document.createElement = tag => tag === 'a' ? { // Confere esta etapa do funcionamento.
    href: '', // Confere esta etapa do funcionamento.
    download: '', // Confere esta etapa do funcionamento.
    click() { // Confere esta etapa do funcionamento.
      downloads.push(this.download); // Confere esta etapa do funcionamento.
    }, // Confere esta etapa do funcionamento.
    remove() {} // Confere esta etapa do funcionamento.
  } : oldCreate(tag); // Confere esta etapa do funcionamento.
  URL.createObjectURL = blob => { // Confere esta etapa do funcionamento.
    blobs.push(blob); // Confere esta etapa do funcionamento.
    return 'blob:test-' + blobs.length; // Confere esta etapa do funcionamento.
  }; // Confere esta etapa do funcionamento.
  URL.revokeObjectURL = url => revoked.push(url); // Confere esta etapa do funcionamento.
  try { // Confere esta etapa do funcionamento.
    await action('export-pdf'); // Confere esta etapa do funcionamento.
    assert.equal(downloads.length, 0); // Confere esta etapa do funcionamento.
    assert.match(nodes['#overlay'].innerHTML, /Prévia da escala em PDF/); // Confere esta etapa do funcionamento.
    assert.match(nodes['#overlay'].innerHTML, /<iframe/); // Confere esta etapa do funcionamento.
    await action('download-pdf'); // Confere esta etapa do funcionamento.
    assert.deepEqual(downloads, ['EscalaPro_2026-12.pdf']); // Confere esta etapa do funcionamento.
    assert.equal(await blobs[0].text(), await blobs[1].text()); // Confere esta etapa do funcionamento.
    await action('close-modal'); // Confere esta etapa do funcionamento.
    assert.deepEqual(revoked, ['blob:test-1']); // Confere esta etapa do funcionamento.
    assert.deepEqual(snapshot(), before); // Confere esta etapa do funcionamento.
  } finally { // Confere esta etapa do funcionamento.
    document.createElement = oldCreate; // Confere esta etapa do funcionamento.
    URL.createObjectURL = oldURL; // Confere esta etapa do funcionamento.
    URL.revokeObjectURL = oldRevoke; // Confere esta etapa do funcionamento.
  } // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('simulação continua sendo prévia e aplicar leva ao HTML de escalas', async () => { // Confere esta etapa do funcionamento.
  await loadPage('simulacoes'); // Confere esta etapa do funcionamento.
  change('month-choice', '2026-11'); // Confere esta etapa do funcionamento.
  const before = snapshot(); // Confere esta etapa do funcionamento.
  await submit('simulation-form', { // Confere esta etapa do funcionamento.
    employee: '1', // Confere esta etapa do funcionamento.
    date: '2026-11-12', // Confere esta etapa do funcionamento.
    preserve: 'on' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /Alocações propostas/); // Confere esta etapa do funcionamento.
  assert.deepEqual(snapshot(), before); // Confere esta etapa do funcionamento.
  await action('apply-preview'); // Confere esta etapa do funcionamento.
  assert.equal(lastNavigation, './index.html'); // Confere esta etapa do funcionamento.
  await loadPage('escalas'); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /Novembro de 2026/); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('publicação e portal continuam compartilhando os mesmos dados locais', async () => { // Confere esta etapa do funcionamento.
  await action('publish'); // Confere esta etapa do funcionamento.
  assert.ok(snapshot().publications['1:2026-11']); // Confere esta etapa do funcionamento.
  await action('switch-role'); // Confere esta etapa do funcionamento.
  assert.equal(lastNavigation, './portal.html'); // Confere esta etapa do funcionamento.
  await loadPage('portal'); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /Escala publicada/); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /sem autenticação/); // Confere esta etapa do funcionamento.
  await action('new-request'); // Confere esta etapa do funcionamento.
  assert.match(nodes['#overlay'].innerHTML, /request-form/); // Confere esta etapa do funcionamento.
  await submit('request-form', { // Confere esta etapa do funcionamento.
    type: 'folga', // Confere esta etapa do funcionamento.
    start: '2026-11-12', // Confere esta etapa do funcionamento.
    end: '2026-11-12', // Confere esta etapa do funcionamento.
    reason: 'Pedido de teste' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  const request = snapshot().requests.at(-1); // Confere esta etapa do funcionamento.
  assert.equal(request.employeeId, 1); // Confere esta etapa do funcionamento.
  assert.equal(request.reason, 'Pedido de teste'); // Confere esta etapa do funcionamento.
  await loadPage('my-requests'); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /Pedido de teste/); // Confere esta etapa do funcionamento.
  await loadPage('solicitacoes'); // Confere esta etapa do funcionamento.
  await action('approve-request', { // Confere esta etapa do funcionamento.
    id: String(request.id) // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  await submit('decision-form', { // Confere esta etapa do funcionamento.
    id: String(request.id), // Confere esta etapa do funcionamento.
    status: 'approved', // Confere esta etapa do funcionamento.
    note: 'Conferido' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.equal(snapshot().requests.find(item => item.id === request.id).status, 'approved'); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('cadastros e regras funcionam em seus próprios arquivos de página', async () => { // Confere esta etapa do funcionamento.
  await loadPage('funcionarios'); // Confere esta etapa do funcionamento.
  await action('new-employee'); // Confere esta etapa do funcionamento.
  await submit('employee-form', { // Confere esta etapa do funcionamento.
    name: 'Pessoa de Teste', // Confere esta etapa do funcionamento.
    email: 'teste@exemplo.com', // Confere esta etapa do funcionamento.
    role: 'Colaborador(a)', // Confere esta etapa do funcionamento.
    departmentId: '1', // Confere esta etapa do funcionamento.
    preferredShiftId: '2' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.ok(snapshot().employees.some(item => item.name === 'Pessoa de Teste')); // Confere esta etapa do funcionamento.
  assert.match(nodes['#app'].innerHTML, /Pessoa de Teste/); // Confere esta etapa do funcionamento.
  await loadPage('setores'); // Confere esta etapa do funcionamento.
  await action('new-department'); // Confere esta etapa do funcionamento.
  await submit('department-form', { // Confere esta etapa do funcionamento.
    name: 'Setor de Teste', // Confere esta etapa do funcionamento.
    description: 'Cadastro de teste', // Confere esta etapa do funcionamento.
    color: '#225588' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  const department = snapshot().departments.at(-1); // Confere esta etapa do funcionamento.
  assert.equal(department.name, 'Setor de Teste'); // Confere esta etapa do funcionamento.
  await action('open-settings'); // Confere esta etapa do funcionamento.
  assert.equal(lastNavigation, './configuracoes.html'); // Confere esta etapa do funcionamento.
  await loadPage('configuracoes'); // Confere esta etapa do funcionamento.
  await submit('settings-form', { // Confere esta etapa do funcionamento.
    maxWeeklyHours: '40', // Confere esta etapa do funcionamento.
    maxConsecutive: '5', // Confere esta etapa do funcionamento.
    minRest: '12', // Confere esta etapa do funcionamento.
    coverage_1: '1', // Confere esta etapa do funcionamento.
    coverage_2: '0', // Confere esta etapa do funcionamento.
    coverage_3: '0' // Confere esta etapa do funcionamento.
  }); // Confere esta etapa do funcionamento.
  assert.equal(snapshot().rules[department.id].maxWeeklyHours, 40); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.
test('marcadores de atributos continuam válidos após o navegador ler o HTML', async () => { // Confere esta etapa do funcionamento.
  await loadPage('configuracoes'); // Confere esta etapa do funcionamento.
  const { // Confere esta etapa do funcionamento.
    renderTemplate // Confere esta etapa do funcionamento.
  } = await import('../js/shared/ui.mjs'); // Confere esta etapa do funcionamento.
  nodes['#page-template'].innerHTML = '<input {{ativo}}="" value="{{valor}}">'; // Confere esta etapa do funcionamento.
  assert.equal(renderTemplate({ // Confere esta etapa do funcionamento.
    ativo: 'checked', // Confere esta etapa do funcionamento.
    valor: 'teste' // Confere esta etapa do funcionamento.
  }), '<input checked value="teste">'); // Confere esta etapa do funcionamento.
  assert.equal(renderTemplate({ // Confere esta etapa do funcionamento.
    ativo: '', // Confere esta etapa do funcionamento.
    valor: 'teste' // Confere esta etapa do funcionamento.
  }), '<input  value="teste">'); // Confere esta etapa do funcionamento.
}); // Confere esta etapa do funcionamento.

test('previews editáveis e resultados de simulação permanecem separados da escala principal', async () => {
  const { KEY } = await import('../js/core.mjs');
  const { listSchedulePreviews } = await import('../js/schedule-previews.mjs');
  const original = localStorage.getItem(KEY);
  await loadPage('escalas');
  change('department-switch', '1');
  change('month-choice', '2026-12');
  await action('new-schedule-preview');
  assert.match(nodes['#overlay'].innerHTML, /Nome do preview/);
  await submit('schedule-preview-form', { name: 'Preview 1' });
  const first = listSchedulePreviews().find(item => item.name === 'Preview 1');
  assert.ok(first);
  await action('confirm-day-status', { id: '1', targetDay: '2026-12-10', status: 'folga' });
  assert.match(nodes['#app'].innerHTML, /1 dia diferente da principal/);
  assert.match(nodes['#app'].innerHTML, /class="day-preview-difference"/);

  change('schedule-preview-select', '');
  assert.doesNotMatch(nodes['#app'].innerHTML, /class="day-preview-difference"/);
  await submit('schedule-preview-form', { name: 'Preview 2' });
  const second = listSchedulePreviews().find(item => item.name === 'Preview 2');
  assert.ok(second);
  assert.match(nodes['#app'].innerHTML, /0 dias diferentes da principal/);
  change('schedule-preview-select', first.id);
  await loadPage('relatorios');
  assert.match(nodes['#app'].innerHTML, /1 dia diferente da principal/);
  await loadPage('escalas');
  assert.match(nodes['#app'].innerHTML, /Preview · Preview 1/);
  assert.match(nodes['#app'].innerHTML, /data-action="publish" disabled/);
  change('month-choice', '2027-01');
  await action('confirm-day-status', { id: '1', targetDay: '2027-01-02', status: 'folga' });
  assert.match(nodes['#app'].innerHTML, /1 dia diferente da principal/);
  change('month-choice', '2026-12');
  assert.match(nodes['#app'].innerHTML, /1 dia diferente da principal/);

  await loadPage('simulacoes');
  change('schedule-preview-select', '');
  change('month-choice', '2026-11');
  await submit('simulation-form', { employee: '1', date: '2026-11-12', preserve: 'on' });
  assert.match(nodes['#app'].innerHTML, /Salvar como preview/);
  await submit('schedule-preview-form', { name: 'Simulação salva', source: 'simulation' });
  assert.equal(lastNavigation, './index.html');
  await loadPage('escalas');
  assert.match(nodes['#app'].innerHTML, /Preview · Simulação salva/);
  assert.equal(localStorage.getItem(KEY), original);
});

test('bloqueia folgas acima do limite antes de salvar e aceita a mesma data com o bloqueio desligado', async () => {
  const { fixtureDatabase } = await import('./fixtures.mjs');
  const { readSchedulePreview } = await import('../js/schedule-previews.mjs');
  const { replaceDatabase, persist, state } = await import('../js/shared/context.mjs');
  await loadPage('configuracoes');
  const base = fixtureDatabase();
  base.daysOff = [{ employeeId: 1, departmentId: 1, day: '2026-12-26' }];
  const shiftDay = '2027-01-08';
  base.assignments.push({ id: ++base.sequence, employeeId: 1, departmentId: 1, day: shiftDay, shiftId: 2 });
  base.rules[1].maxConsecutive = 5;
  replaceDatabase(base);
  persist();
  state.schedulePreviewId = '';
  await loadPage('escalas');
  change('department-switch', '1');
  await submit('schedule-preview-form', { name: 'Teste do bloqueio de folgas' });
  const previewId = state.schedulePreviewId;
  assert.ok(previewId);

  await loadPage('configuracoes');
  assert.match(nodes['#app'].innerHTML, /data-action="toggle-rest-gap-block"[^>]+aria-pressed="false"/);
  await action('toggle-rest-gap-block');
  await loadPage('configuracoes');
  assert.match(nodes['#app'].innerHTML, /data-action="toggle-rest-gap-block"[^>]+aria-pressed="true"/);
  assert.equal(snapshot().rules[1].warnRestGap, true);

  await loadPage('escalas');
  change('month-choice', '2027-01');
  const markOff = targetDay => action('confirm-day-status', { id: '1', targetDay, status: 'folga' });
  await markOff('2027-01-01'); // Five days between breaks, across the month boundary.
  assert.equal(nodes['#toast'].last.className, 'toast ok');
  assert.ok(readSchedulePreview(previewId).database.daysOff.some(off => off.day === '2027-01-01'));
  const before = readSchedulePreview(previewId);
  await action('choose-day-status', { id: '1', targetDay: shiftDay });
  await markOff(shiftDay);
  assert.match(nodes['#overlay'].innerHTML, /Folga ou plantão\?/);
  assert.match(nodes['#drop-status-error'].textContent, /Folga não registrada\. Ficariam 6 dias sem descanso registrado entre 01\/01\/2027 e 08\/01\/2027\. O limite do setor é de 5 dias/);
  assert.deepEqual(readSchedulePreview(previewId), before);

  await loadPage('configuracoes');
  await action('toggle-rest-gap-block');
  assert.equal(snapshot().rules[1].warnRestGap, false);
  await loadPage('escalas');
  await markOff(shiftDay);
  assert.equal(nodes['#toast'].last.className, 'toast ok');
  assert.ok(readSchedulePreview(previewId).database.daysOff.some(off => off.day === shiftDay));
  assert.deepEqual(snapshot().daysOff, base.daysOff);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0ZXN0IiwiYXNzZXJ0IiwiZnMiLCJub2RlcyIsImlubmVySFRNTCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImFwcGVuZENoaWxkIiwidGV4dENvbnRlbnQiLCJoYW5kbGVycyIsImxhc3ROYXZpZ2F0aW9uIiwic2VyaWFsIiwiZ2xvYmFsIiwibG9jYWxTdG9yYWdlIiwidmFsdWUiLCJnZXRJdGVtIiwia2V5Iiwic2V0SXRlbSIsIlN0cmluZyIsInNlc3Npb25TdG9yYWdlIiwiZG9jdW1lbnQiLCJib2R5IiwiZGF0YXNldCIsInRpdGxlIiwicXVlcnlTZWxlY3RvciIsInF1ZXJ5IiwicXVlcnlTZWxlY3RvckFsbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJuYW1lIiwiaGFuZGxlciIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImNsaWNrIiwid2luZG93IiwibG9jYXRpb24iLCJhc3NpZ24iLCJ1cmwiLCJwcmludCIsImNvbmZpcm0iLCJGb3JtRGF0YSIsImNvbnN0cnVjdG9yIiwiZm9ybSIsImZpZWxkcyIsImdldCIsImhhcyIsIk9iamVjdCIsImhhc093biIsInBhZ2VzIiwibG9hZFBhZ2UiLCJpZCIsImZpbGUiLCJmaW5kIiwicGFnZSIsImh0bWwiLCJyZWFkRmlsZVN5bmMiLCJVUkwiLCJpbXBvcnQiLCJtZXRhIiwibWF0Y2giLCJhY3Rpb24iLCJkYXRhIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJ0YXJnZXQiLCJjbG9zZXN0Iiwic2V0QXR0cmlidXRlIiwidGFnTmFtZSIsInN1Ym1pdCIsImNoYW5nZSIsInNuYXBzaG90IiwiSlNPTiIsInBhcnNlIiwiZHJhZ0VtcGxveWVlIiwiZW1wbG95ZWVJZCIsImRheSIsImRyYWdzdGFydCIsImVtcGxveWVlIiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsImRyb3AiLCJoZWFkaW5nIiwiUmVnRXhwIiwiZG9lc05vdE1hdGNoIiwic2x1ZyIsIm9rIiwiaW5jbHVkZXMiLCJzbGljZSIsInZpZXciLCJlcXVhbCIsIm1vbnRoIiwiZGVwYXJ0bWVudElkIiwiYmVmb3JlIiwiZGVlcEVxdWFsIiwidGFyZ2V0RGF5Iiwic3RhdHVzIiwiZGF5c09mZiIsInNvbWUiLCJpdGVtIiwiYXNzaWdubWVudHMiLCJoaWRkZW4iLCJzaGlmdElkIiwiYWZ0ZXIiLCJmaWx0ZXIiLCJhc3NpZ25lZCIsImJ1dHRvbnMiLCJsZW5ndGgiLCJldmVyeSIsImJ1dHRvbiIsIm9sZENyZWF0ZSIsIm9sZFVSTCIsImNyZWF0ZU9iamVjdFVSTCIsIm9sZFJldm9rZSIsInJldm9rZU9iamVjdFVSTCIsImJsb2JzIiwiZG93bmxvYWRzIiwicmV2b2tlZCIsInRhZyIsImhyZWYiLCJkb3dubG9hZCIsInB1c2giLCJibG9iIiwidGV4dCIsImRhdGUiLCJwcmVzZXJ2ZSIsInB1YmxpY2F0aW9ucyIsInR5cGUiLCJzdGFydCIsImVuZCIsInJlYXNvbiIsInJlcXVlc3QiLCJyZXF1ZXN0cyIsImF0Iiwibm90ZSIsImVtYWlsIiwicm9sZSIsInByZWZlcnJlZFNoaWZ0SWQiLCJlbXBsb3llZXMiLCJkZXNjcmlwdGlvbiIsImNvbG9yIiwiZGVwYXJ0bWVudCIsImRlcGFydG1lbnRzIiwibWF4V2Vla2x5SG91cnMiLCJtYXhDb25zZWN1dGl2ZSIsIm1pblJlc3QiLCJjb3ZlcmFnZV8xIiwiY292ZXJhZ2VfMiIsImNvdmVyYWdlXzMiLCJydWxlcyIsInJlbmRlclRlbXBsYXRlIiwiYXRpdm8iLCJ2YWxvciJdLCJzb3VyY2VzIjpbInVpLnRlc3QubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ25vZGU6dGVzdCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ25vZGU6YXNzZXJ0L3N0cmljdCc7XG5pbXBvcnQgZnMgZnJvbSAnbm9kZTpmcyc7XG5jb25zdCBub2Rlcz17JyNhcHAnOntpbm5lckhUTUw6Jyd9LCcjcGFnZS10ZW1wbGF0ZSc6e2lubmVySFRNTDonJ30sJyNvdmVybGF5Jzp7aW5uZXJIVE1MOicnLGNsYXNzTGlzdDp7YWRkKCl7fSxyZW1vdmUoKXt9fX0sJyN0b2FzdCc6e2FwcGVuZENoaWxkKCl7fX0sJyNkcm9wLXN0YXR1cy1lcnJvcic6e3RleHRDb250ZW50OicnfX07XG5sZXQgaGFuZGxlcnM9e30sbGFzdE5hdmlnYXRpb249Jycsc2VyaWFsPTA7XG5nbG9iYWwubG9jYWxTdG9yYWdlPXt2YWx1ZTp7fSxnZXRJdGVtKGtleSl7cmV0dXJuIHRoaXMudmFsdWVba2V5XXx8bnVsbH0sc2V0SXRlbShrZXksdmFsdWUpe3RoaXMudmFsdWVba2V5XT1TdHJpbmcodmFsdWUpfX07XG5nbG9iYWwuc2Vzc2lvblN0b3JhZ2U9e3ZhbHVlOnt9LGdldEl0ZW0oa2V5KXtyZXR1cm4gdGhpcy52YWx1ZVtrZXldfHxudWxsfSxzZXRJdGVtKGtleSx2YWx1ZSl7dGhpcy52YWx1ZVtrZXldPVN0cmluZyh2YWx1ZSl9fTtcbmdsb2JhbC5kb2N1bWVudD17Ym9keTp7ZGF0YXNldDp7fSxhcHBlbmRDaGlsZCgpe319LHRpdGxlOicnLHF1ZXJ5U2VsZWN0b3IocXVlcnkpe3JldHVybiBub2Rlc1txdWVyeV18fG51bGx9LHF1ZXJ5U2VsZWN0b3JBbGwoKXtyZXR1cm4gW119LGFkZEV2ZW50TGlzdGVuZXIobmFtZSxoYW5kbGVyKXtoYW5kbGVyc1tuYW1lXT1oYW5kbGVyfSxjcmVhdGVFbGVtZW50KCl7cmV0dXJuIHtzdHlsZTp7fSxjbGljaygpe30scmVtb3ZlKCl7fX19fTtcbmdsb2JhbC53aW5kb3c9e2xvY2F0aW9uOnthc3NpZ24odXJsKXtsYXN0TmF2aWdhdGlvbj11cmx9fSxwcmludCgpe319O1xuZ2xvYmFsLmNvbmZpcm09KCk9PnRydWU7XG5nbG9iYWwuRm9ybURhdGE9Y2xhc3N7Y29uc3RydWN0b3IoZm9ybSl7dGhpcy5maWVsZHM9Zm9ybS5maWVsZHN8fHt9fWdldChrZXkpe3JldHVybiB0aGlzLmZpZWxkc1trZXldPz9udWxsfWhhcyhrZXkpe3JldHVybiBPYmplY3QuaGFzT3duKHRoaXMuZmllbGRzLGtleSl9fTtcbmNvbnN0IHBhZ2VzPVtbJ2VzY2FsYXMnLCdpbmRleCcsJ0VzY2FsYXMnLCdOb3ZlbWJybyBkZSAyMDI2J10sWydzaW11bGFjb2VzJywnc2ltdWxhY29lcycsJ1NpbXVsYcOnw7VlcycsJ1NpbXVsYcOnw7VlcyddLFsnc29saWNpdGFjb2VzJywnc29saWNpdGFjb2VzJywnU29saWNpdGHDp8O1ZXMnLCdTb2xpY2l0YcOnw7VlcyddLFsnZnVuY2lvbmFyaW9zJywnZnVuY2lvbmFyaW9zJywnRnVuY2lvbsOhcmlvcycsJ0Z1bmNpb27DoXJpb3MnXSxbJ3NldG9yZXMnLCdzZXRvcmVzJywnU2V0b3JlcycsJ1NldG9yZXMnXSxbJ3JlbGF0b3Jpb3MnLCdyZWxhdG9yaW9zJywnUmVsYXTDs3Jpb3MnLCdSZWxhdMOzcmlvcyddLFsnY29uZmlndXJhY29lcycsJ2NvbmZpZ3VyYWNvZXMnLCdDb25maWd1cmHDp8O1ZXMnLCdDb25maWd1cmHDp8O1ZXMnXSxbJ3BvcnRhbCcsJ3BvcnRhbCcsJ01pbmhhIGVzY2FsYScsJ01pbmhhIGVzY2FsYSddLFsnbXktcmVxdWVzdHMnLCdtaW5oYXMtc29saWNpdGFjb2VzJywnTWluaGFzIHNvbGljaXRhw6fDtWVzJywnTWluaGFzIHNvbGljaXRhw6fDtWVzJ11dO1xuYXN5bmMgZnVuY3Rpb24gbG9hZFBhZ2UoaWQpe1xuIGNvbnN0IFssZmlsZSx0aXRsZV09cGFnZXMuZmluZChwYWdlPT5wYWdlWzBdPT09aWQpLGh0bWw9ZnMucmVhZEZpbGVTeW5jKG5ldyBVUkwoJy4uLycrZmlsZSsnLmh0bWwnLGltcG9ydC5tZXRhLnVybCksJ3V0ZjgnKTtcbiBub2Rlc1snI3BhZ2UtdGVtcGxhdGUnXS5pbm5lckhUTUw9aHRtbC5tYXRjaCgvPHRlbXBsYXRlIGlkPVwicGFnZS10ZW1wbGF0ZVwiPihbXFxzXFxTXSo/KTxcXC90ZW1wbGF0ZT4vKVsxXTtcbiBub2Rlc1snI2FwcCddLmlubmVySFRNTD0nJztkb2N1bWVudC5ib2R5LmRhdGFzZXQ9e3BhZ2U6aWQsdGl0bGV9O2hhbmRsZXJzPXt9O1xuIGF3YWl0IGltcG9ydChuZXcgVVJMKCcuLi9qcy8nKyhmaWxlPT09J2luZGV4Jz8nZXNjYWxhcyc6ZmlsZSkrJy5tanM/dGVzdD0nK3NlcmlhbCsrLGltcG9ydC5tZXRhLnVybCkpO1xufVxuY29uc3QgYWN0aW9uPShuYW1lLGRhdGE9e30pPT5oYW5kbGVycy5jbGljayh7cHJldmVudERlZmF1bHQoKXt9LHN0b3BQcm9wYWdhdGlvbigpe30sdGFyZ2V0OntjbG9zZXN0KHF1ZXJ5KXtyZXR1cm4gcXVlcnk9PT0nW2RhdGEtYWN0aW9uXSc/e2RhdGFzZXQ6e2FjdGlvbjpuYW1lLC4uLmRhdGF9LHNldEF0dHJpYnV0ZSgpe319OnF1ZXJ5PT09J1tkYXRhLXBhZ2VdJz97dGFnTmFtZTonQk9EWScsZGF0YXNldDp7cGFnZTonZXNjYWxhcyd9fTpudWxsfX19KTtcbmNvbnN0IHN1Ym1pdD0oaWQsZmllbGRzKT0+aGFuZGxlcnMuc3VibWl0KHtwcmV2ZW50RGVmYXVsdCgpe30sdGFyZ2V0OntpZCxmaWVsZHN9fSk7XG5jb25zdCBjaGFuZ2U9KGlkLHZhbHVlKT0+aGFuZGxlcnMuY2hhbmdlKHt0YXJnZXQ6e2lkLHZhbHVlfX0pO1xuY29uc3Qgc25hcHNob3Q9KCk9PkpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnZhbHVlWydlc2NhbGFwcm8tc3RhbmRhbG9uZS12MiddKTtcbmZ1bmN0aW9uIGRyYWdFbXBsb3llZShlbXBsb3llZUlkLGRheSl7aGFuZGxlcnMuZHJhZ3N0YXJ0KHt0YXJnZXQ6e2Nsb3Nlc3QoKXtyZXR1cm4ge2RhdGFzZXQ6e2VtcGxveWVlOlN0cmluZyhlbXBsb3llZUlkKX19fX0sZGF0YVRyYW5zZmVyOntzZXREYXRhKCl7fX19KTtoYW5kbGVycy5kcm9wKHtwcmV2ZW50RGVmYXVsdCgpe30sdGFyZ2V0OntjbG9zZXN0KCl7cmV0dXJuIHtkYXRhc2V0OntkYXl9fX19fSl9XG5cbnRlc3QoJ2NhZGEgaXRlbSBkbyBtZW51IGFicmUgc2V1IEhUTUwsIENTUyBlIEphdmFTY3JpcHQgcHLDs3ByaW9zJyxhc3luYygpPT57XG4gZm9yKGNvbnN0IFtpZCxmaWxlLCxoZWFkaW5nXSBvZiBwYWdlcyl7XG4gIGF3YWl0IGxvYWRQYWdlKGlkKTtcbiAgYXNzZXJ0Lm1hdGNoKG5vZGVzWycjYXBwJ10uaW5uZXJIVE1MLG5ldyBSZWdFeHAoaGVhZGluZykpO2Fzc2VydC5kb2VzTm90TWF0Y2gobm9kZXNbJyNhcHAnXS5pbm5lckhUTUwsL05hTnxcXHtcXHtcXHcrXFx9XFx9Lyk7XG4gIGNvbnN0IGh0bWw9ZnMucmVhZEZpbGVTeW5jKG5ldyBVUkwoJy4uLycrZmlsZSsnLmh0bWwnLGltcG9ydC5tZXRhLnVybCksJ3V0ZjgnKTtcbiAgY29uc3Qgc2x1Zz1maWxlPT09J2luZGV4Jz8nZXNjYWxhcyc6ZmlsZTtcbiAgYXNzZXJ0Lm9rKGh0bWwuaW5jbHVkZXMoYC4vY3NzLyR7c2x1Z30uY3NzYCkpO2Fzc2VydC5vayhodG1sLmluY2x1ZGVzKGAuL2pzLyR7c2x1Z30ubWpzYCkpO1xuICBpZighWydwb3J0YWwnLCdteS1yZXF1ZXN0cyddLmluY2x1ZGVzKGlkKSlmb3IoY29uc3QgWyx0YXJnZXRdIG9mIHBhZ2VzLnNsaWNlKDAsNykpYXNzZXJ0Lm9rKG5vZGVzWycjYXBwJ10uaW5uZXJIVE1MLmluY2x1ZGVzKGBocmVmPVwiLi8ke3RhcmdldH0uaHRtbFwiYCkpO1xuIH1cbn0pO1xuXG50ZXN0KCdtw6pzIGUgc2V0b3IgcGVybWFuZWNlbSBzZWxlY2lvbmFkb3MgYW8gbXVkYXIgZGUgcMOhZ2luYScsYXN5bmMoKT0+e1xuIGF3YWl0IGxvYWRQYWdlKCdlc2NhbGFzJyk7Y2hhbmdlKCdtb250aC1jaG9pY2UnLCcyMDI2LTEyJyk7Y2hhbmdlKCdkZXBhcnRtZW50LXN3aXRjaCcsJzInKTtcbiBhd2FpdCBsb2FkUGFnZSgncmVsYXRvcmlvcycpO2Fzc2VydC5tYXRjaChub2Rlc1snI2FwcCddLmlubmVySFRNTCwvdmFsdWU9XCIyMDI2LTEyXCIvKTthc3NlcnQubWF0Y2gobm9kZXNbJyNhcHAnXS5pbm5lckhUTUwsLzxvcHRpb24gdmFsdWU9XCIyXCIgc2VsZWN0ZWQvKTtcbiBjb25zdCB2aWV3PUpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UudmFsdWVbJ2VzY2FsYXByby12aWV3LXYxJ10pO2Fzc2VydC5lcXVhbCh2aWV3Lm1vbnRoLCcyMDI2LTEyJyk7YXNzZXJ0LmVxdWFsKHZpZXcuZGVwYXJ0bWVudElkLDIpO1xuIGNoYW5nZSgnZGVwYXJ0bWVudC1zd2l0Y2gnLCcxJyk7Y2hhbmdlKCdtb250aC1jaG9pY2UnLCcyMDI2LTExJyk7XG59KTtcblxudGVzdCgnYXJyYXN0ZSBhYnJlIEZvbGdhIG91IFBsYW50w6NvIGUgc8OzIHNhbHZhIGRlcG9pcyBkYSBlc2NvbGhhJyxhc3luYygpPT57XG4gYXdhaXQgbG9hZFBhZ2UoJ2VzY2FsYXMnKTtjaGFuZ2UoJ21vbnRoLWNob2ljZScsJzIwMjYtMTInKTtjb25zdCBiZWZvcmU9c25hcHNob3QoKTtkcmFnRW1wbG95ZWUoMSwnMjAyNi0xMi0xMCcpO1xuIGFzc2VydC5tYXRjaChub2Rlc1snI292ZXJsYXknXS5pbm5lckhUTUwsL0ZvbGdhIG91IHBsYW50w6NvXFw/Lyk7YXNzZXJ0Lm1hdGNoKG5vZGVzWycjb3ZlcmxheSddLmlubmVySFRNTCwvZGF0YS1hY3Rpb249XCJjaG9vc2UtZHV0eS10dXJuXCIvKTthc3NlcnQubWF0Y2gobm9kZXNbJyNvdmVybGF5J10uaW5uZXJIVE1MLC88ZmllbGRzZXQgaWQ9XCJkcm9wLXNoaWZ0LWNob2ljZXNcIltePl0qaGlkZGVuLyk7XG4gYXNzZXJ0LmRlZXBFcXVhbChzbmFwc2hvdCgpLGJlZm9yZSk7YXdhaXQgYWN0aW9uKCdjbG9zZS1tb2RhbCcpO2Fzc2VydC5kZWVwRXF1YWwoc25hcHNob3QoKSxiZWZvcmUpO1xuIGRyYWdFbXBsb3llZSgxLCcyMDI2LTEyLTEwJyk7YXdhaXQgYWN0aW9uKCdjb25maXJtLWRheS1zdGF0dXMnLHtpZDonMScsdGFyZ2V0RGF5OicyMDI2LTEyLTEwJyxzdGF0dXM6J2ZvbGdhJ30pO1xuIGFzc2VydC5vayhzbmFwc2hvdCgpLmRheXNPZmYuc29tZShpdGVtPT5pdGVtLmVtcGxveWVlSWQ9PT0xJiZpdGVtLmRheT09PScyMDI2LTEyLTEwJykpO1xuIGFzc2VydC5kZWVwRXF1YWwoc25hcHNob3QoKS5hc3NpZ25tZW50cyxiZWZvcmUuYXNzaWdubWVudHMpO1xufSk7XG5cbnRlc3QoJ1BsYW50w6NvIHJldmVsYSBvcyB0dXJub3MgZSBncmF2YSBzb21lbnRlIGEgcGVzc29hIGUgYSBkYXRhIGVzY29saGlkYXMnLGFzeW5jKCk9PntcbiBjb25zdCBiZWZvcmU9c25hcHNob3QoKTtkcmFnRW1wbG95ZWUoMSwnMjAyNi0xMi0xMCcpO1xuIG5vZGVzWycjZHJvcC1zaGlmdC1jaG9pY2VzJ109e2hpZGRlbjp0cnVlLHF1ZXJ5U2VsZWN0b3IoKXtyZXR1cm4gbnVsbH19O1xuIGF3YWl0IGFjdGlvbignY2hvb3NlLWR1dHktdHVybicpO2Fzc2VydC5lcXVhbChub2Rlc1snI2Ryb3Atc2hpZnQtY2hvaWNlcyddLmhpZGRlbixmYWxzZSk7YXNzZXJ0LmRlZXBFcXVhbChzbmFwc2hvdCgpLGJlZm9yZSk7ZGVsZXRlIG5vZGVzWycjZHJvcC1zaGlmdC1jaG9pY2VzJ107XG4gZm9yKGNvbnN0IHNoaWZ0SWQgb2YgWzEsMiwzXSl7XG4gIGlmKHNoaWZ0SWQ+MSlkcmFnRW1wbG95ZWUoMSwnMjAyNi0xMi0xMCcpO1xuICBhd2FpdCBhY3Rpb24oJ2NvbmZpcm0tZGF5LXN0YXR1cycse2lkOicxJyx0YXJnZXREYXk6JzIwMjYtMTItMTAnLHN0YXR1czoncGxhbnRhbycsc2hpZnRJZDpTdHJpbmcoc2hpZnRJZCl9KTtcbiAgY29uc3QgYWZ0ZXI9c25hcHNob3QoKTthc3NlcnQuZXF1YWwoYWZ0ZXIuYXNzaWdubWVudHMuZmluZChpdGVtPT5pdGVtLmVtcGxveWVlSWQ9PT0xJiZpdGVtLmRheT09PScyMDI2LTEyLTEwJykuc2hpZnRJZCxzaGlmdElkKTtcbiAgYXNzZXJ0LmRlZXBFcXVhbChhZnRlci5hc3NpZ25tZW50cy5maWx0ZXIoaXRlbT0+aXRlbS5lbXBsb3llZUlkIT09MXx8aXRlbS5kYXkhPT0nMjAyNi0xMi0xMCcpLGJlZm9yZS5hc3NpZ25tZW50cyk7XG4gIGFzc2VydC5lcXVhbChub2Rlc1snI292ZXJsYXknXS5pbm5lckhUTUwsJycpO1xuIH1cbn0pO1xuXG50ZXN0KCdjbGljYXIgbm8gcGxhbnTDo28gZXhpc3RlbnRlIGFicmUgYSBlc2NvbGhhIHLDoXBpZGEgZSBwcm90ZWdlIGZvbGdhcyBhcHJvdmFkYXMnLGFzeW5jKCk9PntcbiBjb25zdCBiZWZvcmU9c25hcHNob3QoKSxhc3NpZ25lZD1iZWZvcmUuYXNzaWdubWVudHMuZmluZChpdGVtPT5pdGVtLmVtcGxveWVlSWQ9PT0xJiZpdGVtLmRheT09PScyMDI2LTEyLTEwJyk7XG4gYXdhaXQgYWN0aW9uKCdlZGl0LWFzc2lnbm1lbnQnLHtpZDpTdHJpbmcoYXNzaWduZWQuaWQpfSk7YXNzZXJ0Lm1hdGNoKG5vZGVzWycjb3ZlcmxheSddLmlubmVySFRNTCwvRm9sZ2Egb3UgcGxhbnTDo29cXD8vKTthc3NlcnQuZG9lc05vdE1hdGNoKG5vZGVzWycjb3ZlcmxheSddLmlubmVySFRNTCwvRWRpdGFyIGFsb2Nhw6fDo28vKTthc3NlcnQuZGVlcEVxdWFsKHNuYXBzaG90KCksYmVmb3JlKTthd2FpdCBhY3Rpb24oJ2Nsb3NlLW1vZGFsJyk7XG4gZHJhZ0VtcGxveWVlKDQsJzIwMjYtMTEtMTgnKTtjb25zdCBidXR0b25zPW5vZGVzWycjb3ZlcmxheSddLmlubmVySFRNTC5tYXRjaCgvPGJ1dHRvbltePl0qZGF0YS1hY3Rpb249XCJjb25maXJtLWRheS1zdGF0dXNcIltePl0qPi9nKTthc3NlcnQuZXF1YWwoYnV0dG9ucy5sZW5ndGgsNCk7YXNzZXJ0Lm9rKGJ1dHRvbnMuZXZlcnkoYnV0dG9uPT5idXR0b24uaW5jbHVkZXMoJ2Rpc2FibGVkJykpKTthd2FpdCBhY3Rpb24oJ2Nsb3NlLW1vZGFsJyk7XG59KTtcblxudGVzdCgnUERGIGFicmUgYSBwcsOpdmlhIHNlbSBiYWl4YXIgZSB1c2EgbyBtZXNtbyBjb250ZcO6ZG8gbm8gZG93bmxvYWQnLGFzeW5jKCk9PntcbiBjb25zdCBiZWZvcmU9c25hcHNob3QoKSxvbGRDcmVhdGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCxvbGRVUkw9VVJMLmNyZWF0ZU9iamVjdFVSTCxvbGRSZXZva2U9VVJMLnJldm9rZU9iamVjdFVSTCxibG9icz1bXSxkb3dubG9hZHM9W10scmV2b2tlZD1bXTtcbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50PXRhZz0+dGFnPT09J2EnP3tocmVmOicnLGRvd25sb2FkOicnLGNsaWNrKCl7ZG93bmxvYWRzLnB1c2godGhpcy5kb3dubG9hZCl9LHJlbW92ZSgpe319Om9sZENyZWF0ZSh0YWcpO1xuIFVSTC5jcmVhdGVPYmplY3RVUkw9YmxvYj0+e2Jsb2JzLnB1c2goYmxvYik7cmV0dXJuICdibG9iOnRlc3QtJytibG9icy5sZW5ndGh9O1VSTC5yZXZva2VPYmplY3RVUkw9dXJsPT5yZXZva2VkLnB1c2godXJsKTtcbiB0cnl7YXdhaXQgYWN0aW9uKCdleHBvcnQtcGRmJyk7YXNzZXJ0LmVxdWFsKGRvd25sb2Fkcy5sZW5ndGgsMCk7YXNzZXJ0Lm1hdGNoKG5vZGVzWycjb3ZlcmxheSddLmlubmVySFRNTCwvUHLDqXZpYSBkYSBlc2NhbGEgZW0gUERGLyk7YXNzZXJ0Lm1hdGNoKG5vZGVzWycjb3ZlcmxheSddLmlubmVySFRNTCwvPGlmcmFtZS8pO2F3YWl0IGFjdGlvbignZG93bmxvYWQtcGRmJyk7YXNzZXJ0LmRlZXBFcXVhbChkb3dubG9hZHMsWydFc2NhbGFQcm9fMjAyNi0xMi5wZGYnXSk7YXNzZXJ0LmVxdWFsKGF3YWl0IGJsb2JzWzBdLnRleHQoKSxhd2FpdCBibG9ic1sxXS50ZXh0KCkpO2F3YWl0IGFjdGlvbignY2xvc2UtbW9kYWwnKTthc3NlcnQuZGVlcEVxdWFsKHJldm9rZWQsWydibG9iOnRlc3QtMSddKTthc3NlcnQuZGVlcEVxdWFsKHNuYXBzaG90KCksYmVmb3JlKX1maW5hbGx5e2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQ9b2xkQ3JlYXRlO1VSTC5jcmVhdGVPYmplY3RVUkw9b2xkVVJMO1VSTC5yZXZva2VPYmplY3RVUkw9b2xkUmV2b2tlfVxufSk7XG5cbnRlc3QoJ3NpbXVsYcOnw6NvIGNvbnRpbnVhIHNlbmRvIHByw6l2aWEgZSBhcGxpY2FyIGxldmEgYW8gSFRNTCBkZSBlc2NhbGFzJyxhc3luYygpPT57XG4gYXdhaXQgbG9hZFBhZ2UoJ3NpbXVsYWNvZXMnKTtjaGFuZ2UoJ21vbnRoLWNob2ljZScsJzIwMjYtMTEnKTtjb25zdCBiZWZvcmU9c25hcHNob3QoKTtcbiBhd2FpdCBzdWJtaXQoJ3NpbXVsYXRpb24tZm9ybScse2VtcGxveWVlOicxJyxkYXRlOicyMDI2LTExLTEyJyxwcmVzZXJ2ZTonb24nfSk7YXNzZXJ0Lm1hdGNoKG5vZGVzWycjYXBwJ10uaW5uZXJIVE1MLC9BbG9jYcOnw7VlcyBwcm9wb3N0YXMvKTthc3NlcnQuZGVlcEVxdWFsKHNuYXBzaG90KCksYmVmb3JlKTtcbiBhd2FpdCBhY3Rpb24oJ2FwcGx5LXByZXZpZXcnKTthc3NlcnQuZXF1YWwobGFzdE5hdmlnYXRpb24sJy4vaW5kZXguaHRtbCcpO2F3YWl0IGxvYWRQYWdlKCdlc2NhbGFzJyk7YXNzZXJ0Lm1hdGNoKG5vZGVzWycjYXBwJ10uaW5uZXJIVE1MLC9Ob3ZlbWJybyBkZSAyMDI2Lyk7XG59KTtcblxudGVzdCgncHVibGljYcOnw6NvIGUgcG9ydGFsIGNvbnRpbnVhbSBjb21wYXJ0aWxoYW5kbyBvcyBtZXNtb3MgZGFkb3MgbG9jYWlzJyxhc3luYygpPT57XG4gYXdhaXQgYWN0aW9uKCdwdWJsaXNoJyk7YXNzZXJ0Lm9rKHNuYXBzaG90KCkucHVibGljYXRpb25zWycxOjIwMjYtMTEnXSk7YXdhaXQgYWN0aW9uKCdzd2l0Y2gtcm9sZScpO2Fzc2VydC5lcXVhbChsYXN0TmF2aWdhdGlvbiwnLi9wb3J0YWwuaHRtbCcpO1xuIGF3YWl0IGxvYWRQYWdlKCdwb3J0YWwnKTthc3NlcnQubWF0Y2gobm9kZXNbJyNhcHAnXS5pbm5lckhUTUwsL0VzY2FsYSBwdWJsaWNhZGEvKTthc3NlcnQubWF0Y2gobm9kZXNbJyNhcHAnXS5pbm5lckhUTUwsL3NlbSBhdXRlbnRpY2HDp8Ojby8pO1xuIGF3YWl0IGFjdGlvbignbmV3LXJlcXVlc3QnKTthc3NlcnQubWF0Y2gobm9kZXNbJyNvdmVybGF5J10uaW5uZXJIVE1MLC9yZXF1ZXN0LWZvcm0vKTtcbiBhd2FpdCBzdWJtaXQoJ3JlcXVlc3QtZm9ybScse3R5cGU6J2ZvbGdhJyxzdGFydDonMjAyNi0xMS0xMicsZW5kOicyMDI2LTExLTEyJyxyZWFzb246J1BlZGlkbyBkZSB0ZXN0ZSd9KTtcbiBjb25zdCByZXF1ZXN0PXNuYXBzaG90KCkucmVxdWVzdHMuYXQoLTEpO2Fzc2VydC5lcXVhbChyZXF1ZXN0LmVtcGxveWVlSWQsMSk7YXNzZXJ0LmVxdWFsKHJlcXVlc3QucmVhc29uLCdQZWRpZG8gZGUgdGVzdGUnKTtcbiBhd2FpdCBsb2FkUGFnZSgnbXktcmVxdWVzdHMnKTthc3NlcnQubWF0Y2gobm9kZXNbJyNhcHAnXS5pbm5lckhUTUwsL1BlZGlkbyBkZSB0ZXN0ZS8pO1xuIGF3YWl0IGxvYWRQYWdlKCdzb2xpY2l0YWNvZXMnKTthd2FpdCBhY3Rpb24oJ2FwcHJvdmUtcmVxdWVzdCcse2lkOlN0cmluZyhyZXF1ZXN0LmlkKX0pO2F3YWl0IHN1Ym1pdCgnZGVjaXNpb24tZm9ybScse2lkOlN0cmluZyhyZXF1ZXN0LmlkKSxzdGF0dXM6J2FwcHJvdmVkJyxub3RlOidDb25mZXJpZG8nfSk7YXNzZXJ0LmVxdWFsKHNuYXBzaG90KCkucmVxdWVzdHMuZmluZChpdGVtPT5pdGVtLmlkPT09cmVxdWVzdC5pZCkuc3RhdHVzLCdhcHByb3ZlZCcpO1xufSk7XG5cbnRlc3QoJ2NhZGFzdHJvcyBlIHJlZ3JhcyBmdW5jaW9uYW0gZW0gc2V1cyBwcsOzcHJpb3MgYXJxdWl2b3MgZGUgcMOhZ2luYScsYXN5bmMoKT0+e1xuIGF3YWl0IGxvYWRQYWdlKCdmdW5jaW9uYXJpb3MnKTthd2FpdCBhY3Rpb24oJ25ldy1lbXBsb3llZScpO2F3YWl0IHN1Ym1pdCgnZW1wbG95ZWUtZm9ybScse25hbWU6J1Blc3NvYSBkZSBUZXN0ZScsZW1haWw6J3Rlc3RlQGV4ZW1wbG8uY29tJyxyb2xlOidDb2xhYm9yYWRvcihhKScsZGVwYXJ0bWVudElkOicxJyxwcmVmZXJyZWRTaGlmdElkOicyJ30pO1xuIGFzc2VydC5vayhzbmFwc2hvdCgpLmVtcGxveWVlcy5zb21lKGl0ZW09Pml0ZW0ubmFtZT09PSdQZXNzb2EgZGUgVGVzdGUnKSk7YXNzZXJ0Lm1hdGNoKG5vZGVzWycjYXBwJ10uaW5uZXJIVE1MLC9QZXNzb2EgZGUgVGVzdGUvKTtcbiBhd2FpdCBsb2FkUGFnZSgnc2V0b3JlcycpO2F3YWl0IGFjdGlvbignbmV3LWRlcGFydG1lbnQnKTthd2FpdCBzdWJtaXQoJ2RlcGFydG1lbnQtZm9ybScse25hbWU6J1NldG9yIGRlIFRlc3RlJyxkZXNjcmlwdGlvbjonQ2FkYXN0cm8gZGUgdGVzdGUnLGNvbG9yOicjMjI1NTg4J30pO1xuIGNvbnN0IGRlcGFydG1lbnQ9c25hcHNob3QoKS5kZXBhcnRtZW50cy5hdCgtMSk7YXNzZXJ0LmVxdWFsKGRlcGFydG1lbnQubmFtZSwnU2V0b3IgZGUgVGVzdGUnKTthd2FpdCBhY3Rpb24oJ29wZW4tc2V0dGluZ3MnKTthc3NlcnQuZXF1YWwobGFzdE5hdmlnYXRpb24sJy4vY29uZmlndXJhY29lcy5odG1sJyk7XG4gYXdhaXQgbG9hZFBhZ2UoJ2NvbmZpZ3VyYWNvZXMnKTthd2FpdCBzdWJtaXQoJ3NldHRpbmdzLWZvcm0nLHttYXhXZWVrbHlIb3VyczonNDAnLG1heENvbnNlY3V0aXZlOic1JyxtaW5SZXN0OicxMicsY292ZXJhZ2VfMTonMScsY292ZXJhZ2VfMjonMCcsY292ZXJhZ2VfMzonMCd9KTthc3NlcnQuZXF1YWwoc25hcHNob3QoKS5ydWxlc1tkZXBhcnRtZW50LmlkXS5tYXhXZWVrbHlIb3Vycyw0MCk7XG59KTtcblxudGVzdCgnbWFyY2Fkb3JlcyBkZSBhdHJpYnV0b3MgY29udGludWFtIHbDoWxpZG9zIGFww7NzIG8gbmF2ZWdhZG9yIGxlciBvIEhUTUwnLGFzeW5jKCk9PntcbiBhd2FpdCBsb2FkUGFnZSgnY29uZmlndXJhY29lcycpO1xuIGNvbnN0IHtyZW5kZXJUZW1wbGF0ZX09YXdhaXQgaW1wb3J0KCcuLi9qcy9zaGFyZWQvdWkubWpzJyk7XG4gbm9kZXNbJyNwYWdlLXRlbXBsYXRlJ10uaW5uZXJIVE1MPSc8aW5wdXQge3thdGl2b319PVwiXCIgdmFsdWU9XCJ7e3ZhbG9yfX1cIj4nO1xuIGFzc2VydC5lcXVhbChyZW5kZXJUZW1wbGF0ZSh7YXRpdm86J2NoZWNrZWQnLHZhbG9yOid0ZXN0ZSd9KSwnPGlucHV0IGNoZWNrZWQgdmFsdWU9XCJ0ZXN0ZVwiPicpO1xuIGFzc2VydC5lcXVhbChyZW5kZXJUZW1wbGF0ZSh7YXRpdm86JycsdmFsb3I6J3Rlc3RlJ30pLCc8aW5wdXQgIHZhbHVlPVwidGVzdGVcIj4nKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxJQUFJLE1BQU0sV0FBVztBQUM1QixPQUFPQyxNQUFNLE1BQU0sb0JBQW9CO0FBQ3ZDLE9BQU9DLEVBQUUsTUFBTSxTQUFTO0FBQ3hCLE1BQU1DLEtBQUssR0FBQztFQUFDLE1BQU0sRUFBQztJQUFDQyxTQUFTLEVBQUM7RUFBRSxDQUFDO0VBQUMsZ0JBQWdCLEVBQUM7SUFBQ0EsU0FBUyxFQUFDO0VBQUUsQ0FBQztFQUFDLFVBQVUsRUFBQztJQUFDQSxTQUFTLEVBQUMsRUFBRTtJQUFDQyxTQUFTLEVBQUM7TUFBQ0MsR0FBR0EsQ0FBQSxFQUFFLENBQUMsQ0FBQztNQUFDQyxNQUFNQSxDQUFBLEVBQUUsQ0FBQztJQUFDO0VBQUMsQ0FBQztFQUFDLFFBQVEsRUFBQztJQUFDQyxXQUFXQSxDQUFBLEVBQUUsQ0FBQztFQUFDLENBQUM7RUFBQyxvQkFBb0IsRUFBQztJQUFDQyxXQUFXLEVBQUM7RUFBRTtBQUFDLENBQUM7QUFDN0wsSUFBSUMsUUFBUSxH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 // Confere esta etapa do funcionamento.
