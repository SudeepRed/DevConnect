import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
export const authenticate = () => {
  const app = polka();
  console.log("authhhh1");
  app.get('/auth/:token',async (req, res) => {
      const {token} = req.params;
      if(!token) {
          res.end(`<h1>Oops!</h1>`);
      }
      console.log(token);
      res.end(`<h1>Sucess</h1>`);
  });
  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
  console.log("authhhh3");
};
