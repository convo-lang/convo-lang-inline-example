import { convoOpenAiModule } from "@convo-lang/convo-lang";
import { initRootScope } from "@iyio/common";
import { readStdInLineAsync, stopReadingStdIn } from "@iyio/node-common";
import { config } from 'dotenv';
import { convert } from "./convert";
import { listDirectory } from "./list-directory";
import { guessPlanetConvo } from "./planet-convo";
import { guessPlanetZod } from "./planet-zod";
import { weatherForecast } from "./weather";

initRootScope(reg=>{
    reg.addParams(config({path:'.env',quiet:true}).parsed);
    reg.use(convoOpenAiModule);
})

const main=async ()=>{
    
    let _continue=true;
    while(_continue){

        console.log('Select an example');
        console.log('1 - list-dir        Lists a directory\'s contents and filters with a Regex');
        console.log('2 - planet          Guesses a planet based on a hint and return structured data based on Convo struct');
        console.log('3 - planet-zod      Guesses a planet based on a hint and return structured data based on Zod schema');
        console.log('4 - weather         Gives a weather forecast for a location');
        console.log('5 - convert         Converts a prompt written in convo format to the OpenAI standard');
        console.log('q - quit            Quit');

        const line=await readStdInLineAsync();
        console.log('\n');

        switch(line){

            case "1":
            case 'list-dir':
                await listDirectory();
                break;

            case "2":
            case "planet":
                await guessPlanetConvo();
                break;

            case "3":
            case "planet-zod":
                await guessPlanetZod();
                break;

            case "4":
            case "weather":
                await weatherForecast();
                break;

            case "5":
            case "convert":
                await convert();
                break;

            case "q":
            case "quit":
                _continue=false;
                break;
        }
        console.log('\n\n\n');
    }
    
    stopReadingStdIn();
}
main();