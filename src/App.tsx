import { useRef } from "react";
import "./App.css";
import ConsoleMain from "./Components/UI/Console";

function App() {





  return (
<div className="flex flex-col justify-center items-center h-screen ">
	<div className="flex items-center content-center justify-center w-full h-24 flex-none">&nbsp;</div>
	<div className="flex items-center content-center justify-center w-full flex-grow">
  <div className="m-auto w-2/3 h-full">
          <ConsoleMain  />
        </div>
  </div>
	<div className="flex items-center content-center justify-center w-full h-12 flex-none">
  &nbsp;
  </div>
</div>

   
  );
}

export default App;
