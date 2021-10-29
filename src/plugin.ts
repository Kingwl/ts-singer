import type * as ts from "typescript/lib/tsserverlibrary";
import { LanguageServiceLogger } from "./logger";
import { RefactorLanguageServiceProxy } from "./decorator";
import { CustomizedLanguageService } from "./services";
import { SynchronizedConfiguration } from "./types";
import { Player } from "./manager";

export class PlayerPlugin {
    private logger?: LanguageServiceLogger;

    constructor(private readonly typescript: typeof ts) {}

    create(info: ts.server.PluginCreateInfo) {
        const config: SynchronizedConfiguration = info.config ?? {};
        this.logger = new LanguageServiceLogger(info);
        this.logger.log("create config: " + JSON.stringify(config));

        const manager = new Player(this.logger);
        return new RefactorLanguageServiceProxy(
            new CustomizedLanguageService(manager, info, this.typescript, this.logger)
        ).decorate(info.languageService);
    }
}
