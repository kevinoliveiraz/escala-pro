import { KEY, ensure } from './core.mjs';

const prefix = KEY + '-schedule-preview-v1:';
export const previewPages = new Set(['escalas', 'simulacoes', 'relatorios']);

export function readSchedulePreview(id) {
  if (!id) return null;
  const raw = localStorage.getItem(prefix + id);
  if (!raw) return null;
  try {
    const preview = JSON.parse(raw);
    if (preview.id !== id || typeof preview.name !== 'string' || !Number.isInteger(preview.revision)) return null;
    ensure(preview.database);
    return preview;
  } catch {
    return null;
  }
}

export function listSchedulePreviews() {
  const previews = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(prefix)) continue;
    const preview = readSchedulePreview(key.slice(prefix.length));
    if (preview) previews.push({ id: preview.id, name: preview.name });
  }
  return previews.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export function createSchedulePreview(name, database) {
  name = name.trim();
  if (!name || name.length > 60) throw Error('Informe um nome de até 60 caracteres.');
  const normalizedName = name.toLocaleLowerCase('pt-BR');
  if (normalizedName === 'escala principal' || listSchedulePreviews().some(item => item.name.toLocaleLowerCase('pt-BR') === normalizedName)) {
    throw Error('Escolha um nome diferente para o preview.');
  }
  const id = crypto.randomUUID();
  const preview = { id, name, revision: 0, database: { ...database, publications: {} } };
  localStorage.setItem(prefix + id, JSON.stringify(preview));
  return id;
}

export function saveSchedulePreview(preview, database) {
  const stored = readSchedulePreview(preview.id);
  if (!stored || stored.revision !== preview.revision) {
    throw Error('O preview mudou em outra aba. Confira a versão salva antes de editar novamente.');
  }
  const next = { ...stored, revision: stored.revision + 1, database };
  localStorage.setItem(prefix + preview.id, JSON.stringify(next));
  return next;
}
