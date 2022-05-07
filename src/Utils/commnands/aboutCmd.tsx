import ConsoleRow from "../../Components/UI/ConsoleRow";
import commandResult from "../../models/CommandResult";
import { commandResultEnum } from "../../models/Enums";
import { v4 as uuidv4 } from 'uuid';
import { cageLine, emptyLine } from "./utils";
import personalData from "../../assets/data/personal";
import { MdAlternateEmail, MdOutlineTranslate } from "react-icons/md";
import { FaBirthdayCake, FaInfoCircle, FaMapMarkerAlt, FaPhoneSquareAlt, FaTelegramPlane } from "react-icons/fa";
import Flags from 'country-flag-icons/react/3x2'
export const aboutCmd = (cmd:string[]=[], lang:string="en"):commandResult => {

let ret:commandResult = new commandResult();
//console.log("Command to execute",cmd)
ret.result=commandResultEnum.INFO;
ret.rows.push(...cageLine("About.Title"));
ret.rows.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={"About.About"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} icon={MdAlternateEmail} iconColor={"White"} showPrefix={false} content={personalData.email}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaPhoneSquareAlt} iconColor={"White"} showPrefix={false} content={personalData.phone}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaBirthdayCake} iconColor={"White"} showPrefix={false} content={personalData.birthDay}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaMapMarkerAlt} iconColor={"White"} showPrefix={false} content={personalData.location}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} icon={MdOutlineTranslate} iconColor={"White"} flags={[<Flags.IT className="inline ml-2" height={"12px"} title="Italian" />,<Flags.GB className="inline ml-2" height={"12px"} title="English" />,<Flags.FR className="inline ml-2" height={"12px"} title="French" />,<Flags.ES className="inline ml-2" height={"12px"} title="Spanish" />]} showPrefix={false} content={""}/>);

ret.rows.push(...emptyLine(1));



personalData.social.forEach((s)=>{

    ret.rows.push(<ConsoleRow key={uuidv4()} icon={s.icon} link={s.url} iconColor={s.color} showPrefix={false} content={s.name}/>);



});
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} flags={[<Flags.IT className="inline ml-2" height={"12px"} title="Italy" />]} showPrefix={false} content={"Credits.Msg"}/>);
ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} flags={[<Flags.UA className="inline ml-2" height={"12px"} title="Ukraine" />]} link={"https://dona.savethechildren.it/fondo-emergenze-ucraina"} showPrefix={false} content={"Credits.Support"}/>);
ret.rows.push(<ConsoleRow key={uuidv4()} flags={[<Flags.UA className="inline ml-2" height={"12px"} title="Ukraine" />]} icon={FaTelegramPlane} iconColor="#1c93e3" link={"https://t.me/s/itarmyofukraine2022"} showPrefix={false} content={"Credits.Support2"}/>);

ret.rows.push(...emptyLine(1));
ret.rows.push(<ConsoleRow key={uuidv4()} icon={FaInfoCircle} showPrefix={false} content={"About.Help"}/>);

ret.rows.push(...emptyLine(1));

    return ret;
}