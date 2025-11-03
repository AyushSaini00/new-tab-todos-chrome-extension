<script lang="ts">
  import { onMount } from "svelte";
  import type { StorageChanges, Todo } from "./types";
  import { getItemFromChromeStorage, listenToStorageChanges } from "./lib/chrome";
  import Greetings from "./components/Greetings.svelte";
  import SettingsIcon from "./components/icons/SettingsIcon.svelte";
  import TodoList from "./components/TodoList.svelte";
  import UserSettingsModal from "./components/modals/UserSettingsModal.svelte";
  import { NAMESPACE_HIDE_TODOS } from "./constants";

  // to show user settings modal, should have made this a custom hook but since there is only going to one modal for now so it's fine
  let showModal = $state(false);

  let userNameValue = $state(null);
  let todos = $state<Todo[]>([]);

  let hideTodos = $state(false);

  onMount(() => {
    getItemFromChromeStorage(NAMESPACE_HIDE_TODOS, (value) => {
      if (typeof value === "boolean") {
        hideTodos = value;
      }
    });

    const listener = (changes: StorageChanges, namespace: string) => {
      if (namespace === "local" && NAMESPACE_HIDE_TODOS in changes) {
        hideTodos = changes[NAMESPACE_HIDE_TODOS].newValue;
      }
    };
    const cleanup = listenToStorageChanges(listener);

    return () => {
      cleanup();
    };
  });
</script>

<main>
  <Greetings bind:hideTodos />
  <TodoList bind:todos {hideTodos} />
</main>
<button class="cursor-pointer flex w-max" onclick={() => (showModal = true)}>
  <SettingsIcon />
</button>

<UserSettingsModal bind:showModal {userNameValue} {todos} />
