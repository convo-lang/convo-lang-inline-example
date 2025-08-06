import { convo } from "@convo-lang/convo-lang";
import z from "zod";


export const weatherForecast=async (location:string):Promise<Forecast>=>{

    const weather=await convo`

        > getWeather(city:string state:string) -> ${getWeatherAsync}

        > user
        Get the weather for the following location:

        <location>${location}</location>
    `

    const forecast=await convo`

        @json ${forecastSchema}
        > user
        Generate a forecast based on the following weather conditions

        <weather-conditions>
        ${weather}
        </weather-conditions>
    `

    return forecast;
}

const weatherLambdaUrl='https://6tnpcnzjbtwa5z4qorusxrfaqu0sqqhs.lambda-url.us-east-1.on.aws';

const getWeatherAsync=async (city:string,state:string)=>{
    const r=await fetch(`${weatherLambdaUrl}/?location=${encodeURIComponent(`${city} ${state}`)}`);
    return {city,state,...await r.json()}
}

const forecastSchema=z.object({
    temperature:z.number().describe('temperature in fahrenheit'),
    chanceOfRain:z.number().describe('Chance of rain as percentage ranging 0 to 1'),
    description:z.string().describe('General description of the forecast'),
});

type Forecast=z.infer<typeof forecastSchema>;