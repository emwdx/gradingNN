const dbName = "GradingDB";
const storeName = "QuizData";

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = (event) => reject("Error opening IndexedDB");
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: "id" });
    };
  });
};

export const saveData = async (data) => {
  const db = await openDB();
  const tx = db.transaction([storeName], "readwrite");
  const store = tx.objectStore(storeName);
  store.add(data);
  return tx.complete;
};

export const fetchData = async () => {
  const db = await openDB();
  const tx = db.transaction([storeName], "readonly");
  const store = tx.objectStore(storeName);
  return store.getAll();
};
