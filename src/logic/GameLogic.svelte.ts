import type { StimuliSequence } from "../types/StimuliSequence";
import type { Stimulus } from "../types/Stimulus";

class GameLogic {
  private static instance: GameLogic;

  stimuliDuration: number = $state(500);
  pauseBetweenStimuli: number = $state(2500);

  nBackLevel: number = $state(2);
  currentSet = $state(0);
  setNumber: number = $state(20);
  trialNumber: number = $state(0);
  matches: number = $state(6);
  randomness: number = $state(0.35);
  // derived from reference [1]
  lettersUsed: string[] = $state([
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
  ]);

  isGameStarted: boolean = $state(false);

  // Define the valid positions (excluding center)
  private readonly VALID_POSITIONS: number[] = [0, 1, 2, 3, 5, 6, 7, 8];

  private constructor() { }

  public static getInstance(): GameLogic {
    if (!GameLogic.instance) {
      GameLogic.instance = new GameLogic();
    }
    return GameLogic.instance;
  }

  /**
   * Start the game by generating the stimuli sequence
   */
  public startGame(gridItems: HTMLElement[]): void {
    console.log("Starting game...");
    this.trialNumber = Math.ceil(
      (this.nBackLevel + this.matches) / this.randomness,
    );
    const stimuliSequence = this.generateMatchIndices(
      this.trialNumber,
      this.matches,
      this.nBackLevel,
    );
    // console.log(stimuliSequence);

    const sequence = this.generateStimulusSequence(
      this.trialNumber,
      this.nBackLevel,
      stimuliSequence,
    );

    // console.log(sequence);
    // this.printSequence(sequence, stimuliSequence);

    // Reset current trial
    this.isGameStarted = true;
  }

  /**
   * End the game and reset the game state
   */
  public stopGame() {
    this.isGameStarted = false;
  }

  /**
   * Generate a sequence of stimuli based on the n-back level and match indices
   *
   * @param trialNumber - Number of trials
   * @param nBack - The n-back level
   * @param stimuliSequence - The sequence of match indices
   * @return {Stimulus[]} - The generated sequence of stimuli
   */
  generateStimulusSequence(
    trialNumber: number,
    nBack: number,
    stimuliSequence: StimuliSequence,
  ): Stimulus[] {
    const sequence: Stimulus[] = [];

    for (let i = 0; i < trialNumber; i++) {
      const isAudioMatch = stimuliSequence.LetterMatchIndices.includes(i);
      const isVisualMatch = stimuliSequence.PositionMatchIndices.includes(i);

      let letter: string;
      let position: number;

      if (isAudioMatch) {
        // Force audio match to n-back
        letter = sequence[i - nBack].letter;
      } else if (i >= nBack) {
        // Ensure no accidental match
        letter = this.getDifferentLetter(sequence[i - nBack].letter);
      } else {
        // Random before N
        letter = this.getRandomLetter();
      }

      if (isVisualMatch) {
        position = sequence[i - nBack].position;
      } else if (i >= nBack) {
        position = this.getDifferentPosition(sequence[i - nBack].position);
      } else {
        position = this.getRandomPosition();
      }

      sequence.push({ letter, position });
    }

    return sequence;
  }

  /**
   * Generate match indices for the letter and position matches
   *
   * @param trialNumber - Number of trials
   * @param matches - Number of matches
   * @param nBack - The n-back level
   * @param minSpacing - Minimum gap between match indices
   * @returns {StimuliSequence} - The generated match indices
   */
  generateMatchIndices(
    trialNumber: number,
    matches: number,
    nBack: number,
    minSpacing = 2, // minimum gap between match indices
  ): StimuliSequence {
    function getMatchIndices(): number[] {
      const indices: number[] = [];
      const available: number[] = [];

      for (let i = nBack; i < trialNumber; i++) {
        available.push(i);
      }

      while (indices.length < matches && available.length > 0) {
        // Choose a random index from what's left
        const randomIdx = Math.floor(Math.random() * available.length);
        const chosen = available[randomIdx];
        indices.push(chosen);

        for (let offset = -minSpacing; offset <= minSpacing; offset++) {
          const toRemove = chosen + offset;
          const removeIndex = available.indexOf(toRemove);
          if (removeIndex !== -1) {
            available.splice(removeIndex, 1);
          }
        }
      }
      if (indices.length < matches) {
        // If we couldn't find enough indices, try again
        return getMatchIndices();
      }

      return indices;
    }

    return {
      LetterMatchIndices: getMatchIndices(),
      PositionMatchIndices: getMatchIndices(),
    };
  }

