import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';

export const notFoundCmd = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
console.log("Command to execute",cmd)
ret.result=commandResultEnum.ERROR;
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={`${cmd[0]}: command not found`}/>);





    return ret;
}