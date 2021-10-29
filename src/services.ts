import type * as ts from "typescript/lib/tsserverlibrary";
import 'open-typescript'
import { ICustomizedLanguageServie } from "./decorator";
import { LanguageServiceLogger } from "./logger";
import { Player } from "./manager";
import {
    RefactorContext,
} from "./types";
import * as fs from 'fs';
import * as path from 'path'

export class CustomizedLanguageService implements ICustomizedLanguageServie {
    constructor(
        private readonly player: Player,
        private readonly info: ts.server.PluginCreateInfo,
        private readonly typescript: typeof ts,
        private readonly logger: LanguageServiceLogger
    ) { }

    getCompletionsAtPosition(fileName: string, position: number, options: ts.GetCompletionsAtPositionOptions | undefined): ts.WithMetadata<ts.CompletionInfo> | undefined {
        const context = this.getRefactorContext(fileName);
        if (!context) {
            return undefined
        }

        const { file } = context;

        if (file.isDeclarationFile) {
            return undefined
        }

        const currentToken = this.typescript.findPrecedingToken(position, file);
        this.logger.log(this.typescript.SyntaxKind[currentToken.kind])
        if (currentToken.kind !== this.typescript.SyntaxKind.DotToken || !this.typescript.isPropertyAccessExpression(currentToken.parent)) {
            return undefined
        }

        if (!this.typescript.isCallExpression(currentToken.parent.expression) || !this.typescript.isIdentifier(currentToken.parent.expression.expression)) {
            return undefined
        }
        const callExpr = currentToken.parent.expression;
        const callId = currentToken.parent.expression.expression;
        if (callId.text === 'stop') {
            this.player.stop();

            return {
                isGlobalCompletion: false,
                isMemberCompletion: false,
                isNewIdentifierLocation: false,
                entries: [
                    {
                        name: 'stopped',
                        kind: this.typescript.ScriptElementKind.unknown,
                        sortText: this.typescript.Completions.SortText.LocationPriority
                    }
                ]
            }
        }

        if (callId.text !== 'play') {
            return undefined
        }
        if (callExpr.arguments.length !== 1) {
            return undefined
        }
        const arg = callExpr.arguments[0];
        if (!this.typescript.isStringLiteral(arg)) {
            return undefined
        }

        const name = arg.text;
        const mp3Name = path.resolve(__dirname, `${name}.mp3`);
        if (!fs.existsSync(mp3Name)) {
            return {
                isGlobalCompletion: false,
                isMemberCompletion: false,
                isNewIdentifierLocation: false,
                entries: [
                    {
                        name: 'File not found',
                        kind: this.typescript.ScriptElementKind.unknown,
                        sortText: this.typescript.Completions.SortText.LocationPriority
                    }
                ]
            }
        }

        this.player.play(mp3Name);

        return {
            isGlobalCompletion: false,
            isMemberCompletion: false,
            isNewIdentifierLocation: false,
            entries: [
                {
                    name: 'playing',
                    kind: this.typescript.ScriptElementKind.unknown,
                    sortText: this.typescript.Completions.SortText.LocationPriority
                }
            ]
        }
    }

    getRefactorContext(fileName: string): RefactorContext | undefined {
        const program = this.info.languageService.getProgram();
        if (!program) {
            this.logger.log("Cannot find program");
            return undefined;
        }

        const file = program.getSourceFile(fileName);
        if (!file) {
            this.logger.log("Cannot find source file");
            return undefined;
        }

        return {
            file,
            program
        };
    }
}
