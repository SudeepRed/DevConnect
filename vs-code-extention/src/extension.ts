// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { TokenManager } from "./TokenManger";
export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  
  console.log('Congratulations, your extension "devconnect" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("devconnect.helloWorld", () => {
      console.log("hello");
      vscode.window.showInformationMessage("info"+TokenManager.getToken());
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devconnect.authenticate", () => {
      console.log("hello");
      authenticate();
    })
  );
}

export function deactivate() {}
