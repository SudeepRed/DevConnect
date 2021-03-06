import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import { SLACK_URL } from "./constants";
import { getNonce } from "./getNonce";
import { TokenManager } from "./TokenManger";

export class DevConnectPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: DevConnectPanel | undefined;

  public static readonly viewType = "hello-world";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (DevConnectPanel.currentPanel) {
      DevConnectPanel.currentPanel._panel.reveal(column);
      DevConnectPanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      DevConnectPanel.viewType,
      "DevConnect",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    DevConnectPanel.currentPanel = new DevConnectPanel(panel, extensionUri);
  }

  public static kill() {
    DevConnectPanel.currentPanel?.dispose();
    DevConnectPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    DevConnectPanel.currentPanel = new DevConnectPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    DevConnectPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "dashboard": {
          if (!data.value) {
            return;
          }
          webview.postMessage({
            type: "getInfo",
            value: TokenManager.getTeamid(),
          });
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "tokens": {
          break;
        }
        case "get-token": {
          webview.postMessage({
            type: "token",
            value: TokenManager.getToken(),
          });
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out/compiled", "Panel.js")
    );

    // Local path to css styles
    const styleResetPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "reset.css"
    );
    const stylesPathMainPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "vscode.css"
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(styleResetPath);
    const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out/compiled", "Panel.css")
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "node_modules/@vscode/codicons/dist",
        "codicon.css"
      )
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
        <link href="${cssUri}" rel="stylesheet">
        <link href="${codiconsUri}" rel="stylesheet" />
        <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
/>
        <script nonce="${nonce}">
        const tsvscode = acquireVsCodeApi();
        const apiBaseUrl = ${JSON.stringify(apiBaseUrl)};
        const SLACK_URL = ${JSON.stringify(SLACK_URL)};
        </script>
			</head>
      <body>
			</body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</html>`;
  }
}
