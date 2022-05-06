import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';

export const menuCmd = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Total 4"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"drwxr-xr-x  5 davide davide   4096 Oct 12  2019 ."}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"drwxr-xr-x 11 davide davide   4096 Mar  7 12:43 .."}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"-rw-r--r--  1 davide davide   1083 Oct  9  2019 ABOUT.TXT"}/>);




    return ret;
}