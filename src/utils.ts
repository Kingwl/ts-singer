import type * as ts from "typescript/lib/tsserverlibrary";
import { Config } from "./types";

export function getPositionOfPositionOrRange(
    positionOrRange: number | ts.TextRange
) {
    return typeof positionOrRange === "number"
        ? positionOrRange
        : positionOrRange.pos;
}

export function assert(v: any, message?: string): asserts v {
    if (!v) {
        throw new Error(message ?? "Assertion failed");
    }
}

export function readConfig (obj: unknown): Config | undefined {
    if (typeof obj !== 'object' || !obj) {
        return undefined
    }

    if ('pid' in obj && 'token' in obj) {
        const configObj = obj as { pid: unknown, token: unknown }
        const pid = configObj.pid
        const token = configObj.token

        if (typeof pid === 'number' && typeof token === 'string') {
            return {
                pid,
                token
            }
        }
    }

    return undefined
}

export function trimStart(text: string, prefix: string) {
    return text.startsWith(prefix) ? text.slice(prefix.length) : text
}
