import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { FaReact,FaDocker } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { cageLine, emptyLine } from "./utils";
import Flags from 'country-flag-icons/react/3x2'
import packageJson from '../../../package.json';

export const creditsCmd = (cmd:string[]=[]):commandResult => {


    
let ret:commandResult = new commandResult();
//console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(...cageLine("Credits.Title" ));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Credits.Description"}/>);

ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"Version # "+packageJson.version}/>);
ret.rows.push(...emptyLine(1));


ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaReact} link={"https://reactjs.org"} iconColor={"Aqua"} showPrefix={false} content={"ReactJS"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={SiTailwindcss} link={"https://tailwindcss.com"} iconColor={"#6495ED"} showPrefix={false} content={"Tailwind"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaDocker} link={"https://www.docker.com/"} iconColor={"Aqua"} showPrefix={false} content={"Deployed on my server"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} flags={[<Flags.IT className="inline ml-2" height={"12px"} title="Italy" />]} showPrefix={false} content={"Credits.Msg"}/>);
ret.rows.push(...emptyLine(1));



    return ret;
}