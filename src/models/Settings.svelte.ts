class Settings {
  private static instance: Settings;
  // App settings
  theme: string = $state("light");
  visualStimulusKeyBinding: string = $state("a");
  auditoryStimulusKeyBinding: string = $state("l");

  private constructor() {
  }

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }



}

const settings = Settings.getInstance();
export default settings;
