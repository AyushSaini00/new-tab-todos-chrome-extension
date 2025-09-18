<script lang="ts">
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import { getItemFromChromeStorage } from "../lib/chrome";
  import { userNameValueOnChromeStorage } from "../lib/store";
  import { NAMESPACE_USER_NAME } from "../constants";

  let now = $state(new Date());
  onMount(() => {
    const timerId = setInterval(() => {
      now = new Date();
    }, 1000);

    getItemFromChromeStorage(NAMESPACE_USER_NAME, userNameValueOnChromeStorage.set);

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
</script>

<div class="flex justify-center text-3xl font-semibold mb-5 current-time">
  {formattedTime}
</div>
<div class="flex justify-center text-4xl greeting-message">
  <span>{getGreeting()}</span>
  {#if $userNameValueOnChromeStorage}
    , {$userNameValueOnChromeStorage}
  {/if}
</div>
