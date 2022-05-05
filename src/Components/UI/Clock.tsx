import moment from "moment"
import React from "react"


const Clock:React.FC<{}> = (props) =>{

  

    return (
        <div className="flex flex-col h-full w-full">
	<div className="text-right text-white w-full h-6">{moment().format('LT')}</div>
	<div className="text-right text-white w-full h-6">{moment().format('l')}</div>
</div>
    )


}


export default Clock