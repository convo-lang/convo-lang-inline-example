import { convo } from "@convo-lang/convo-lang";
import { readStdInLineAsync } from "@iyio/node-common";

const weatherLambdaUrl='https://6tnpcnzjbtwa5z4qorusxrfaqu0sqqhs.lambda-url.us-east-1.on.aws';

export const weatherForecast=async ()=>{

    console.log('Enter location to get weather for');

    const location=await readStdInLineAsync();

    const getWeatherAsync=async (city:string,state:string)=>{
        const r=await fetch(`${weatherLambdaUrl}/?location=${encodeURIComponent(`${city} ${state}`)}`);
        return {city,state,...await r.json()}
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
