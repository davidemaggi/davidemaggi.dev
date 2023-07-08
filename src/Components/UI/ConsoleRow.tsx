import React from "react";
import { IconContext, IconType } from "react-icons";

import { useTranslation } from "../../Utils/i18nUtil";


const ConsoleRow: React.FC<{
  content?: string;
  isInput?: boolean;
  computerName?: string;
  userName?: string;
  path?: string;
  contentColor?: string;
  prefixColor?: string;
  cursorPos?: number;
  indent?: number;
  showPrefix?: boolean;
  iconColor?: string,
  iconSize?: string,
  link?: string,
  linkText?: string,
  flags?: JSX.Element[],
  icon?: IconType

  onKeyUp?:any,
  onClick?:any,
  handleValueChanged?:any
}> = (props) => {
  ConsoleRow.defaultProps = {
    content: "",
    computerName: "dmdev",
    userName: "guest",
    indent: 0,
    path: "~",
    prefixColor: "text-green-400",
    contentColor: "text-gray-100",
    isInput: false,
    cursorPos: 0,
    icon: undefined,
    iconColor: "white",
    iconSize: "15px",
    link: "",
    linkText: "",
    showPrefix: true,
    flags:[]
  };

  const { translate } = useTranslation();

  let outputIndent=props.indent ? props.indent :0;

  if(props.icon){
    outputIndent++;
  }

  let link=null

  if(props.link && props.link?.length>0){
    link=<a href={props.link} target="_blank" className="social-link-hover"> → {props.linkText && props.linkText ? props.linkText : props.link} </a>
  }


 let ouputContent=(" ".repeat(outputIndent ? outputIndent: 0).concat(props.content? translate(props.content):""));

  let rowText = props.isInput ? (
    <>
    <div id="prompt">
    
    <input onChange={props.handleValueChanged} onClick={props.onClick} onKeyUp={props.onKeyUp} value={props.content} type="text" id="input" autoFocus />
  </div>

    </>
  ) : (
    <span className="whitespace-pre-wrap">{ouputContent}</span>
  );

  return (
    <IconContext.Provider
      value={{ color: props.iconColor, size: props.iconSize }}
    >
    <div className="flex mt-0">
      {props.showPrefix && (
        <span className={[props.prefixColor].join(" ")}>
          {props.userName}@{props.computerName}:{props.path}$
        </span>
      )}

      <p className={[props.contentColor,"flex-1", "typing", "items-center", "pl-2 pr-2", "whitespace-pre-wrap"].join(" ")}>
        {props.icon && <props.icon className="inline"/>}
        {rowText}
        {props.flags?.map((fla)=>fla )}
        {link ? link : null}
        
        
      </p>
    </div>
    </IconContext.Provider>
  );
};

export default ConsoleRow;
