import { writable } from "svelte/store";

export const userNameValueOnChromeStorage = writable(null); // initial value for userName

export const userTodosOnChromeStorage = writable([]); // initial value for user todos
