import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { cageLine, emptyLine, multilineRows } from "./utils";
import ExperienceData from "../../assets/data/experience";
import ConsoleIconsRow from "../../Components/UI/ConsoleIconsRow";

export const experienceCmd = (cmd:string[]=[], lang:string="en"):commandResult => {

let ret:commandResult = new commandResult();
//console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(...cageLine("💼 Experience.Title"));

ExperienceData.forEach(exp=>{
    ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={exp.Role}/>);
    ret.rows.push(<ConsoleRow key={uuidv4()} contentColor={"text-gray-500"} showPrefix={false} content={"🏢 "+exp.Company}/>);
    ret.rows.push(<ConsoleRow key={uuidv4()} contentColor={"text-gray-500"} showPrefix={false} content={["📅",exp.From,"-",exp.Current ? "Experience.Current" : exp.To].join(" ")}/>);
    ret.rows.push(...multilineRows(lang==="it" ? exp.Description.split("\n"):exp.DescriptionEng.split("\n"), "text-gray-300"));
    ret.rows.push(<ConsoleIconsRow key={uuidv4()} showPrefix={false} icons={exp.Stack}/>);

    ret.rows.push(...emptyLine(1));

})



    return ret;
}