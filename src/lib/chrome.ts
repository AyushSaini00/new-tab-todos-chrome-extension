const warningMessage = "Chrome storage API isn't available";

export async function saveItemOnChromeStorage(
  key: string,
  value: any,
  callbackFn?: (props?: any) => void
) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    try {
      if (callbackFn) callbackFn(value);
      await chrome.storage.local.set({ [key]: value });
    } catch (err) {
      console.error("Error saving item to chrome storage: ", err);
    }
  } else {
    if (callbackFn) callbackFn(value);
    console.warn(warningMessage);
  }
}

export async function getItemFromChromeStorage(
  key: string,
  callbackFn?: (props?: any) => void,
  value?: any
) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    try {
      const result = await chrome.storage.local.get(key);

      if (result[key] !== undefined) {
        callbackFn?.(result[key]);
      }
    } catch (err) {
      console.error("Error loading data from chrome storage", err);
    }
  } else {
    if (value && typeof callbackFn !== "undefined") callbackFn(value);
    console.warn(warningMessage);
  }
}

export async function deleteItemFromChromeStorage(key: string) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    try {
      await chrome.storage.local.remove(key);
    } catch (err) {
      console.error("Error removing data from chrome storage", err);
    }
  } else {
    console.warn(warningMessage);
  }
}
