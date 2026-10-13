// Spreadsheet apps run cells that start with = + - @ as formulas. Prefix such
// text with a quote so a description like =HYPERLINK(...) stays plain text.
const csvCell = (value) => {
  let text = String(value ?? "");
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
};

const toCSV = (rows, columns) => {
  const header = columns.map((c) => c.label).join(",");
  const lines = rows.map((row) => columns.map((c) => csvCell(row[c.key])).join(","));
  return [header, ...lines].join("\n");
};

const DownloadButton = ({ data, columns, filename }) => {
  const handleDownload = () => {
    const csv = toCSV(data, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="ghost-action download-btn" onClick={handleDownload} disabled={data.length === 0}>
      ⬇ Download CSV
    </button>
  );
};

export default DownloadButton;
