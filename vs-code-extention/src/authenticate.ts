import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./TokenManger";
export const authenticate = (fn: () => void) => {
  const app = polka();
  console.log("authhhh1");
  app.get("/auth/:token", async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end(`<h1>Oops!</h1>`);
    }
    
    await TokenManager.setToken(token);
    fn();
    res.end(`<h1>Sucess</h1>`);
    (app as any).server.close();
  });
  app.listen(8000, (err: Error) => {
    if (err) {
      console.log(err);
      vscode.window.showErrorMessage(err.message);
    } else {
      console.log("Success!");
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
  console.log("authhhh3");
};
