<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import GridItem from "./components/GridItem.svelte";
  import settings from "./models/Settings.svelte";
  import gameState from "./models/GameState.svelte";
  import gameLogic from "./logic/GameLogic.svelte";

  onMount(() => {
    window.addEventListener("keydown", keyPressed);
  });
  onDestroy(() => {
    window.removeEventListener("keydown", keyPressed);
  });

  let visualStiumulusButton: HTMLButtonElement;
  let auditoryStiumulusButton: HTMLButtonElement;

  function keyPressed(event: KeyboardEvent) {
    if (
      event.key.toUpperCase() ===
      settings.visualStimulusKeyBinding.toUpperCase()
    ) {
      event.preventDefault();
      visualStiumulusButton.click();
    } else if (
      event.key.toUpperCase() ===
      settings.auditoryStimulusKeyBinding.toUpperCase()
    ) {
      event.preventDefault();
      auditoryStiumulusButton.click();
    }
  }

  function visualStimulus() {
    visualStiumulusButton.classList.add("bg-green-500", "animate-ping");
    console.log("Visual Stimulus");
    setTimeout(() => {
      visualStiumulusButton.classList.remove("bg-green-500", "animate-ping");
    }, 1000);
  }
  function auditoryStimulus() {
    auditoryStiumulusButton.classList.add("bg-green-500", "animate-ping");
    console.log("Auditory Stimulus");
    setTimeout(() => {
      auditoryStiumulusButton.classList.remove("bg-green-500", "animate-ping");
    }, 1000);
  }

  gameLogic.startGame();
</script>

<main
  class="flex flex-col items-center justify-center min-h-screen h-screen bg-base-200 p-4"
>
  <h1 class="text-3xl font-bold mb-4">Dual N back</h1>
  <div class="grid grid-cols-3 grid-rows-3 gap-4 h-9/10">
    {#each { length: 9 }, item}
      {#if item == 4}
        <div class="flex flex-col items-center justify-center gap-3 text-3xl">
          <span>N = {gameState.nBackLevel}</span>
          <span>{gameState.currentTrial}/{gameState.trialNumber}</span>
          <button class="btn btn-primary text-3xl">
            {gameState.isGameStarted ? "Stop" : "Start"}
          </button>
        </div>
      {:else}
        <GridItem />
      {/if}
    {/each}
  </div>
  <div class="flex justify-center mt-4 gap-4 h-1/10">
    <button
      class="btn btn-primary w-md h-auto text-3xl"
      bind:this={visualStiumulusButton}
      onclick={() => {
        visualStimulus();
      }}
    >
      Visual Stimulus ({settings.visualStimulusKeyBinding.toUpperCase()})</button
    >
    <button
      class="btn btn-primary active:bg-green-500 w-md h-auto text-3xl"
      bind:this={auditoryStiumulusButton}
      onclick={() => {
        auditoryStimulus();
      }}
    >
      Auditory Stimulus ({settings.auditoryStimulusKeyBinding.toUpperCase()})</button
    >
  </div>
</main>
