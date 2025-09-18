<script lang="ts">
  type Props = {
    text: string;
    placeholder: string;
    isDisabled?: boolean;
    handleOnSave?: (newText: string) => void;
    autofocus?: boolean;
    defaultEditing?: boolean;
  };

  let {
    text,
    placeholder,
    isDisabled = false,
    handleOnSave,
    autofocus = false,
    defaultEditing = false,
  }: Props = $props();
  let editing = $derived(defaultEditing);
  let inputValue = $derived(text);

  const handleEditText = () => {
    editing = true;
    inputValue = text;
  };

  function handleBlur() {
    text = inputValue.trim() || text;
    editing = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      const value = inputValue.trim();
      if (value && typeof handleOnSave !== "undefined") {
        handleOnSave(value);
        inputValue = "";
        editing = false;
      } else {
        handleBlur();
      }
    } else if (e.key === "Escape") {
      editing = false;
    }
  }
</script>

{#if editing}
  <input
    id={`edit-${text}-input`}
    bind:value={inputValue}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    disabled={isDisabled}
    {placeholder}
    {autofocus}
  />
{:else}
  <span
    ondblclick={handleEditText}
    class="cursor-pointer hover:underline"
    role="button"
    tabindex="0">{text || "double click to add"}</span
  >
{/if}
