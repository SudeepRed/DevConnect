"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const vscode = require("vscode");
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const openai_1 = require("openai");
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
connection.console.log(`Console test.`);
const configuration = new openai_1.Configuration({
    apiKey: "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",
});
const openai = new openai_1.OpenAIApi(configuration);
let orange = vscode.window.createOutputChannel("Orange");
//Write to output.
orange.appendLine("I am a banana.");
connection.onInitialize((params) => {
    return {
        capabilities: {
            completionProvider: {
                resolveProvider: true,
            },
        },
    };
});
connection.onCompletion(async (params) => {
    let text = documents.get(params.textDocument.uri)?.getText();
    if (text === undefined) {
        return [];
    }
    const response = await openai.createCompletion("code-davinci-001", {
        prompt: '"""\nYou are a language server protocol for c++,python, javascript and java and return the next item for auto code completion.\n"""\n',
        temperature: 0,
        max_tokens: 64,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["\n"],
    });
    console.log(response);
    connection.console.log(`Console test.`);
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