import gameState from "../models/GameState.svelte";

class GameLogic {
  private static instance: GameLogic;

  private constructor() { }

  public static getInstance(): GameLogic {
    if (!GameLogic.instance) {
      GameLogic.instance = new GameLogic();
    }
    return GameLogic.instance;
  }

  public startGame() {
    gameState.isGameStarted = true;
  }
  public endGame() {
    gameState.isGameStarted = false;
  }

  public generateStimuliSequence() {


  }
}

const gameLogic = GameLogic.getInstance();
export default gameLogic;
