<script lang="ts">
  import DarkIcon from "../assets/icons/DarkIcon.svelte";
  import LightIcon from "../assets/icons/LightIcon.svelte";
  import gameLogic from "../logic/GameLogic.svelte";
  import settings from "../models/Settings.svelte";

  let { settingsDialog = $bindable() } = $props();

  $effect(() => {
    const settingsToSave = {
      stimuliDuration: gameLogic.stimuliDuration,
      pauseBetweenStimuli: gameLogic.pauseBetweenStimuli,
      nBackLevel: gameLogic.nBackLevel,
      currentSet: gameLogic.currentSet,
      setNumber: gameLogic.setNumber,
      trialNumber: gameLogic.trialNumber,
      matches: gameLogic.matches,
      randomness: gameLogic.randomness,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("gameSettings", JSON.stringify(settingsToSave));
      console.log("Game settings saved by Svelte effect:", settingsToSave);
    }
  });

  $effect(() => {
    const settingsToSave = {
      theme: settings.theme,
      visualStimulusKeyBinding: settings.visualStimulusKeyBinding,
      auditoryStimulusKeyBinding: settings.auditoryStimulusKeyBinding,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("appSettings", JSON.stringify(settingsToSave));
      console.log("App settings saved by Svelte effect:", settingsToSave);
    }
  });

  $effect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
  });
</script>

<dialog
  bind:this={settingsDialog}
  class="w-lg h-md absolute inset-auto bg-secondary"
  onclick={(e) => {
    if (e.target === settingsDialog) {
      settingsDialog.close();
    }
  }}
>
  <div class="flex flex-col p-4">
    <h1 class="text-3xl">Settings</h1>

    <div class="flex flex-col gap-2 mt-4">
      <div class="flex items-center gap-4">
        <h1 class="text-xl">Theme:</h1>

        <button
          onclick={() => settings.toggleTheme()}
          aria-label="Toggle theme"
          class="w-24 h-12 flex items-center p-1 bg-base-300 rounded-full relative transition-colors duration-300"
        >
          <div class="absolute left-1 w-8 h-8">
            <LightIcon class="w-full h-full fill-primary opacity-60" />
          </div>
          <div class="absolute right-1 w-8 h-8">
            <DarkIcon class="w-full h-full fill-primary opacity-60" />
          </div>

          <div
            class={[
              "w-11 h-11 rounded-full bg-primary transform transition-transform duration-300",
              settings.theme === "dracula"
                ? "translate-x-full"
                : "translate-x-0",
            ]}
          ></div>
        </button>
      </div>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Visual Stimulus Key Binding:</span>
        <input
          type="text"
          bind:value={settings.visualStimulusKeyBinding}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Auditory Stimulus Key Binding:</span>
        <input
          type="text"
          bind:value={settings.auditoryStimulusKeyBinding}
          class="input input-bordered w-24"
        />
      </label>

      <h1 class="text-xl mt-4 pt-3 border-t">Game Logic Settings:</h1>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Stimuli duration (ms):</span>
        <input
          type="number"
          bind:value={gameLogic.stimuliDuration}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Pause between stimuli (ms):</span>
        <input
          type="number"
          bind:value={gameLogic.pauseBetweenStimuli}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">N-Back Level:</span>
        <input
          type="number"
          bind:value={gameLogic.nBackLevel}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Current Set:</span>
        <input
          type="number"
          bind:value={gameLogic.currentSet}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Total Sets:</span>
        <input
          type="number"
          bind:value={gameLogic.setNumber}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Trial Number:</span>
        <input
          type="number"
          bind:value={gameLogic.trialNumber}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Matches:</span>
        <input
          type="number"
          bind:value={gameLogic.matches}
          class="input input-bordered w-24"
        />
      </label>

      <label class="flex justify-between items-center text-lg">
        <span class="w-60">Randomness (0-1):</span>
        <input
          type="number"
          step="0.01"
          bind:value={gameLogic.randomness}
          class="input input-bordered w-24"
        />
      </label>
    </div>
  </div>
</dialog>
