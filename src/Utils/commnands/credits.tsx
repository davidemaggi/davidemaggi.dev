import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { FaReact,FaAws } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { cageLine, emptyLine } from "./utils";

export const credits = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(...cageLine("Credits"));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"How this site has been made?"}/>);

ret.rows.push(...emptyLine(1));


ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaReact} link={"https://reactjs.org"} iconColor={"Aqua"} showPrefix={false} content={"ReactJS"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={SiTailwindcss} link={"https://tailwindcss.com"} iconColor={"#6495ED"} showPrefix={false} content={"Tailwind"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaAws} link={"https://aws.amazon.com"} iconColor={"#FF9900"} showPrefix={false} content={"Deployed on AWS"}/>);

ret.rows.push(...emptyLine(1));



    return ret;
}