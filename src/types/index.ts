export type Todo = {
  id: string;
  item: string;
  completed: boolean;
};

export type StorageChanges = {
  [key: string]: chrome.storage.StorageChange;
};
