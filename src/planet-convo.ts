import { convo } from "@convo-lang/convo-lang";
import { readStdInLineAsync } from "@iyio/node-common";

export const guessPlanetConvo=async ()=>{

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