const toCSV = (rows, columns) => {
  const header = columns.map((c) => c.label).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(",")
  );
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