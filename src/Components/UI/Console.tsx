import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useCommandExecutor } from "../../Utils/commnadHandler";
import { insertInString } from "../../Utils/stringUtil";
import ConsoleButtons from "./ConsoleButtons";
import ConsoleRow from "./ConsoleRow";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "../../Utils/i18nUtil";
import { BrowserView, MobileView} from 'react-device-detect';
import MobileButtons from "../MobileButtons";



const ConsoleMain: React.FC<{}> = (props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyLvl, setHistoryLvl] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState<number>(0);
  const [currentCommand, setCurrentCommand] = useState<string>("whoami");
  const [currentUser, setCurrentUser] = useState<string>("guest");
  const [triggerCommand, setTriggerCommand] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [currentComputerName, setCurrentComputerName] =
    useState<string>("dmdev");
  const [currentPath, setCurrentPath] = useState<string>("~");
  
  const { translate, setLanguage,language } = useTranslation();

  const rowAreaRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    rowAreaRef.current?.scrollBy({
      top: rowAreaRef.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [rows]);

  useEffect(() => {
    setCursorPos(currentCommand.length);
    consoleRef.current?.focus();
    setTriggerCommand(true);
  }, []);

  const handleClick = (event: any) => {
    //console.log("Click! ");
  };

  const handleValueChanged = (event:ChangeEvent<HTMLInputElement>) => {
    setCurrentCommand((old) => event.target.value);

  };

  const handleKeyUp = (event: KeyboardEvent) => {
    //console.log("KeyUp! ", event.key);

    if (event.key === "ArrowUp") {
   
        setHistoryLvl((old) =>(old -1 >0 ? old - 1 : 0));
        setCurrentCommand(history[historyLvl]);
      
    }
    if (event.key === "ArrowDown") {
    
        setHistoryLvl((old) => (old + 1 < history.length ? old + 1 : history.length-1));
        setCurrentCommand(history[historyLvl]);
      
    }

    

    if (event.key === "Enter") {
      setHistory((oldArray) => [...oldArray, currentCommand]);

      setRows((oldArray) => [
        ...oldArray,
        <ConsoleRow
          key={uuidv4()}
          userName={currentUser}
          computerName={currentComputerName}
          path={currentPath}
          content={currentCommand}
        />,
      ]);

      if (["clear","cls"].includes(currentCommand.toLowerCase().trim())) {
        setRows([]);
      } 
      else if(["show","menu"].includes(currentCommand.toLowerCase().trim())){
        setShowButtons(old=>!old)
      }
      else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let cmdResult = useCommandExecutor({command:currentCommand, setLanguage:setLanguage, lang:language});
        setRows((oldArray) => [...oldArray, ...cmdResult.rows]);
      }

      setCurrentCommand("");
      setHistoryLvl(history.length);
      return;
    }

    
    scrollToBottom();


    //console.log(historyLvl, history);
  };

  useEffect(() => {

    if(triggerCommand){
      handleKeyUp({key:"Enter"} as KeyboardEvent);
      setTriggerCommand(false);
    } // This is be executed when `loading` state changes
}, [triggerCommand])


  
  const handleButtonCommand = (cmd:string) => {
console.log(cmd)
setCurrentCommand(cmd);

    setTriggerCommand(true);

//HandleKeyPress({key:"Enter"});
  }


  return (
    <>
    <div
    ref={consoleRef}
      className="w-full h-full outline-0"
      //onClick={handleClick}
      //onKeyPress={HandleKeyPress}
      //onKeyUp={handleKeyUp}
      //tabIndex={0}
    >
      <div
        className="coding inverse-toggle px-5 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
              bg-gray-800  pb-6 pt-4 rounded-lg leading-normal overflow-hidden h-4/5 flex flex-col"
      >
        <div className="top mb-2 flex">
          <ConsoleButtons onClickGreen={scrollToBottom} />
        </div>
        <div
          className="overflow-y-auto h-96 flex-grow scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-700"
          ref={rowAreaRef}
        >
          {rows.map((r) => {
            return r;
          })}
          <ConsoleRow
            key={9999999999}
            isInput={true}
            cursorPos={cursorPos}
            userName={currentUser}
            computerName={currentComputerName}
            path={currentPath}
            content={currentCommand}
            onClick={handleClick}
            onKeyUp={handleKeyUp}
            handleValueChanged={handleValueChanged}
            //tabIndex={0}
          />
        </div>
      </div>
      <BrowserView>
     { showButtons && <MobileButtons sendCommandUp={handleButtonCommand} />}
      </BrowserView>
      <MobileView>
      <MobileButtons sendCommandUp={handleButtonCommand} />
      </MobileView>
    </div>
    
    
  
  </>
  );
};

export default ConsoleMain;
