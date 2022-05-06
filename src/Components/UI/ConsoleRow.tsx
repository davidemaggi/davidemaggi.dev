import React from "react";
import { IconContext, IconType } from "react-icons";
import { BsFacebook, BsArrowRight} from "react-icons/bs";
import { MdOpenInNew} from "react-icons/md";
import { useTranslation } from "../../Utils/i18nUtil";

const ConsoleRow: React.FC<{
  content?: string;
  isInput?: boolean;
  computerName?: string;
  userName?: string;
  path?: string;
  cursorPos?: number;
  indent?: number;
  showPrefix?: boolean;
  iconColor?: string,
  iconSize?: string,
  link?: string,
  linkText?: string,
  icon?: IconType;
}> = (props) => {
  ConsoleRow.defaultProps = {
    content: "",
    computerName: "dmdev",
    userName: "guest",
    indent: 0,
    path: "~",
    isInput: false,
    cursorPos: 0,
    icon: undefined,
    iconColor: "white",
    iconSize: "15px",
    link: "",
    linkText: "",
    showPrefix: true,
  };

  const { translate } = useTranslation();

  let outputIndent=props.indent ? props.indent :0;

  if(props.icon){
    outputIndent++;
  }

  let link=null

  if(props.link && props.link?.length>0){
    link=<a href={props.link} target="_blank" className="social-link-hover"> ➡️ {props.linkText && props.linkText ? props.linkText : props.link} </a>
  }


 let ouputContent=(" ".repeat(outputIndent ? outputIndent: 0).concat(props.content? translate(props.content):""));

  let rowText = props.isInput ? (
    <>
      <span>{props.content?.substring(0, props.cursorPos)}</span>
      <span className="blink">|</span>
      <span>
        {props.content?.substring(props.cursorPos ? props.cursorPos : 0)}
      </span>
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
        <span className="text-green-400">
          {props.userName}@{props.computerName}:{props.path}$
        </span>
      )}

      <p className="flex-1 typing items-center pl-2 whitespace-pre-wrap">
        {props.icon && <props.icon className="inline"/>}
        {rowText}
        {link ? link : null}
      </p>
    </div>
    </IconContext.Provider>
  );
};

export default ConsoleRow;
