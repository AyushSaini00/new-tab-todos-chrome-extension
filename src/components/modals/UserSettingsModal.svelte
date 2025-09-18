<script lang="ts">
  import { NAMESPACE_USER_NAME } from "../../constants";
  import { saveItemOnChromeStorage } from "../../lib/chrome";
  import { userNameValueOnChromeStorage } from "../../lib/store";
  import CloseIcon from "../icons/CloseIcon.svelte";

  let {
    showModal = $bindable(),
    userNameValue,
  }: { showModal: boolean; userNameValue: string | null } = $props();

  let dialog = $state<HTMLDialogElement>();

  $effect(() => {
    if (showModal && dialog) dialog.showModal();
  });

  const handleFormSubmit = (evt: SubmitEvent) => {
    evt.preventDefault();
    saveItemOnChromeStorage(
      NAMESPACE_USER_NAME,
      userNameValue,
      userNameValueOnChromeStorage.set,
    );
    dialog?.close();
  };

  const handleClearAllTodos = () => {};
</script>

<dialog
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={(e) => {
    if (e.target === dialog) dialog.close();
  }}
  class="dialog rounded-xl min-w-[380px] min-h-64"
>
  <form class="flex flex-col justify-between" onsubmit={handleFormSubmit}>
    <div>
      <div class="flex justify-between mb-4 border-b border-gray-500 pt-4 px-4 pb-2">
        <div class="font-semibold">user settings</div>
        <button
          onclick={() => {
            if (dialog) dialog.close();
          }}
        >
          <CloseIcon />
        </button>
      </div>
      <div class="flex flex-col px-4 gap-y-4">
        <label>
          tell us your name?
          <input
            name="user-name"
            type="text"
            bind:value={userNameValue}
            class="border border-gray-500 py-0.5 px-1.5 w-full rounded"
            placeholder="name"
          />
        </label>
        <lable>
          clear all todos?
          <button
            onclick={handleClearAllTodos}
            class="flex justify-center py-0.5 px-1.5 rounded bg-red-500 text-white"
            >yes</button
          >
        </lable>
      </div>
    </div>
    <div class="flex justify-end gap-x-2 mt-4 px-4 pb-4 pt-2 border-t border-gray-500">
      <button
        onclick={() => {
          if (dialog) dialog.close();
        }}
        class="flex justify-center py-1 px-4 rounded border border-gray-500"
        >cancel</button
      >
      <button class="flex justify-center py-1 px-4 rounded bg-black text-white"
        >save</button
      >
    </div>
  </form>
</dialog>

<style>
  .dialog {
    top: calc(50%);
    left: calc(50%);
    transform: translate(-50%, -50%);
  }
  form {
    min-height: inherit;
  }
  button {
    cursor: pointer;
  }
</style>
