import React from "react";

const ConsoleRow: React.FC<{
  content?: string;
  isInput?: boolean;
  computerName?: string;
  userName?: string;
  path?: string;
  cursorPos?: number;
  showPrefix?: boolean;
}> = (props) => {
    ConsoleRow.defaultProps = {
    content: "",
    computerName: "dmdev",
    userName: "guest",
    path: "~",
    isInput: false,
    cursorPos:0,
    showPrefix:true
  };

  let rowText= props.isInput 
  ?  <><span>{props.content?.substring(0,props.cursorPos)}</span><span className="blink">|</span><span>{props.content?.substring(props.cursorPos? props.cursorPos : 0 )}</span></>
  : <span className="whitespace-pre-wrap">{props.content}</span>;


  return (
    <div className="flex mt-0">
     {props.showPrefix && <span className="text-green-400">
        {props.userName}@{props.computerName}:{props.path}$
      </span>
      }
      <p className="flex-1 typing items-center pl-2">
{rowText}
         
      </p>
    </div>
  );
};

export default ConsoleRow;
