import type * as ts from "typescript/lib/tsserverlibrary";

type LanguageServiceMethodWrapper<K extends keyof ts.LanguageService> = (
    delegate: ts.LanguageService[K],
    info?: ts.server.PluginCreateInfo
) => ts.LanguageService[K];

export interface ICustomizedLanguageServie {
    getCompletionsAtPosition: ts.LanguageService["getCompletionsAtPosition"];
}

export class RefactorLanguageServiceProxy {
    private readonly _wrappers: Array<{
        name: keyof ts.LanguageService;
        wrapper: LanguageServiceMethodWrapper<any>;
    }> = [];

    constructor(
        private readonly customizedLanguageServie: ICustomizedLanguageServie
    ) {
        this.tryAdaptGetCompletionsAtPosition();
    }

    decorate(languageService: ts.LanguageService) {
        const intercept: Partial<ts.LanguageService> = Object.create(null);

        for (const { name, wrapper } of this._wrappers) {
            (intercept[name] as any) = wrapper(
                languageService[name]!.bind(languageService)
            );
        }

        languageService.getApplicableRefactors;

        return new Proxy(languageService, {
            get: (target: any, property: string | symbol) => {
                return (intercept as any)[property] || target[property];
            }
        });
    }

    private tryAdaptGetCompletionsAtPosition() {
        this.wrap(
            "getCompletionsAtPosition",
            delegate => (
                fileName: string, position: number, options: ts.GetCompletionsAtPositionOptions | undefined
            ) => {
                const original = delegate(
                    fileName,
                    position,
                    options
                );
                const customized = this.customizedLanguageServie.getCompletionsAtPosition(
                    fileName,
                    position,
                    options,
                );

                if (!original && !customized) {
                    return undefined
                }
                if (!original) {
                    return customized
                }
                if (!customized) {
                    return original
                }

                return {
                    ...original,
                    entries: customized.entries.concat(original.entries)
                }
            }
        );
    }

    private wrap<K extends keyof ts.LanguageService>(
        name: K,
        wrapper: LanguageServiceMethodWrapper<K>
    ) {
        this._wrappers.push({ name, wrapper });
        return this;
    }
}
