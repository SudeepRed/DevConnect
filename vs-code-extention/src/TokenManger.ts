import * as vscode from "vscode";
const KEY_TOKEN = "token";
const KEY_TEAMID = "teamid";

export class TokenManager {
  static globalState: vscode.Memento;
  static setToken(token: string) {

    return this.globalState.update(KEY_TOKEN, token);
  }
  static getToken(): string | undefined {
    return this.globalState.get(KEY_TOKEN);
  }
  static setTeamid(teamid: string){
    return this.globalState.update(KEY_TEAMID, teamid);
  }
  static getTeamid(): string|undefined {
    return this.globalState.get(KEY_TEAMID);
  }
}
