import { format } from 'date-fns';
import { KeyboardEventHandler } from 'react';

/**
 * Format a number (can be a string) with thousands separator
 */
export function formatCurrency(
  amount: number | string,
  prefix = '$ ',
  digits = 0
) {
  const val = typeof amount == 'string' ? parseFloat(amount) : amount;
  return (
    prefix +
    val.toLocaleString('en-NZ', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  );
}

// this is the date_fns.format() string required for standard HTML datetime inputs
export const DATE_TIME_INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

/**
 * A convenient wrapper for the date_fns.format() function which takes a string and has a default format
 */
export function formatDateTime(
  date: string | Date,
  formatStr = 'HH:mm dd/MM/yyyy'
) {
  return format(typeof date == 'string' ? new Date(date) : date, formatStr);
}

/**
 * Prevent inserting non-numeric characters in input fields
 * (using type="number" still allows +-e), and pattern="[0-9]*" is often ignored
 */
export const onlyAllowDigits: KeyboardEventHandler = (e) => {
  // if the key non-printable, let it through (Enter, Delete, Left, etc)
  if (e.key.length > 1) {
    return;
  }

  // if the key is '-' (minus), allow it at the start and only if the input doesn't have 'min' attribute < 0
  if (e.key == '-') {
    const target = e.target as HTMLInputElement;
    // prevent '-' not at start of number
    if (target.value != '') {
      e.preventDefault();
      return;
    }

    // allow if no minimum, or -ve minimum
    if (!target.min || parseInt(target.min) < 0) {
      return;
    }
  }

  // otherwise must be a digit
  const re = /[0-9]/;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * *************** CSV Utils ************************
 */

// defining the parameters like this gives helpful type hints in the code where we're preparing the data
export type CSVRow<T extends readonly string[]> = Partial<
  Record<T[number], string | number | null | undefined>
>;
const lineDelimiter = '\r\n';
const colDelimiter = ',';

// Add BOM to start of text, to indicate to reader that content is in UTF-8 encoding.
export const addBom = (content: string) => {
  return '\ufeff' + content;
};

export const generateCSV = <T extends readonly string[]>(
  columns: T,
  rows: CSVRow<T>[]
) => {
  // generate a row using the columns array, replacing each header with the matching value from the row object
  const mappedRows = rows.map((row) =>
    columns.map((c) => row[c as T[number]] || '')
  );
  return arraysToCSV([columns as unknown as string[], ...mappedRows]);
};

const arraysToCSV = (rows: (string | number | null | undefined)[][]) => {
  return rows
    .map((row) => row.map(quoteCSVCol).join(colDelimiter))
    .join(lineDelimiter);
};

const quoteCSVCol = (col: string | number | null | undefined) => {
  // if a column contains , or " then it needs to be quoted and " replaced with ""
  const str = (col && col.toString()) || '';
  return /[,"]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const saveFile = (
  blobOrString: Blob | string,
  filename: string,
  mimeType: string
) => {
  const blob = new Blob([blobOrString], { type: mimeType });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
};
