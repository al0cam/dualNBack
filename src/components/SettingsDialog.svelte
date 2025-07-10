<script lang="ts">
import DarkIcon from "../assets/DarkIcon.svelte";
import LightIcon from "../assets/LightIcon.svelte";
import settings from "../models/Settings.svelte";

let { settingsDialog = $bindable() } = $props();
</script>

<dialog
  bind:this={settingsDialog}
  class="w-md h-md absolute inset-auto bg-secondary"
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

      <label class="text-lg">
        Visual Stimulus Key Binding:
        <input
          type="text"
          bind:value={settings.visualStimulusKeyBinding}
          class="input input-bordered w-full"
        />
      </label>
      <label class="text-lg">
        Auditory Stimulus Key Binding:
        <input
          type="text"
          bind:value={settings.auditoryStimulusKeyBinding}
          class="input input-bordered w-full"
        />
      </label>
    </div>
  </div>
</dialog>
