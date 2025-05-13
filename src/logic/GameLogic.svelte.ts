import gameState from "../models/GameState.svelte";
import type { MatchCounts } from "../types/MatchCounts";
import type { MatchType } from "../types/MatchType";
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
    const matchCounts: MatchCounts = this.calculateMatchCounts();
    let sequence: Stimulus[] = [];

    sequence = this.generateInitialStimuli();
    sequence = this.generateRemainingStimuli(sequence, matchCounts);
    sequence = this.balanceSequence(sequence);

    return sequence;
  }

  /**
   * Calculate the number of matches based on n-back level and match percentage
   *
   * @returns {MatchCounts} - The calculated match counts for position and audio
   */
  private calculateMatchCounts(): MatchCounts {
    gameState.trialNumber = Math.ceil(
      gameState.defaultTrialNumber + gameState.nBackLevel ** 2,
    );
    gameState.matches = Math.floor(
      gameState.trialNumber * gameState.matchPercentage,
    );

    return {
      position: gameState.matches,
      audio: gameState.matches,
    };
  }

  /**
   * Generate the initial stimuli sequence
   *
   * @returns {Stimulus[]} - The initial sequence of stimuli
   */
  private generateInitialStimuli(): Stimulus[] {
    const sequence: Stimulus[] = [];

    for (let i = 0; i < gameState.nBackLevel; i++) {
      sequence.push({
        position: this.getRandomPosition(),
        letter: this.getRandomLetter(),
      });
    }

    return sequence;
  }

  // Generate remaining stimuli with appropriate matches
  private generateRemainingStimuli(
    sequence: Stimulus[],
    matchCounts: MatchCounts,
  ): Stimulus[] {
    const n = gameState.nBackLevel;
    const trials = gameState.trialNumber;

    const remaining = { ...matchCounts };

    for (let i = n; i < trials; i++) {
      const previousTrial = sequence[i - n];

      const stimulus = this.generateStimulus(previousTrial, matchType);
      sequence.push(stimulus);

      if (matchType === "position") {
        remaining.position--;
      } else if (matchType === "audio") {
        remaining.audio--;
      }
    }
    return sequence;
  }

  /**
   * Generate a stimulus based on the previous one and match type
   *
   * @param previous - Previous stimulus
   * @param matchType - Type of match to generate
   * @return - New stimulus
   */
  private generateStimulus(previous: Stimulus, matchType: MatchType): Stimulus {
    switch (matchType) {
      case "position":
        return {
          position: previous.position,
          letter: this.getDifferentLetter(previous.letter),
        };
      case "audio":
        return {
          position: this.getDifferentPosition(previous.position),
          letter: previous.letter,
        };
      default:
        return {
          position: this.getDifferentPosition(previous.position),
          letter: this.getDifferentLetter(previous.letter),
        };
    }
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
   * Select a random item based on weighted probabilities
   *
   * @param items - Array of items to choose from
   * @param weights - Corresponding weights for each item
   * @return - Selected item
   */
  private weightedRandomSelect<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      if (random < weights[i]) {
        return items[i];
      }
      random -= weights[i];
    }

    return items[items.length - 1]; // Fallback
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
