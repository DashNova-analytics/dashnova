import Papa from "papaparse";

export function parseCsv(contents) {
  return new Promise((resolve, reject) => {
    Papa.parse(contents, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: reject,
    });
  });
}

