import React from "react"
import MobileButton from "./UI/MobileButton"


const MobileButtons:React.FC<{sendCommandUp:any}> = (props) =>{

    
  

    return (
      <div className="flex flex-col sm:flex-row space-x-2 space-y-2 flex-wrap justify-center mt-2">
      <MobileButton txt={"Commands.whoami"} cmd={"whoami"} sendCommandUp={props.sendCommandUp} />
      <MobileButton txt={"Commands.cv"} cmd={"cv"} sendCommandUp={props.sendCommandUp} />
      <MobileButton txt={"Commands.credits"} cmd={"credits"} sendCommandUp={props.sendCommandUp} />
      <MobileButton txt={"Commands.clear"} cmd={"clear"} sendCommandUp={props.sendCommandUp} />
      
      </div>
    )


}


export default MobileButtons