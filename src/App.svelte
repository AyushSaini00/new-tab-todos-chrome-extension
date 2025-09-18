<script lang="ts">
  import Greetings from "./components/Greetings.svelte";
  import SettingsIcon from "./components/icons/SettingsIcon.svelte";
  import TodoList from "./components/TodoList.svelte";
  import UserSettingsModal from "./components/modals/UserSettingsModal.svelte";

  // to show user settings modal, should have made this a custom hook but since there is only going to one modal for now so it's fine
  let showModal = $state(false);

  let userNameValue = $state(null);
</script>

<main>
  <Greetings />
  <TodoList />
</main>
<button class="cursor-pointer flex w-max" onclick={() => (showModal = true)}>
  <SettingsIcon />
</button>

<UserSettingsModal bind:showModal {userNameValue} />
