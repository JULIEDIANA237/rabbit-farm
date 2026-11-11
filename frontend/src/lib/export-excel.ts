import { formatDate } from './format';

export type ExcelCell = string | number | null;
export interface ExcelSheet {
  name: string;
  rows: ExcelCell[][];
  widths?: number[];
}

/** Crée et télécharge un classeur .xlsx (une feuille par tableau). */
export async function downloadExcel(fileName: string, sheets: ExcelSheet[]) {
  const { default: writeXlsxFile } = await import('write-excel-file/browser');
  await writeXlsxFile(
    sheets.map((sheet) => ({
      sheet: sheet.name.slice(0, 31),
      data: sheet.rows.map((row, index) =>
        row.map((value) => (index === 0 ? { value: value ?? '', fontWeight: 'bold' as const } : value)),
      ),
      columns: (sheet.widths ?? sheet.rows[0]?.map(() => 18) ?? []).map((width) => ({ width })),
      stickyRowsCount: 1,
    })),
  ).toFile(fileName);
}

export const excelDate = (value?: string | null) => (value ? formatDate(value) : '');