  /**
   * Generate a random position from the valid positions
   *
   * @returns {number} - Random position
   */
  private getRandomPosition(): number {
    const randomIndex = this.getRandomInt(0, this.VALID_POSITIONS.length - 1);
    return this.VALID_POSITIONS[randomIndex];
  }

  /**
   * Get a random position different from the current one
   *
   * @param currentPosition - Current position
   * @return - New position
   */
  private getDifferentPosition(currentPosition: number): number {
    let newPosition: number;
    do {
      newPosition = this.getRandomPosition();
    } while (newPosition === currentPosition);

    return newPosition;
  }

  /**
   * Generate a random letter from the available letters
   *
   * @returns {string} - Random letter
   */
  private getRandomLetter(): string {
    const letters = this.lettersUsed;
    return letters[this.getRandomInt(0, letters.length - 1)];
  }

  /**
   * Get a random letter different from the current one
   *
   * @param currentLetter - Current letter
   * @return - New letter
   */
  private getDifferentLetter(currentLetter: string): string {
    let newLetter: string;
    do {
      newLetter = this.getRandomLetter();
    } while (newLetter === currentLetter);

    return newLetter;
  }

  /*
   * Get a random integer between min and max (inclusive)
   *
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   */
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Check if the current position matches the letter n-back
   *
   * @param sequence - The sequence of stimuli
   * @param nBack - The n-back level
   * @param currentTrial - The current trial index
   * @return {boolean} - True if the letters match, false otherwise
   */
  public isPositionMatch(
    sequence: Stimulus[],
    nBack: number,
    currentTrial: number,
  ): boolean {
    if (currentTrial < nBack || currentTrial >= sequence.length) {
      return false;
    }

    return (
      sequence[currentTrial].position ===
      sequence[currentTrial - nBack].position
    );
  }

  /**
   * Check if the current letter matches n-back letter
   *
   * @param sequence - The sequence of stimuli
   * @param nBack - The n-back level
   * @param currentTrial - The current trial index
   * @return {boolean} - True if the letters match, false otherwise
   */
  public isLetterMatch(
    sequence: Stimulus[],
    nBack: number,
    currentTrial: number,
  ): boolean {
    if (currentTrial < nBack || currentTrial >= sequence.length) {
      return false;
    }

    return (
      sequence[currentTrial].letter === sequence[currentTrial - nBack].letter
    );
  }

  /**
   * Convert a position to a grid index
   *
   * @param position - The position to convert
   * @return {number} - The grid index
   */
  public positionToGridIndex(position: number): number {
    return this.VALID_POSITIONS[position % this.VALID_POSITIONS.length];
  }

  /**
   * Print the sequence of stimuli to the console
   *
   * @param sequence - The sequence of stimuli
   * @param stimuliSequence - The sequence of match indices
   * @return {void}
   */
  printSequence(sequence: Stimulus[], stimuliSequence: StimuliSequence): void {
    let string = "";
    for (let i = 0; i < sequence.length; i++) {
      if (stimuliSequence.LetterMatchIndices.includes(i)) {
        string += `${sequence[i].letter.toUpperCase()} `;
      } else {
        string += `${sequence[i].letter} `;
      }
    }
    console.log(string);
  }

  async runSequence(
    sequence: Stimulus[],
    gridItems: HTMLElement[],
    stimuliDuration: number,
    pauseBetweenStimuli: number,
  ) {
    for (let i = 0; i < sequence.length; i++) {
      const gridIndex = this.positionToGridIndex(sequence[i].position);

      // Show the stimulus
      gridItems[gridIndex].classList.add("bg-orange-500");
      await new Promise((resolve) => setTimeout(resolve, stimuliDuration));

      // Hide the stimulus
      gridItems[gridIndex].classList.remove("bg-orange-500");
      if (i < sequence.length - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, pauseBetweenStimuli),
        );
      }
    }
  }
}

const gameLogic = GameLogic.getInstance();
export default gameLogic;
