import IconRowInterface from "./IconRowInterface"
import StackItem from "./StackItemItnterface"

interface ExperienceItem {


    id:string,
    Company:string,
    Logo:string,
    Role:string,
    Location:string,
    Type:string,
    Current:boolean,
    From:string,
    To?:string,
    Description:string,
    DescriptionEng:string,
    Stack?:IconRowInterface[]
}

export default ExperienceItem