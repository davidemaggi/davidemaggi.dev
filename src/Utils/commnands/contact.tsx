import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';

export const contact = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Ciao! 👋"}/>);




    return ret;
}