import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { emptyLine, separatorLine } from "./utils";

export const helpCmd = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
//console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Help.Title"}/>);
ret.rows.push(...emptyLine(1));
if(cmd.length>1){
    ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Help.Topic"}/>);
    ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={`${cmd[1]} Help`}/>);
    ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={`Work in Progress!!!`}/>);
}else{
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Help.Topic"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Intro"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Help.DescriptionTitle"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Description"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Help.AvailableCmd"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdAbout ' Help.Commands.cmdAboutDescription"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdCV ' Help.Commands.cmdCVDescription"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdCredits ' Help.Commands.cmdCreditsDescription"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdTranslate ' Help.Commands.cmdTranslateDescription"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdDump ' Help.Commands.cmdDumpDescription"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdClear ' Help.Commands.cmdClearDescription"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdShow ' Help.Commands.cmdShowDescription"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} indent={4} showPrefix={false} content={"Help.Type ' Help.Commands.cmdHelp ' Help.Commands.cmdHelpDescription"}/>);

ret.rows.push(separatorLine(100));
ret.rows.push(...emptyLine(1));
}
    return ret;
}

