import React from "react"
import { IconContext } from "react-icons";
import IconRowInterface from "../../models/IconRowInterface";
import { useTranslation } from "../../Utils/i18nUtil";


const IconRowItem:React.FC<{ item:IconRowInterface}> = (props) =>{

    const { translate } = useTranslation();


  
  
  let iconSize=props.item.Size ? props.item.Size : "17px";
  let textColor=props.item.TextColor ? props.item.TextColor : "text-gray-500";
  let iconColor=props.item.Color ? props.item.Color : "text-gray-100";
  //console.log(iconColor)
    return (

        <IconContext.Provider
        value={{ color: iconColor, size: iconSize }}
      >
        
      <span className={["inline","mr-2"].join(" ")}>{props.item.Icon && <props.item.Icon className={["inline",iconColor].join(" ")}/>}</span>
      <span className={["inline","mr-2",textColor].join(" ")}>{props.item.Name} </span>
      
      </IconContext.Provider>

    )


}


export default IconRowItem