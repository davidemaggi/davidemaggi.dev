import React from "react"
import { useTranslation } from "../../Utils/i18nUtil";


const MobileButton:React.FC<{sendCommandUp:any, cmd:string, txt:string, color?:string, colorSecond?:string, colorActive?:string}> = (props) =>{

    const { translate } = useTranslation();


    MobileButton.defaultProps = {
      
       color:"bg-blue-600",
       colorActive:"bg-blue-800",
       colorSecond:"bg-blue-700",
      };

    let styles=`inline-block px-6 py-2.5 ${props.color} text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:${props.colorSecond} hover:shadow-lg focus:${props.colorSecond} focus:shadow-lg focus:outline-none focus:ring-0 active:${props.colorActive} active:shadow-lg transition duration-150 ease-in-out`;
  

    return (

        <button className={styles} onClick={()=>props.sendCommandUp(props.cmd)}>{translate(props.txt)}</button>

    )


}


export default MobileButton