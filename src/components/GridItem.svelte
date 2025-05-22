<script lang="ts">
const letter = $state("F");
interface Props {
  class?: string;
  elRef?: HTMLElement | null;
}

let { class: _class = "", elRef = $bindable() }: Props = $props();
</script>

<!-- <div class="flex items-center justify-center w-md h-md bg-base-100"> -->
<div
  bind:this={elRef}
  class={[
    "flex",
    "items-center",
    "justify-center",
    "w-md",
    "h-md",
    "bg-base-100",
    _class,
  ]}
>
  <span class="text-[10dvh] font-bold">
    {letter}
  </span>
</div>
