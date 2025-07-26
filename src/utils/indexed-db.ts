import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'auth-db';
const STORE_NAME = 'auth-store';

let dbPromise: Promise<IDBPDatabase> | null = null;

const initDB = async (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  }
  return dbPromise;
};

export const setItem = async (key: string, value: string): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, value, key);
};

export const getItem = async (key: string): Promise<string | null> => {
  const db = await initDB();
  return db.get(STORE_NAME, key);
};

export const removeItem = async (key: string): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, key);
};
