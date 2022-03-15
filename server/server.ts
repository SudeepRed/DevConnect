import {createConnection, ProposedFeatures, TextDocuments, CompletionItemKind} from "vscode-languageserver/node";
import {TextDocument} from "vscode-languageserver-textdocument";
const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);


connection.onInitialize((params)=>{
    return{
        capabilities:{
            completionProvider:{
                resolveProvider: true
            }
        }
    };
});

connection.onCompletion((params)=>{
    return [
        {
            label: "for i in range(10)",
            kind: CompletionItemKind.Text,
            data:1
        },
        {
            label: "id i <10:",
            kind: CompletionItemKind.Text,
            data:2
        }
    ];
});

connection.onCompletionResolve((item)=>{
    if(item.data === 1){
        item.detail = "Hello1";
        item.documentation = "HEHE";
    }
    return item;
});

documents.listen(connection);
connection.listen();

