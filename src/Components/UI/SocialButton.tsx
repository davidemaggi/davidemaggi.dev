import React from "react"
import { IconContext, IconType } from "react-icons"
import { BsFacebook } from "react-icons/bs"

const SocialButton:React.FC<{icon:IconType, url:string}> = (props) =>{

    return (
        <li>
        <IconContext.Provider value={{ className: "text-2xl" }}>
          <a href={props.url} target="_blank" className="social-link-hover">
            <props.icon />
          </a>
        </IconContext.Provider>
      </li>
    )


}


export default SocialButton