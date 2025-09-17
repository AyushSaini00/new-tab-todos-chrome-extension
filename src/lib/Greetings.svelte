<script lang="ts">
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import EditableText from "./EditableText.svelte";

  let now = $state(new Date());
  onMount(() => {
    const timerId = setInterval(() => {
      now = new Date();
    }, 1000);

    // clean up the interval after component is unmounted
    return () => {
      clearInterval(timerId);
    };
  });
  let formattedTime = $derived(format(now, "hh:mm a"));

  const getGreeting = () => {
    const hour = now.getHours();
    let message;

    if (hour >= 5 && hour < 12) {
      message = "Good morning";
    } else if (hour >= 12 && hour < 18) {
      message = "Good afternoon";
    } else if (hour >= 18 && hour < 22) {
      message = "Good evening";
    } else {
      message = "Good night";
    }

    return message;
  };
  let name = $state("add your name");
</script>

<div class="flex justify-center text-3xl font-semibold mb-5 current-time">
  {formattedTime}
</div>
<div class="flex justify-center text-4xl greeting-message">
  <span>{getGreeting()},&nbsp;</span>
  <EditableText text={name} />
</div>
