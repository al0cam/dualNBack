import gameState from "../models/GameState.svelte";
import type { MatchCounts } from "../types/MatchCounts";
import type { Stimulus } from "../types/Stimulus";

class GameLogic {
  private static instance: GameLogic;

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
  public startGame() {
    const sequence = this.generateStimuliSequence();
    // Reset current trial
    gameState.currentTrial = 0;
    gameState.isGameStarted = true;
  }

  /**
   * End the game and reset the game state
   */
  public endGame() {
    gameState.isGameStarted = false;
  }

  /**
   * Generate the stimuli sequence based on n-back level and match percentage
   *
   * @returns {Stimulus[]} - The generated sequence of stimuli
   */
  public generateStimuliSequence(): Stimulus[] {
    gameState.trialNumber = Math.ceil(
      gameState.defaultTrialNumber + gameState.nBackLevel ** 2,
    );
    gameState.matches = Math.floor(
      gameState.trialNumber * gameState.matchPercentage,
    );
    let sequence: Stimulus[] = [];

    sequence = this.generateRandomSequence(gameState.trialNumber);
    sequence = this.balanceSequence(sequence);

    return sequence;
  }

  /**
   * Generate a random sequence of stimuli
   *
   * @param trialNumber - Number of trials to generate
   * @returns {Stimulus[]} - The generated sequence of stimuli
   */
  private generateRandomSequence(trialNumber: number): Stimulus[] {
    const sequence: Stimulus[] = [];

    for (let i = 0; i < trialNumber; i++) {
      const position = this.getRandomPosition();
      const letter = this.getRandomLetter();
      sequence.push({
        position,
        letter,
      });
    }

    return sequence;
  }

  // Validate and balance the sequence
  private balanceSequence(sequence: Stimulus[]): Stimulus[] {
    const n = gameState.nBackLevel;

    // Check for accidental patterns and correct them
    for (let i = n; i < sequence.length; i++) {
      // Check for three consecutive position matches
      if (
        i >= n + 1 &&
        sequence[i].position === sequence[i - n].position &&
        sequence[i - n].position === sequence[i - n - 1].position
      ) {
        sequence[i].position = this.getDifferentPosition(sequence[i].position);
      }

      // Check for three consecutive letter matches
      if (
        i >= n + 1 &&
        sequence[i].letter === sequence[i - n].letter &&
        sequence[i - n].letter === sequence[i - n - 1].letter
      ) {
        sequence[i].letter = this.getDifferentLetter(sequence[i].letter);
      }
    }
    return sequence;
  }

  // Get the current stimulus based on the current trial
  public getCurrentStimulus(sequence: Stimulus[]): Stimulus | null {
    const currentTrial = gameState.currentTrial;
    if (currentTrial >= 0 && currentTrial < sequence.length) {
      return sequence[currentTrial];
    }
    return null;
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
    let newPosition;
    do {
      newPosition = this.getRandomPosition();
    } while (newPosition === currentPosition);

    return newPosition;
  }

  /**
   * Get a random letter different from the current one
   *
   * @param currentLetter - Current letter
   * @return - New letter
   */
  private getDifferentLetter(currentLetter: string): string {
    let newLetter;
    do {
      newLetter = this.getRandomLetter();
    } while (newLetter === currentLetter);

    return newLetter;
  }

  /**
   * Generate a random letter from the available letters
   *
   * @returns {string} - Random letter
   */
  private getRandomLetter(): string {
    const letters = gameState.lettersUsed;
    return letters[this.getRandomInt(0, letters.length - 1)];
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

  // Check if the current position matches n-back position
  public isPositionMatch(sequence: Stimulus[]): boolean {
    const n = gameState.nBackLevel;
    const currentTrial = gameState.currentTrial;

    if (currentTrial < n || currentTrial >= sequence.length) {
      return false;
    }

    return (
      sequence[currentTrial].position === sequence[currentTrial - n].position
    );
  }

  // Check if the current letter matches n-back letter
  public isLetterMatch(sequence: Stimulus[]): boolean {
    const n = gameState.nBackLevel;
    const currentTrial = gameState.currentTrial;

    if (currentTrial < n || currentTrial >= sequence.length) {
      return false;
    }

    return sequence[currentTrial].letter === sequence[currentTrial - n].letter;
  }

  // Advance to the next trial
  public nextTrial(sequence: Stimulus[]): boolean {
    gameState.currentTrial++;
    return gameState.currentTrial < sequence.length;
  }

  // Helper method to convert a position index (0-7) to grid position (0-8 skipping 4)
  public positionToGridIndex(position: number): number {
    return this.VALID_POSITIONS[position % this.VALID_POSITIONS.length];
  }
}

const gameLogic = GameLogic.getInstance();
export default gameLogic;
