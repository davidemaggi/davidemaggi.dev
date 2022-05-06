import commandResult from "../models/CommandResult";
import { contact } from "./commnands/contact";
import { credits } from "./commnands/credits";
import { experience } from "./commnands/experience";
import { help } from "./commnands/help";
import { menu } from "./commnands/menu";
import { notFound } from "./commnands/notFound";

export const executeCommand = (command:string):commandResult => {

    command=command.toLowerCase().trim();

    const commandParts=command.split(" ");
    console.log("Executing Command",commandParts)

    if(commandParts[0]==="help"){
        if(commandParts.length>1){

            return help(commandParts);
        }else{
            return help();
        }
        
    }

    if(["dir","ls"].includes(commandParts[0])){
        return menu();
        
    }

    if(["info","about","whoami"].includes(commandParts[0])){
        return contact();
        
    }

    if(["job","experience","cv"].includes(commandParts[0])){
        return experience();
        
    }
 
    if(["credits"].includes(commandParts[0])){
        return credits();
        
    }

return commandParts.length===0 || commandParts[0].trim().length===0 ? new commandResult() : notFound(commandParts);
}