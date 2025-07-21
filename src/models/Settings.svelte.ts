class Setting {
  id: string;
  type: "text" | "select" | "checkbox";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  defaultValue?: string | number | boolean;

  // this way, language changes can be reflected in the UI reactively
  label: string = $state("");
  value?: string | number | boolean = $state("");

  constructor(id: string, label: string) {
    this.id = id;
    this.label = label;
    this.type = "text"; // Default type
  }
}

class SettingCategory {
  id: string;
  label: string = $state("");
  settings: Setting[];

  constructor(id: string, label: string) {
    this.id = id;
    this.label = label;
    this.settings = [];
  }
}

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
