# convo-lang-inline-example
Example of using the `convo` tagged template literal function to execute async prompts inline with TypeScript.

The `convo` tagged template literal function is a very powerful function capable of converting a 
template literal string into fully featured [Convo-Lang](https://learn.convo-lang.ai/) script with embedded data types and functions.
Functions passed into the template literal used the with `convo` function are able to be directly
called by LLMs and agents and Zod schema can be used to return structured data.

To Learn more about Convo-Lang visit https://learn.convo-lang.ai/

## Setup
``` sh
npm install
```

## Run Examples
``` sh
npm run start
```

## Examples
Syntax highlighting is provided by the [Convo-Lang VSCode extension](https://marketplace.visualstudio.com/items?itemName=IYIO.convo-lang-tools).

Search "Convo-Lang" in the extensions panel to install

### Guess Planet Zod
Guesses a planet based on a hint and return structured data based on Zod schema

![planet-zod](https://raw.githubusercontent.com/convo-lang/convo-lang-inline-example/refs/heads/main/images/planet-zod.png)

> input: Hot and  dead inside
``` js
{
  name: 'Mercury',
  distanceFromSunMiles: 35980000,
  description: "Mercury is the closest planet to the Sun and has an extremely hot surface during the day, but with no atmosphere to trap heat. It's small, rocky, and geologically inactive—hence, 'dead inside.'",
  commentAboutHint: 'I see what you did there—Mercury is definitely hot and about as dead inside as a Monday morning!',
}
```

----------------------------------------------------------------------

### Guess Planet Convo
Guesses a planet based on a hint and return structured data based on Convo struct

![planet-convo](https://raw.githubusercontent.com/convo-lang/convo-lang-inline-example/refs/heads/main/images/planet-convo.png)

> input: Beautiful rings

Output: 
``` js
{
  name: 'Saturn',
  distanceFromSunMiles: 886000000,
  description: "Saturn is the sixth planet from the Sun and is best known for its stunning system of icy rings. It's a gas giant with a beautiful yellowish hue and dozens of fascinating moons.",
  commentAboutHint: 'Those rings are so fancy, Saturn probably gets invited to all the planet parties.',
  hintSentiment: 'happy'
}
```

----------------------------------------------------------------------

### Weather Forecast
Gives a weather forecast for a location using a function call and chaining of prompts

![weather](https://raw.githubusercontent.com/convo-lang/convo-lang-inline-example/refs/heads/main/images/weather.png)

> input: The biggest city in the sunshine state

Output:
``` js
{
  city: 'Jacksonville',
  state: 'Florida',
  data: {
    time: '2025-08-01T21:16:00Z',
    values: {
      altimeterSetting: 1017.48,
      cloudBase: 16,
      cloudCeiling: 16,
      cloudCover: 13,
      dewPoint: 19.8,
      freezingRainIntensity: 0,
      humidity: 43,
      precipitationProbability: 0,
      pressureSeaLevel: 1017.73,
      pressureSurfaceLevel: 1017.21,
      rainIntensity: 0,
      sleetIntensity: 0,
      snowIntensity: 0,
      temperature: 34.3,
      temperatureApparent: 36.7,
      uvHealthConcern: 1,
      uvIndex: 3,
      visibility: 16,
      weatherCode: 1100,
      windDirection: 231,
      windGust: 7.3,
      windSpeed: 4.7
    }
  },
  location: {
    lat: 30.332183837890625,
    lon: -81.65564727783203,
    name: 'Jacksonville, Duval County, Florida, United States',
    type: 'administrative'
  }
}
```

``` txt
Weather report Sure thing! Here’s your Jacksonville, Florida weather report:

Right now, it’s mostly clear with only about 13% cloud cover. The temperature is a hot 34.3°C (about 94°F), but with humidity factored in, it feels more like 36.7°C (98°F). Humidity is at 43%, so you'll definitely feel the heat, but the chance of rain is zero—so leave the umbrella at home!

Winds are coming from the southwest at around 4.7 km/h, with occasional gusts up to 7.3 km/h. Visibility is excellent at 16 km, and the UV index is moderate at 3, so a little sunscreen is a good idea if you’re heading outside this evening.

All in all, it’s a hot, clear evening in Jacksonville with no rain in sight. Stay hydrated and stay cool!
```

----------------------------------------------------------------------

### List Directory
Lists a directory's contents and filters with a Regex

![ls](https://raw.githubusercontent.com/convo-lang/convo-lang-inline-example/refs/heads/main/images/ls.png)

Output:
``` js
{
  list: [ 'data-uri-to-buffer', 'date-fns', 'diff', 'dotenv', 'zod' ],
  pattern: '^[dz].*'
}
```

----------------------------------------------------------------------

### Convert
Converts a prompt written in convo format to the OpenAI standard

![convert](https://raw.githubusercontent.com/convo-lang/convo-lang-inline-example/refs/heads/main/images/convert.png)

Converted to OpenAI standard:
``` json
{
    "model": "gpt-4.1",
    "stream": false,
    "messages": [
        {
            "role": "user",
            "content": "Guess the planet based on the following hint:\n\n<hint>it's dead inside</hint>"
        },
        {
            "role": "assistant",
            "content": "{\n    \"name\": \"Mars\",\n    \"distanceFromSunMiles\": 141600000,\n    \"description\": \"Mars is known as the 'Red Planet' and is the fourth planet from the Sun in our solar system. Once believed to have had liquid water on its surface, Mars is now a cold, barren desert with almost no geological or biological activity.\",\n    \"commentAboutHint\": \"If we're talking 'dead inside,' Mars takes the cake—it's basically the solar system's champion at being lifeless!\",\n    \"hintSentiment\": \"sad\"\n}"
        },
        {
            "role": "user",
            "content": "Save it to my favorites"
        },
        {
            "role": "assistant",
            "content": null,
            "tool_calls": [
                {
                    "id": "call_ps6AVAvrS44eHmimS73iL4BM",
                    "type": "function",
                    "function": {
                        "name": "saveFavorite",
                        "arguments": "{\"name\":\"Mars\"}"
                    }
                }
            ]
        },
        {
            "role": "tool",
            "tool_call_id": "call_ps6AVAvrS44eHmimS73iL4BM",
            "content": "function-called"
        },
        {
            "role": "assistant",
            "content": "Mars has been saved to your favorites! If you ever want more fun or facts about your favorite \"dead inside\" planet, just let me know."
        }
    ],
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "saveFavorite",
                "description": "Saves the user's favorite planet by name",
                "parameters": {
                    "type": "object",
                    "required": [
                        "name"
                    ],
                    "properties": {
                        "name": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    ]
}
```