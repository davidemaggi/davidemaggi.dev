import React from "react";

import IconRowInterface from "../../models/IconRowInterface";
import { useTranslation } from "../../Utils/i18nUtil";
import IconRowItem from "./IconRowItem";
import { v4 as uuidv4 } from 'uuid';

const ConsoleIconsRow: React.FC<{
  computerName?: string;
  userName?: string;
  path?: string;
  contentColor?: string;
  prefixColor?: string;
  indent?: number;
  showPrefix?: boolean;
  icons?:IconRowInterface[]

  
}> = (props) => {
    ConsoleIconsRow.defaultProps = {
    computerName: "dmdev",
    userName: "guest",
    indent: 0,
    path: "~",
    prefixColor: "text-green-400",
    contentColor: "text-gray-100",
    showPrefix: true,
  };

  const { translate } = useTranslation();

  let outputIndent=props.indent ? props.indent :0;

 

 

  

  return (
   
    <div className="flex mt-0">
      {props.showPrefix && (
        <span className={[props.prefixColor].join(" ")}>
          {props.userName}@{props.computerName}:{props.path}$
        </span>
      )}

      <p className={[props.contentColor,"flex-1", "typing", "items-center", "pl-2", "whitespace-s-wrap","inline"].join(" ")}>
       {props.icons?.map(i=><IconRowItem key={uuidv4()} item={i}/>)}
      </p>
    </div>
  );
};

export default ConsoleIconsRow;
