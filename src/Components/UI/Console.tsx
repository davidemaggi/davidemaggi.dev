import React, { useEffect, useRef, useState } from "react";
import { useCommandExecutor } from "../../Utils/commnadHandler";
import { insertInString } from "../../Utils/stringUtil";
import ConsoleButtons from "./ConsoleButtons";
import ConsoleRow from "./ConsoleRow";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "../../Utils/i18nUtil";



const ConsoleMain: React.FC<{}> = (props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyLvl, setHistoryLvl] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState<number>(0);
  const [currentCommand, setCurrentCommand] = useState<string>("whoami");
  const [currentUser, setCurrentUser] = useState<string>("guest");
  const [currentComputerName, setCurrentComputerName] =
    useState<string>("dmdev");
  const [currentPath, setCurrentPath] = useState<string>("~");
  
  const { translate, setLanguage } = useTranslation();

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
  }, []);

  const handleClick = (event: any) => {
    //console.log("Click! ");
  };

  const HandleKeyPress = (event: any) => {
    //console.log("enter press here! ", event.key);

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

      if (currentCommand.toLowerCase().trim() === "clear") {
        setRows([]);
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let cmdResult = useCommandExecutor({command:currentCommand, setLanguage:setLanguage});
        setRows((oldArray) => [...oldArray, ...cmdResult.rows]);
      }

      setCurrentCommand("");
      setHistoryLvl(history.length);
      return;
    }

    setCurrentCommand((old) => insertInString(event.key, old, cursorPos));
    setCursorPos((old) => old + 1);
    scrollToBottom();

  };

  const handleKeyUp = (event: any) => {
    //console.log("KeyUp! ", event.key);

    if (event.key === "ArrowUp") {
   
        setHistoryLvl((old) =>(old -1 >0 ? old - 1 : 0));
        setCurrentCommand(history[historyLvl]);
        setCursorPos(currentCommand.length);
      
    }
    if (event.key === "ArrowDown") {
    
        setHistoryLvl((old) => (old + 1 < history.length ? old + 1 : history.length-1));
        setCurrentCommand(history[historyLvl]);
        setCursorPos(currentCommand.length);
      
    }

    if (event.key === "Backspace") {
      setCurrentCommand((old) => old.slice(0, -1));
      setCursorPos((old) => (old - 1 >= 0 ? old - 1 : 0));
    }

    if (event.key === "ArrowLeft") {
      setCursorPos((old) => (old - 1 >= 0 ? old - 1 : 0));
    }
    if (event.key === "ArrowRight") {
      setCursorPos((old) =>
        old + 1 <= currentCommand.length ? old + 1 : currentCommand.length
      );
    }

    //console.log(historyLvl, history);
  };

  return (
    <div
    ref={consoleRef}
      className="w-full h-full outline-0"
      onClick={handleClick}
      onKeyPress={HandleKeyPress}
      onKeyUp={handleKeyUp}
      tabIndex={0}
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
          />
        </div>
      </div>
    </div>
  );
};

export default ConsoleMain;
