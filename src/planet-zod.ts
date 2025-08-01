import { convo } from "@convo-lang/convo-lang";
import { readStdInLineAsync } from "@iyio/node-common";
import z from "zod";

export const guessPlanetZod=async ()=>{

    console.log('Give me a hint about a planet you are thinking of');

    const hint=await readStdInLineAsync();

    const planetSchema=z.object({
        name:z.string(),
        distanceFromSunMiles:z.number(),
        description:z.string(),
        commentAboutHint:z.string()
            .describe("A funny comment about the user's hint"),
        hintSentiment:z
            .union([
                z.literal("happy"),z.literal("sad"),
                z.literal("mad"),z.literal("neutral")
            ]).describe('The sentiment of the hint')
    })

    const planet=await convo`

        @json ${planetSchema}
        > user
        Guess the planet based on the following hint:

        <hint>${hint}</hint>
    `

    console.log('Planet',planet);

}