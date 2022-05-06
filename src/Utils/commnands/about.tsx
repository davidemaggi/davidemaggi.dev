import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { cageLine, emptyLine } from "./utils";
import personalData from "../../assets/data/personal";
import { MdAlternateEmail } from "react-icons/md";
import { FaBirthdayCake, FaMapMarkerAlt, FaPhoneSquareAlt } from "react-icons/fa";

export const about = (cmd:string[]=[]):commandResult => {

let ret:commandResult = new commandResult();
console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(...cageLine("About.Title"));

ret.rows.push(<ConsoleRow key={uuidv4()} icon={MdAlternateEmail} iconColor={"White"} showPrefix={false} content={personalData.email}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaPhoneSquareAlt} iconColor={"White"} showPrefix={false} content={personalData.phone}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaBirthdayCake} iconColor={"White"} showPrefix={false} content={personalData.birthDay}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaMapMarkerAlt} iconColor={"White"} showPrefix={false} content={personalData.location}/>);

ret.rows.push(...emptyLine(2));

personalData.social.forEach((s)=>{

    ret.rows.push(<ConsoleRow key={uuidv4()} icon={s.icon} link={s.url} iconColor={s.color} showPrefix={false} content={s.name}/>);



});

ret.rows.push(...emptyLine(1));

    return ret;
}