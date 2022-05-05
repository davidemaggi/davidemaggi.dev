import commandResult from "../models/CommandResult";
import { help } from "./commnands/help";

export const executeCommand = (command:string):commandResult => {

    command=command.toLowerCase().trim();

    const commandParts=command.split(" ");

    if(commandParts[0]==="help"){
        if(commandParts.length>1){

            return help(commandParts);
        }else{
            return help();
        }
        
    }

    console.log("Executing Command",command)
    
 

return new commandResult();
}