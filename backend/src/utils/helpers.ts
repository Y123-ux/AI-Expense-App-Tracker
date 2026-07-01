export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { start, end };
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  return getMonthRange(now.getFullYear(), now.getMonth() + 1);
}
