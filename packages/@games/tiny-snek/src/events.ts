import { GameEvent } from "./systems";

export class PlayerAteFoodEvent {
  type = GameEvent.OnPlayerAteFood;
}

export class PlayerDiedEvent {
  type = GameEvent.OnPlayerDied;
}
