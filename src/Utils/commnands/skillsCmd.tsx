import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { cageLine, emptyLine } from "./utils";

import ConsoleIconsRow from "../../Components/UI/ConsoleIconsRow";
import skilllData from "../../assets/data/skills";

export const skillsCmd = (cmd:string[]=[], lang:string="en"):commandResult => {

let toPrint=[
    {code:"arch",txt:"📏 Skills.Arch"},
    {code:"cloud",txt:"☁️ Skills.Cloud"},
    {code:"dev",txt:"🐛 Skills.Dev"},
    {code:"mobile",txt:"📱 Skills.Mobile"},
    {code:"db",txt:"🗑️ Skills.Db"},
    {code:"nosql",txt:"📝 Skills.NoSql"},
    {code:"cicd",txt:"🧑‍🍳 Skills.CiCd"},
    {code:"misc",txt:"🧻 Skills.Misc"},
];



let ret:commandResult = new commandResult();
//console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(...cageLine("🤹🏻 Skills.Title"));
ret.rows.push(<ConsoleRow key={uuidv4()}  showPrefix={false} content={"Skills.Descr"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(...cageLine("📜 Skills.Certifications"));

skilllData.Certifications.forEach(skill=>{
    ret.rows.push(<ConsoleRow key={uuidv4()} icon={skill.Icon} showPrefix={false} content={skill.Name}/>);
    ret.rows.push(<ConsoleRow key={uuidv4()} contentColor={"text-gray-500"} showPrefix={false} content={"🏫 "+skill.Institute}/>);
    ret.rows.push(...emptyLine(1));

})



toPrint.forEach(item=>{
    ret.rows.push(...cageLine(item.txt));

    ret.rows.push(<ConsoleIconsRow key={uuidv4()} contentColor={"text-gray-300"} showPrefix={false} icons={skilllData.Skills.filter(x=>x.GroupCode===item.code)}/>);

});

ret.rows.push(...emptyLine(1));



    return ret;
}