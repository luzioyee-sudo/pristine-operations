// @ts-nocheck
// IndexedDB storage for full fidelity PDF binaries (ensuring large PDFs with pictures/tables/designs are never lost or corrupted)

const DB_NAME = 'lingoflow_pdf_store';
const STORE_NAME = 'pdf_binaries';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryCache = new Map<string, string | ArrayBuffer>();

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function savePdfBinary(docId: string, data: string | ArrayBuffer | Uint8Array): Promise<void> {
  if (!docId || !data) return;

  let payload: any = data;
  if (data instanceof ArrayBuffer) {
    if (data.byteLength === 0) {
      console.warn('Attempted to save detached ArrayBuffer to IndexedDB');
      return;
    }
    payload = data.slice(0);
  } else if (data instanceof Uint8Array) {
    if (data.buffer.byteLength === 0) {
      console.warn('Attempted to save detached Uint8Array to IndexedDB');
      return;
    }
    payload = data.slice();
  }

  // Cache in memory
  memoryCache.set(docId, payload);

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(payload, docId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB, fallback to memory only:', err);
  }
}

export async function getPdfBinary(docId: string): Promise<string | ArrayBuffer | Uint8Array | null> {
  if (!docId) return null;

  if (memoryCache.has(docId)) {
    return memoryCache.get(docId)!;
  }

  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(docId);
      req.onsuccess = () => {
        const res = req.result || null;
        if (res) {
          memoryCache.set(docId, res);
        }
        resolve(res);
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Could not get from IndexedDB:', err);
    return null;
  }
}

export async function deletePdfBinary(docId: string): Promise<void> {
  if (!docId) return;
  memoryCache.delete(docId);
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(docId);
  } catch (err) {
    console.warn('Could not delete from IndexedDB:', err);
  }
}
