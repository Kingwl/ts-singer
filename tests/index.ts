import { Player } from "../src/manager";
import * as path from 'path'

function main () {
    const player = new Player({} as any)
    player.play(path.resolve(__dirname, 'sound.mp3'))
    console.log('wtf')

}

main();