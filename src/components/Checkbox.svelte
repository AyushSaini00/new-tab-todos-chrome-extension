<script lang="ts">
  let { children, id, isChecked = false, isDisabled = false, handleOnChange } = $props();
</script>

<div class="flex w-full justify-start items-center gap-x-2.5">
  <label class="flex">
    <input
      disabled={isDisabled}
      class="w-6 h-6"
      type="checkbox"
      bind:checked={isChecked}
      onchange={handleOnChange}
      {id}
    />
  </label>
  <span class={`cursor-pointer text-4xl ${isChecked && "line-through"}`}>
    {@render children()}
  </span>
</div>
