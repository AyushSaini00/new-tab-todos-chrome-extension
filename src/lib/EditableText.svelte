<script lang="ts">
  type Props = {
    text: string;
    isDisabled?: boolean;
    handleOnSave?: (newText: string) => void;
  };

  let { text, isDisabled = false, handleOnSave }: Props = $props();
  let editing = $state(false);
  let inputValue = $derived(text);

  let inputElement: HTMLInputElement | null = $state(null);

  const handleEditText = () => {
    editing = true;
    inputValue = text;
    // Focus input after next tick
    setTimeout(() => {
      inputElement?.focus();
    }, 0);
  };

  function handleBlur() {
    text = inputValue.trim() || text;
    editing = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      const value = inputValue.trim();

      if (value) {
        handleOnSave?.(value);
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
    bind:this={inputElement}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    disabled={isDisabled}
  />
{:else}
  <span
    ondblclick={handleEditText}
    class="underline cursor-pointer"
    role="button"
    tabindex="0">{text}</span
  >
{/if}
