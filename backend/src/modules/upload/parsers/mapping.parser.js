export function mapUploadRows(rows, schema) {
  return rows.map((row) => {
    const mapped = {};
    for (const [target, source] of Object.entries(schema)) {
      mapped[target] = row[source];
    }
    return mapped;
  });
}

