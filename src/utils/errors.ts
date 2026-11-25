export function friendlyError(error: unknown): string {
  const message = typeof error === 'object' && error !== null && 'message' in error ? String((error as { message: unknown }).message) : String(error);
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (/network request failed|failed to fetch/i.test(message)) return 'Sem conexão com a internet.';
  return message;
}
