import { getDbState, saveDbState } from './dbStore';
import * as XLSX from 'xlsx';

function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (ext === '.csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        // Count rows (subtract 1 for header)
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const rowCount = Math.max(0, lines.length - 1);
        resolve({ content: text, contentType: 'text', rowCount });
      };
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      // XLSX / XLS → read as base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        // Convert ArrayBuffer to base64
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        // Parse to count rows
        let rowCount = 0;
        try {
          const workbook = XLSX.read(bytes, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(firstSheet);
          rowCount = json.length;
        } catch {
          rowCount = 0;
        }

        resolve({ content: base64, contentType: 'base64', rowCount });
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    }
  });
}

export const uploadService = {
  /**
   * Upload a file — reads its raw content and stores it for later parsing.
   */
  uploadFile: async (file, onProgress) => {
    // Read real file content
    const { content, contentType, rowCount } = await readFileContent(file);

    // Simulate progress for UI feedback
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      if (onProgress) onProgress(i);
    }

    const dbState = getDbState();
    const newFile = {
      id: `f_${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.name.substring(file.name.lastIndexOf('.')).toUpperCase(),
      uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Ready',
      recordsDiscovered: rowCount,
      rawContent: content,
      rawContentType: contentType,
    };

    // Save newly uploaded file record
    const updatedFiles = [newFile, ...dbState.uploadedFiles];
    saveDbState({
      ...dbState,
      uploadedFiles: updatedFiles,
    });

    return {
      success: true,
      file: newFile,
    };
  },

  getUploadedFiles: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const dbState = getDbState();
    return dbState.uploadedFiles || [];
  },

  removeUploadedFile: async (id) => {
    const dbState = getDbState();
    const updatedFiles = dbState.uploadedFiles.filter(f => f.id !== id);
    saveDbState({
      ...dbState,
      uploadedFiles: updatedFiles,
    });
    return { success: true };
  },
};
