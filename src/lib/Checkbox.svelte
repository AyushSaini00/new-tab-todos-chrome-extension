<script lang="ts">
  let { label, id, isChecked = false, isDisabled = false } = $props();
</script>

<div class="flex w-full justify-center">
  <label class="flex items-center gap-x-2.5 cursor-pointer">
    <input
      disabled={isDisabled}
      class="w-6 h-6"
      type="checkbox"
      bind:checked={isChecked}
      {id}
    />
    <span class={`text-4xl ${isChecked && "line-through"}`}>{label}</span>
  </label>
</div>
