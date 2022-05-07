import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { v4 as uuidv4 } from 'uuid';
import packageJson from '../../../package.json';

export const versionCmd = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
//console.log("Command to execute",cmd)

ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={packageJson.version}/>);





    return ret;
}