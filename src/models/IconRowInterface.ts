import { IconType } from "react-icons";

class IconRowInterface {

    Name?:string;
    Institute?:string;
    Date?:string;
    Icon?:IconType;
    Color?:string;
    TextColor?:string;
    Link?:string;
    Size?:string="15px";
    Tooltip?:boolean=false;
    Favourite?:boolean=true;
    Group?:string="";
    GroupCode?:string="";
    Level?:number=0;
    
}

export default IconRowInterface