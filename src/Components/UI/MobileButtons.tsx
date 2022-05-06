import React from "react"


const MobileButtons:React.FC<{sendCommandUp:any}> = (props) =>{

    
  

    return (
        <div className="flex space-x-2 justify-center mt-2">
        <button className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={()=>props.sendCommandUp("whoami")}>Whoami</button>
        <button className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={()=>props.sendCommandUp("credits")}>Credits</button>
      </div>
    )


}


export default MobileButtons