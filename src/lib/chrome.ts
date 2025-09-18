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
    console.warn("Chrome storage API isn't available");
  }

  // chrome.storage.local.set({ [key]: value }, function () {
  //   if (chrome.runtime.lastError) {
  //     console.error("Error saving item:", chrome.runtime.lastError);
  //   } else {
  //     console.log("Item saved successfully:", key, value);
  //   }
  // });
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
        // userNameValueOnChromeStorage.set(result[key]);
      }
    } catch (err) {
      console.error("Error loading data from chrome storage", err);
    }
  } else {
    if (value && typeof callbackFn !== "undefined") callbackFn(value);
    console.warn("Chrome storage API isn't available");
  }
}

export function deleteItemFromChromeStorage(key: string) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    try {
    } catch (err) {}
  } else {
    console.warn("Chrome storage API isn't available");
  }

  chrome.storage.local.remove(key, function () {
    if (chrome.runtime.lastError) {
      console.error("Error deleting item:", chrome.runtime.lastError);
    } else {
      console.log("Item deleted successfully:", key);
    }
  });
}
