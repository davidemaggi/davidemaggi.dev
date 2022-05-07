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
import { skillsCmd } from "./commnands/skillsCmd";
import Flags from 'country-flag-icons/react/3x2'
import { versionCmd } from "./commnands/versionCmd";


export interface CommandParameters{
    command:string, setLanguage?:any, lang?:string
}

export const useCommandExecutor = (p:CommandParameters):commandResult => {

    

    p.command=p.command.toLowerCase().trim();

    const commandParts=p.command.split(" ");
    //console.log("Executing Command",commandParts)

    if(["dump"].includes(commandParts[0])){
        let tmp= new commandResult();
        tmp.rows.push(...aboutCmd().rows)
        tmp.rows.push(...experienceCmd([],p.lang).rows)
        tmp.rows.push(...skillsCmd().rows)
        tmp.rows.push(...creditsCmd().rows)
        return tmp;
        
    }

    if(["help","menu","h"].includes(commandParts[0])){
        if(commandParts.length>1){

            return helpCmd(commandParts);
        }else{
            return helpCmd();
        }
        
    }

    if(["dir","ls"].includes(commandParts[0])){
        return menuCmd();
        
    }
    if(["v","version"].includes(commandParts[0])){
        return versionCmd();
        
    }

    if(["info","about","whoami", "i","im", "who"].includes(commandParts[0])){
        return aboutCmd();
        
    }

    if(["cert","certs","skill","skills","c","s"].includes(commandParts[0])){
        return skillsCmd();
        
    }

    if(["job","experience","cv","e","work","exp"].includes(commandParts[0])){
        return experienceCmd([],p.lang);
        
    }
 
    if(["credits","dev"].includes(commandParts[0])){
        return creditsCmd();
        
    }

    if(["translate","tr"].includes(commandParts[0])){
        let tmp=new commandResult()
        if(commandParts.length===1){
            
            //Non abbastanza

            

            tmp.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} icon={BiErrorAlt} iconColor={"#a60800"} content={"Translate.Missing"}/>);

        }

        if(["it","en"].includes(commandParts[1])){
            p.setLanguage(commandParts[1]);
            tmp.rows.push(<ConsoleRow key={uuidv4()}  flags={[commandParts[1]==="it" ? <Flags.IT className="inline ml-2" height={"12px"} title="Italiano" /> : <Flags.GB className="inline ml-2" height={"12px"} title="English" />]} showPrefix={false} icon={BsTranslate} content={"Translate.Ok"}/>);

        }else{
            tmp.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} icon={BiErrorAlt} iconColor={"#e60b00"} content={"Translate.Error"}/>);  
        }


        return tmp;
        
    }

return commandParts.length===0 || commandParts[0].trim().length===0 ? new commandResult() : notFoundCmd(commandParts);
}