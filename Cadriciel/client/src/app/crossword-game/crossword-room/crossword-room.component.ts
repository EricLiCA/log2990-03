import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameManagerService } from '../crossword-game-manager.service';
import { PlayerManagerService } from '../crossword-player-manager.service';
import { ClientGameInfo } from '../../../../../commun/crossword/clientGameInfo';

@Component({
  selector: 'app-crossword-room',
  templateUrl: './crossword-room.component.html',
  styleUrls: ['./crossword-room.component.css']
})
export class CrosswordRoomComponent implements OnInit {

  public username: string;
  public gamesListInfo: ClientGameInfo[] = [];
  @Output() private startGameEmitter: EventEmitter<any>;
  @Output() private endGameEmitter: EventEmitter<any>;
  constructor(private gameManagerService: GameManagerService, private playerManagerService: PlayerManagerService) {
    this.username = '';
    this.startGameEmitter = new EventEmitter();
  }

  public ngOnInit() {
    this.gameManagerService.getGames().then(games => {
      this.gamesListInfo = games;
      this.startGameOnPlayer2Joined();
    });
  }

  public joinGame(gameId: string) {
    this.setPlayerUsername();
    this.gameManagerService.joinGame(gameId, this.playerManagerService.getPlayer());
  }

  public setPlayerUsername(): void {
    this.playerManagerService.getPlayer().setUsername(this.username);
  }

  private startGameOnPlayer2Joined() {
    this.gameManagerService.playerTwoAlerts()
      .subscribe((result) => {
        this.startGameEmitter.emit();
      });
  }
}
