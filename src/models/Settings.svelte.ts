interface Setting {
  id: string;
  label: string;
  type: "text" | "select" | "checkbox";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[]; // For select type
  defaultValue?: string | number | boolean;
}

interface SettingCategory {
  id: string;
  label: string;
  settings: Setting[];
}

let variables: SettingCategory[] = [
  {
    id: "general",
    label: "General Settings",
    settings: [
      {
        id: "theme",
        label: "Theme",
        type: "select",
        defaultValue: "dracula",
        options: ["cupcake", "dracula"],
      },
      {
        id: "visualStimulusKeyBinding",
        label: "Visual Stimulus Key Binding",
        type: "text",
        defaultValue: "a",
      },
      {
        id: "auditoryStimulusKeyBinding",
        label: "Auditory Stimulus Key Binding",
        type: "text",
        defaultValue: "l",
      },
    ],
  },
];

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
