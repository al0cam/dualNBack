interface AudioBuffers {
  basic: { [key: string]: AudioBuffer };
  nato: { [key: string]: AudioBuffer };
}

class AudioService {
  private static instance: AudioService;

  private readonly commonLetterKeys = [
    "b",
    "c",
    "d",
    "g",
    "h",
    "k",
    "p",
    "q",
    "t",
    "w",
  ];

  basicAlphabet: Map<string, HTMLAudioElement> = $state(
    new Map<string, HTMLAudioElement>(),
  );

  natoAlphabet: Map<string, HTMLAudioElement> = $state(
    new Map<string, HTMLAudioElement>(),
  );

  private constructor() {
    console.log("AudioService instance created.");
    this.loadBasicAlphabetSounds();
    this.loadNatoAlphabetSounds();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  loadBasicAlphabetSounds() {
    console.log("Loading basic alphabet sounds...");
    for (const letter of this.commonLetterKeys) {
      const audio = new Audio(`basic/${letter}.mp3`);
      audio.preload = "auto";
      this.basicAlphabet.set(letter, audio);
    }

    console.log("Basic alphabet sounds loaded.");
  }

  loadNatoAlphabetSounds() {
    console.log("Loading NATO alphabet sounds...");
    for (const letter of this.commonLetterKeys) {
      const audio = new Audio(`nato/${letter}.mp3`);
      audio.preload = "auto";
      this.natoAlphabet.set(letter, audio);
    }
  }

  playSound(letter: string, alphabet: string = "basic") {
    console.log(`Playing sound for letter: ${letter} in alphabet: ${alphabet}`);
    if (alphabet === "basic") {
      const audio = this.basicAlphabet.get(letter);
      if (audio) {
        audio.currentTime = 0; // Reset to the start
        audio.play().catch((error) => {
          console.error(`Error playing sound for letter ${letter}:`, error);
        });
      } else {
        console.warn(`No sound found for letter: ${letter}`);
      }
    } else if (alphabet === "nato") {
      const audio = this.natoAlphabet.get(letter);
      if (audio) {
        audio.currentTime = 0; // Reset to the start
        audio.play().catch((error) => {
          console.error(`Error playing sound for letter ${letter}:`, error);
        });
      } else {
        console.warn(`No sound found for letter: ${letter}`);
      }
    } else {
      console.warn(`Unsupported alphabet: ${alphabet}`);
    }
  }
}

const audioService = AudioService.getInstance();
export default audioService;
