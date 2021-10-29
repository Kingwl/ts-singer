import type * as ts from "typescript/lib/tsserverlibrary";
import { PlayerPlugin } from "./plugin";

export = (mod: { typescript: typeof ts }) =>
    new PlayerPlugin(mod.typescript);