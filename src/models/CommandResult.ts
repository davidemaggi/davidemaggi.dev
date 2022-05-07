import ConsoleRow from "../Components/UI/ConsoleRow";
import { commandResultEnum } from "./Enums"

class commandResult {


    result:commandResultEnum=commandResultEnum.OK;
    rows:JSX.Element[]=[];
    showPrefix:boolean=false;

    

    
}

export default commandResult