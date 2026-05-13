import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Build a multi-sheet XLSX workbook and download it in the browser.
 * @param {Array<{ sheetName: string, rows: object[] }>} sheets
 * @param {string} filename — should end with .xlsx
 */
export function downloadExcelWorkbook(sheets, filename) {
  if (!sheets?.length) {
    throw new Error("No sheet data to export.");
  }

  const wb = XLSX.utils.book_new();

  sheets.forEach(({ sheetName, rows }) => {
    const safeName = String(sheetName || "Sheet").slice(0, 31);
    const ws = XLSX.utils.json_to_sheet(Array.isArray(rows) ? rows : []);
    XLSX.utils.book_append_sheet(wb, ws, safeName);
  });

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const name = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  saveAs(blob, name);
}
