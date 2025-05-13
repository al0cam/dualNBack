class GameState {
  private static instance: GameState;
  nBackLevel: number = $state(2);
  currentTrial = $state(0);
  // Number of trials to be run, it has to be calculated based on probabilities
  defaultTrialNumber: number = $state(20);
  trialNumber: number = $state(0);
  matches: number = $state(0);
  //Milliseconds for duration of stimuli
  stimuliDuration: number = $state(500);
  pauseBetweenStimuli: number = $state(2500);
  lettersUsed: string[] = $state(["C", "H", "K", "L", "Q", "R", "S", "T"]);
  matchPercentage: number = $state(0.3);

  isGameStarted: boolean = $state(false);

  private constructor() { }

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }
}

const gameState = GameState.getInstance();
export default gameState;
