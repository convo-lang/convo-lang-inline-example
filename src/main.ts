import { convo, convoOpenAiModule } from "@convo-lang/convo-lang";
import { initRootScope } from "@iyio/common";
import { readStdInLineAsync, stopReadingStdIn } from "@iyio/node-common";
import { config } from 'dotenv';
import { readdir } from "fs/promises";
import z from "zod";


initRootScope(reg=>{
    reg.addParams(config({path:'.env',quiet:true}).parsed);
    reg.use(convoOpenAiModule);
})








const listDirectory=async ()=>{


    const ls=async (path:string,pattern:string)=>{
        let list=await readdir(path);
        const reg=new RegExp(pattern);
        return {
            list:list.filter(p=>reg.test(p)),
            pattern
        }

    }

    const directoryListing=await convo`

        # List the contents of the given directory
        > listDirectory(
            path:string
            # Regular expression pattern to filter by
            pattern:string
        ) -> ${ls}

        > user
        What items the node_modules directory start with a "d" or "z".
        Use a single patter to filter
    `

    console.log('directoryListing',directoryListing);


}








const guessPlanet=async ()=>{

    console.log('Give me a hint about a planet you are thinking of');

    const hint=await readStdInLineAsync();

    const planet=await convo`

        > define
        Planet=struct(
            name:string
            distanceFromSunMiles:number
            description:string
            # A funny comment about the user's hint
            commentAboutHint:string
            # The sentiment of the hint
            hintSentiment:enum("happy" "sad" "mad" "neutral")
        )

        @json Planet
        > user
        Guess the planet based on the following hint:

        <hint>${hint}</hint>
    `

    console.log('Planet',planet);

}








const guessPlanetZod=async ()=>{

    console.log('Give me a hint about a planet you are thinking of');

    const hint=await readStdInLineAsync();

    const planetSchema=z.object({
        name:z.string(),
        distanceFromSunMiles:z.number(),
        description:z.string(),
        commentAboutHint:z.string().describe("A funny comment about the user's hint"),
        hintSentiment:z.enum(["happy","sad","mad","neutral"]).describe('The sentiment of the hint')
    })

    const planet=await convo`

        @json ${planetSchema}
        > user
        Guess the planet based on the following hint:

        <hint>${hint}</hint>
    `

    console.log('Planet',planet);

}







const weatherLambdaUrl='https://6tnpcnzjbtwa5z4qorusxrfaqu0sqqhs.lambda-url.us-east-1.on.aws';
const getWeather=async ()=>{

    console.log('Enter location to get weather for');

    const location=await readStdInLineAsync();

    const getWeatherAsync=async (city:string,state:string)=>{
        const r=await fetch(`${weatherLambdaUrl}/?location=${encodeURIComponent(`${city} ${state}`)}`);
        return {
            city,
            state,   
            ...await r.json()
        }
    }

    const weather=await convo`

        > getWeather(city:string state:string) -> ${getWeatherAsync}

        > user
        Get the weather for the following location:

        <location>${location}</location>
    `

    console.log('Weather',weather);

    const report=await convo`

        > system
        You are a friendly weather man. The current weather conditions are as follows:

        <weather-conditions>
        ${weather}
        </weather-conditions>

        > user
        Give me a weather report please
    `
    

    console.log('Weather report',report)

}






const main=async ()=>{

    let _continue=true;
    while(_continue){

        console.log('Select an example');
        console.log('1 - list-dir        Lists a directory\'s contents and filters with a Regex');
        console.log('2 - planet          Guesses a planet based on a hint and return structured data');
        console.log('3 - planet-zod      Guesses a planet based on a hint and return structured data based on Zod schema');
        console.log('4 - weather         Gives a weather forecast for a location');
        console.log('q - quit            Quit');

        const line=await readStdInLineAsync();

        switch(line){

            case "1":
            case 'list-dir':
                await listDirectory();
                break;

            case "2":
            case "planet":
                await guessPlanet();
                break;

            case "3":
            case "planet-zod":
                await guessPlanetZod();
                break;

            case "4":
            case "weather":
                await getWeather();
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