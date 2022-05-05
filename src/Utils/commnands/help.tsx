import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { emptyLine, separatorLine } from "./utils";

export const help = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Welcome to the dmdev console."}/>);
ret.rows.push(...emptyLine(1));
if(cmd.length>1){
    ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"TOPIC"}/>);
    ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={`    ${cmd[1]} Help`}/>);
}else{
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"TOPIC"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    dmdev Help System"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"SHORT DESCRIPTION"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    This is my personal Website"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"AVAILABLE COMMNADS"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    Type 'clear' to clear the console."}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    Type 'exit' to exit the console."}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    Type 'about' to see the about page."}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    Type 'version' to see the version."}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    Type 'credits' to see the credits."}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"    Type 'contact' to see the contact page."}/>);
ret.rows.push(separatorLine(100));
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Type 'help <command>' to see the help page for a command."}/>);
}
    return ret;
}