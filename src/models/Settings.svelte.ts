class Settings {
  private static instance: Settings;

  theme: string = $state("dracula");
  visualStimulusKeyBinding: string = $state("a");
  auditoryStimulusKeyBinding: string = $state("l");

  private constructor() { }

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  public toggleTheme() {
    this.theme = this.theme === "cupcake" ? "dracula" : "cupcake";
    console.log("Theme changed to:", this.theme);
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("theme", this.theme);
  }
}

const settings = Settings.getInstance();
export default settings;
