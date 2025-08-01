import { convo } from "@convo-lang/convo-lang";
import { createJsonRefReplacer } from "@iyio/common";

const weatherLambdaUrl='https://6tnpcnzjbtwa5z4qorusxrfaqu0sqqhs.lambda-url.us-east-1.on.aws';

export const convert=async ()=>{

    const favorites:string[]=[];

    const saveFavorite=async (name:string)=>{
        favorites.push(name);
        return `${name} saved to favorites`
    }

    const hint='it\'s dead inside'

    const conversation=convo`

        # Saves the user's favorite planet by name
        > saveFavorite(name:string) -> ${saveFavorite}

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

        
        > user
        Guess the planet based on the following hint:

        <hint>${hint}</hint>

        @format json
        > assistant
        {
            "name": "Mars",
            "distanceFromSunMiles": 141600000,
            "description": "Mars is known as the 'Red Planet' and is the fourth planet from the Sun in our solar system. Once believed to have had liquid water on its surface, Mars is now a cold, barren desert with almost no geological or biological activity.",
            "commentAboutHint": "If we're talking 'dead inside,' Mars takes the cake—it's basically the solar system's champion at being lifeless!",
            "hintSentiment": "sad"
        }

        > user
        Save it to my favorites

        @toolId call_ps6AVAvrS44eHmimS73iL4BM
        > call saveFavorite(
            "name": "Mars"
        )
        > result
        __return="Mars saved to favorites"

        > assistant
        Mars has been saved to your favorites! If you ever want more fun or facts about your favorite "dead inside" planet, just let me know.
    `;

    const convoSource=conversation.getInput();

    const flat=await conversation.flattenAsync();

    const converted=await conversation.convertAsync();
    

    console.log('-----------------------------------------------------');
    console.log(`## Convo Source\n        ${convoSource}`);
    console.log('-----------------------------------------------------');
    console.log('## Flattened messages\n',JSON.stringify(flat.messages,createJsonRefReplacer(),4));
    console.log('-----------------------------------------------------');
    console.log('## Converted to OpenAI standard\n',JSON.stringify(converted,null,4));
    console.log('-----------------------------------------------------');

}
