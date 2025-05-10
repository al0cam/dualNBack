
class GameState {
  private static instance: GameState;
  nBackLevel: number = $state(2);
  currentTrial = $state(0);
  trialNumber: number = $state(20);

  //Milliseconds for duration of stimuli
  stimuliDuration: number = $state(500);
  pauseBetweenStimuli: number = $state(2500);
  stimuliNumber: number = $state(20);

  isGameStarted: boolean = $state(false);

  // (C, H, K, L, Q, R, S, T)
  lettersUsed: string[] = $state(["C", "H", "K", "L", "Q", "R", "S", "T"]);

  constructor() { }

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

}

const gameState = GameState.getInstance();
export default gameState;
