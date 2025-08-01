import { convo } from "@convo-lang/convo-lang";
import { readdir } from "fs/promises";


export const listDirectory=async ()=>{

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