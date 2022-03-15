"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
connection.onInitialize((params) => {
    return {
        capabilities: {
            completionProvider: {
                resolveProvider: true
            }
        }
    };
});
connection.onCompletion((params) => {
    return [
        {
            label: "for i in range(10)",
            kind: node_1.CompletionItemKind.Text,
            data: 1
        },
        {
            label: "id i <10:",
            kind: node_1.CompletionItemKind.Text,
            data: 2
        }
    ];
});
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = "Hello1";
        item.documentation = "HEHE";
    }
    return item;
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map