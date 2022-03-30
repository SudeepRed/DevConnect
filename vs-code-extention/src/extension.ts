// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { DevConnectPanel } from "./DevConnectPanel";
import { TokenManager } from "./TokenManger";
import { SidebarProvider } from "./SidebarProvider";
export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  console.log('Congratulations, your extension "devconnect" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("devconnect.helloWorld", () => {
      console.log("hello");
      vscode.window.showInformationMessage("info" + TokenManager.getToken());
      DevConnectPanel.createOrShow(context.extensionUri);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devconnect.dashboard", () => {
      console.log("hello");
      vscode.window.showInformationMessage("info" + TokenManager.getToken());
      DevConnectPanel.createOrShow(context.extensionUri);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devconnect.authenticate", () => {
      console.log("hello");
      authenticate();
    })
  );
  
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "devconnect-sidebar",
      sidebarProvider
    )
  );
}

export function deactivate() {}
