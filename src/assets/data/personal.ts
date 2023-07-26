import { BsFacebook } from "react-icons/bs";
import { FaBlog, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiTwitter } from "react-icons/si";

const personalData={
    fullName:"Davide Maggi",
    email:"me[at]davidemaggi.dev",
    birthDay:"28/04/1987",
    location:"Rapallo, Genova (Italy)",
    phone:"About.Phone",

    social:[
        {name:"Blog",url:"https://bearbytes.dev", icon:FaBlog, color:"#FF6B01"},
        {name:"davide.maggi87",url:"https://www.facebook.com/davide.maggi87", icon:BsFacebook, color:"#4867aa"},
        {name:"@DavideMaggi",url:"https://twitter.com/DavideMaggi", icon:SiTwitter, color:"#1c99e6"},
        {name:"davidemaggi",url:"https://www.linkedin.com/in/davidemaggi", icon:FaLinkedin, color:"#0961b8"},
        {name:"davidemaggi",url:"https://github.com/davidemaggi", icon:FaGithub, color:"#FFFFFF"},
    ]
}


export default personalData;