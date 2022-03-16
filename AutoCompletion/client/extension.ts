
import * as vscode from 'vscode';
import * as path from "path";
import {LanguageClient, TransportKind} from "vscode-languageclient/node";

console.log("Client");

let client: LanguageClient;
export function activate(context: vscode.ExtensionContext) {
	let serverPath = context.asAbsolutePath(path.join("server","server.js"));
	let serverOpts = {
		run:{module:serverPath, transport: TransportKind.ipc},
		debug: {module: serverPath, transport: TransportKind.ipc}
	};
	let clientOpts = {
		documentSelector:[{scheme: "file",language: "python"}]
	};

	client = new LanguageClient("CodeCompleteClient",serverOpts,clientOpts);
	client.start();
}

export function deactivate() {
	return client.stop();
}
