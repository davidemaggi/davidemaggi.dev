import ConsoleRow from "../Components/UI/ConsoleRow";
import commandResult from "../models/CommandResult";
import { about } from "./commnands/about";
import { credits } from "./commnands/credits";
import { experience } from "./commnands/experience";
import { help } from "./commnands/help";
import { menu } from "./commnands/menu";
import { notFound } from "./commnands/notFound";

import { v4 as uuidv4 } from "uuid";
import { BsTranslate } from "react-icons/bs";
import { BiErrorAlt } from "react-icons/bi";


export interface CommandParameters{
    command:string, setLanguage?:any
}

export const useCommandExecutor = (p:CommandParameters):commandResult => {

    

    p.command=p.command.toLowerCase().trim();

    const commandParts=p.command.split(" ");
    //console.log("Executing Command",commandParts)

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
        return about();
        
    }

    if(["job","experience","cv"].includes(commandParts[0])){
        return experience();
        
    }
 
    if(["credits"].includes(commandParts[0])){
        return credits();
        
    }

    if(["translate"].includes(commandParts[0])){
        let tmp=new commandResult()
        if(commandParts.length===1){
            
            //Non abbastanza

            

            tmp.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} icon={BiErrorAlt} iconColor={"#a60800"} content={"Translate.Missing"}/>);

        }

        if(["it","en"].includes(commandParts[1])){
            p.setLanguage(commandParts[1]);
            tmp.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} icon={BsTranslate} content={"Translate.Ok"}/>);

        }else{
            tmp.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} icon={BiErrorAlt} iconColor={"#e60b00"} content={"Translate.Error"}/>);  
        }


        return tmp;
        
    }

return commandParts.length===0 || commandParts[0].trim().length===0 ? new commandResult() : notFound(commandParts);
}