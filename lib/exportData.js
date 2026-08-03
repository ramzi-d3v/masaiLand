/*
  Real, working export — a CSV or JSON file built and downloaded entirely in
  the browser. No server, no third-party API, nothing to configure: this is
  the part of "export and sync" that needs no credentials to be genuine.

  Sync to an actual cloud drive is a different kind of feature — it needs a
  real OAuth client and a Drive API key, neither of which exist in this
  project. Rather than build a "Connect to Google Drive" button that looks
  wired up and isn't, the button for it stays visibly disabled. See
  DataExportMenu's driveDisabled state for where that line is drawn.
*/

function csvCell(value) {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows, fields) {
  const header = fields.map((f) => csvCell(f.label)).join(",");
  const body = rows
    .map((row) => fields.map((f) => csvCell(f.value(row))).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename, rows, fields) {
  download(filename, toCsv(rows, fields), "text/csv;charset=utf-8");
}

export function downloadJson(filename, rows) {
  download(filename, JSON.stringify(rows, null, 2), "application/json");
}

export const todayStamp = () => new Date().toISOString().slice(0, 10);
