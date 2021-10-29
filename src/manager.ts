import ps from 'play-sound'
import { LanguageServiceLogger } from './logger';
import { Category, Config } from "./types";
import {ChildProcess} from 'child_process'


export class Player {
    private player: ReturnType<typeof ps> = ps();
    private process: ChildProcess | undefined

    constructor (private readonly logger: LanguageServiceLogger) {
    }

    play (fileName: string) {
        this.process?.kill();
        this.process = this.player.play(fileName);
    }

    stop () {
        this.process?.kill()
    }
}
