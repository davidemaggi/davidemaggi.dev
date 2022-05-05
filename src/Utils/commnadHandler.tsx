import commandResult from "../models/CommandResult";
import { help } from "./commnands/help";
import { menu } from "./commnands/menu";

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

    if(commandParts[0]==="ls" || commandParts[0]==="dir" ){
        return menu();
        
    }

    console.log("Executing Command",command)
    
 

return new commandResult();
}