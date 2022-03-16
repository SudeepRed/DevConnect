"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const node_1 = require("vscode-languageclient/node");
console.log("Client");
let client;
function activate(context) {
    let serverPath = context.asAbsolutePath(path.join("server", "server.js"));
    let serverOpts = {
        run: { module: serverPath, transport: node_1.TransportKind.ipc },
        debug: { module: serverPath, transport: node_1.TransportKind.ipc }
    };
    let clientOpts = {
        documentSelector: [{ scheme: "file", language: "python" }]
    };
    client = new node_1.LanguageClient("CodeCompleteClient", serverOpts, clientOpts);
    client.start();
}
exports.activate = activate;
function deactivate() {
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map