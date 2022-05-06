import ConsoleRow from "../Components/UI/ConsoleRow";
import commandResult from "../models/CommandResult";
import { aboutCmd } from "./commnands/aboutCmd";
import { creditsCmd } from "./commnands/creditsCmd";
import { experienceCmd } from "./commnands/experienceCmd";
import { helpCmd } from "./commnands/helpCmd";
import { menuCmd } from "./commnands/menuCmd";
import { notFoundCmd } from "./commnands/notFoundCmd";

import { v4 as uuidv4 } from "uuid";
import { BsTranslate } from "react-icons/bs";
import { BiErrorAlt } from "react-icons/bi";


export interface CommandParameters{
    command:string, setLanguage?:any, lang?:string
}

export const useCommandExecutor = (p:CommandParameters):commandResult => {

    

    p.command=p.command.toLowerCase().trim();

    const commandParts=p.command.split(" ");
    //console.log("Executing Command",commandParts)

    if(commandParts[0]==="help"){
        if(commandParts.length>1){

            return helpCmd(commandParts);
        }else{
            return helpCmd();
        }
        
    }

    if(["dir","ls"].includes(commandParts[0])){
        return menuCmd();
        
    }

    if(["info","about","whoami"].includes(commandParts[0])){
        return aboutCmd();
        
    }

    if(["job","experience","cv"].includes(commandParts[0])){
        return experienceCmd([],p.lang);
        
    }
 
    if(["credits"].includes(commandParts[0])){
        return creditsCmd();
        
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

return commandParts.length===0 || commandParts[0].trim().length===0 ? new commandResult() : notFoundCmd(commandParts);
}