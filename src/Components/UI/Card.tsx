import React from "react"

const Card:React.FC<{}> = (props) =>{

    return (
        <div className='shadow rounded-xl overflow-hidden'>
                   {props.children}
                </div>
    )


}


export default Card