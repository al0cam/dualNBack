<script lang="ts">
import { onDestroy, onMount } from "svelte";
import SettingsIcon from "./assets/icons/SettingsIcon.svelte";
import GridItem from "./components/GridItem.svelte";
import SettingsDialog from "./components/SettingsDialog.svelte";
import gameLogic from "./logic/GameLogic.svelte";
import settings from "./models/Settings.svelte";

onMount(() => {
  window.addEventListener("keydown", keyPressed);

  // Load theme from localStorage
  settings.theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", settings.theme);
  settingsDialog?.showModal();
});
onDestroy(() => {
  window.removeEventListener("keydown", keyPressed);
});

let settingsDialog: HTMLDialogElement | undefined = $state();
let visualStiumulusButton: HTMLButtonElement;
let auditoryStiumulusButton: HTMLButtonElement;
const gridItems = $state(Array(9).fill(null));

function keyPressed(event: KeyboardEvent) {
  if (
    event.key.toUpperCase() === settings.visualStimulusKeyBinding.toUpperCase()
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

function visualStimulus(): void {
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

function startStop() {
  gameLogic.isGameStarted = !gameLogic.isGameStarted;
  if (gameLogic.isGameStarted) {
    gameLogic.startGame(gridItems);
  } else {
    gameLogic.stopGame(gridItems);
  }
}
</script>

<main
  class="flex flex-col items-center justify-center min-h-screen h-screen bg-base-200 p-4"
>
  <h1 class="text-3xl text-base-content font-bold mb-4">Dual N back</h1>
  <div class="grid grid-cols-3 grid-rows-3 gap-4 h-9/10">
    {#each { length: 9 }, item}
      {#if item == 4}
        <div
          bind:this={gridItems[4]}
          class="flex flex-col items-center justify-center gap-3 text-3xl text-base-content"
        >
          <span>N = {gameLogic.nBackLevel}</span>
          <span>{gameLogic.currentSet}/{gameLogic.setNumber}</span>
          <button class="btn btn-primary text-3xl" onclick={() => startStop()}>
            {gameLogic.isGameStarted ? "Stop" : "Start"}
          </button>
        </div>
      {:else}
        <GridItem bind:elRef={gridItems[item]} />
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
      Visual Stimulus ({settings.visualStimulusKeyBinding.toUpperCase()})
    </button>
    <button
      class="btn btn-primary active:bg-green-500 w-md h-auto text-3xl"
      bind:this={auditoryStiumulusButton}
      onclick={() => {
        auditoryStimulus();
      }}
    >
      Auditory Stimulus ({settings.auditoryStimulusKeyBinding.toUpperCase()})
    </button>
  </div>

  <button
    class="btn btn-primary fixed bottom-5 right-5 bg-primary hover:bg-primary/75 w-24 h-24 rounded-full"
    onclick={() => {
      settingsDialog?.showModal();
    }}
  >
    <SettingsIcon class="fill-primary-content p-1" />
  </button>

  <SettingsDialog bind:settingsDialog />
</main>
