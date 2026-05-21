import * as XLSX from "xlsx";

export function exportToXlsx(
  rows: readonly Record<string, unknown>[] | readonly unknown[],
  filename: string,
  sheetName = "Sheet1",
) {
  const ws = XLSX.utils.json_to_sheet(rows as Record<string, unknown>[]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  const stamp = new Date().toISOString().slice(0, 10);
  const name = filename.endsWith(".xlsx") ? filename : `${filename}-${stamp}.xlsx`;
  XLSX.writeFile(wb, name);
}