export function normalizeTextForStorage(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\uFFFD+/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
}

export function hasCorruptedUnicode(value: string): boolean {
  return value.includes('\uFFFD')
}
