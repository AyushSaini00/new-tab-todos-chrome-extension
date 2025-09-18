<script lang="ts">
  import Greetings from "./components/Greetings.svelte";
  import SettingsIcon from "./components/icons/SettingsIcon.svelte";
  import TodoList from "./components/TodoList.svelte";
  import UserSettingsModal from "./components/modals/UserSettingsModal.svelte";
  import type { Todo } from "./types";

  // to show user settings modal, should have made this a custom hook but since there is only going to one modal for now so it's fine
  let showModal = $state(false);

  let userNameValue = $state(null);
  let todos = $state<Todo[]>([]);
</script>

<main>
  <Greetings />
  <TodoList {todos} />
</main>
<button class="cursor-pointer flex w-max" onclick={() => (showModal = true)}>
  <SettingsIcon />
</button>

<UserSettingsModal bind:showModal {userNameValue} {todos} />
