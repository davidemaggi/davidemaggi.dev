import React from "react"

const ConsoleButtons:React.FC<{onClickGreen:any}> = (props) =>{


    

    return (
<>
          <div  className="h-3 w-3 bg-red-500 rounded-full"></div>
          <div className="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
          <div onClick={props.onClickGreen} className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
     </>

    )


}


export default ConsoleButtons