class Settings {
  private static instance: Settings;

  //General settings
  theme: string = $state("dracula");
  visualStimulusKeyBinding: string = $state("a");
  auditoryStimulusKeyBinding: string = $state("l");

  private constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    if (typeof window !== "undefined") {
      console.log("Loading app settings from localStorage");
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          if (parsedSettings.theme !== undefined) {
            this.theme = parsedSettings.theme;
            console.log("Theme loaded from settings:", this.theme);
          }

          if (parsedSettings.visualStimulusKeyBinding !== undefined)
            this.visualStimulusKeyBinding =
              parsedSettings.visualStimulusKeyBinding;
          if (parsedSettings.auditoryStimulusKeyBinding !== undefined)
            this.auditoryStimulusKeyBinding =
              parsedSettings.auditoryStimulusKeyBinding;
          console.log("App settings loaded:", parsedSettings);
        } catch (e) {
          console.error("Failed to parse app settings from localStorage", e);
        }
      }
    }
  }

  public saveSettings() {
    if (typeof window !== "undefined") {
      const settingsToSave = {
        theme: this.theme,
        visualStimulusKeyBinding: this.visualStimulusKeyBinding,
        auditoryStimulusKeyBinding: this.auditoryStimulusKeyBinding,
      };
      localStorage.setItem("appSettings", JSON.stringify(settingsToSave));
      console.log("App settings saved manually:", settingsToSave);
    }
  }

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  public toggleTheme() {
    this.theme = this.theme === "cupcake" ? "dracula" : "cupcake";
  }
}

const settings = Settings.getInstance();
export default settings;
