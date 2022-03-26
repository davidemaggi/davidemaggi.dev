import React from "react";
import { IconContext } from "react-icons";
import { BsFacebook } from "react-icons/bs";
import personalData from "../assets/data/personal";
import { useTranslation } from "../Utils/i18nUtil";
import SocialButton from "./UI/SocialButton";

const SocialButtons: React.FC<{}> = (props) => {
  const { translate, setLanguage } = useTranslation();

  return (
    <ul className="flex space-x-5">
      {personalData.social.map(social=><SocialButton key={social.name} icon={social.icon} url={social.url}/>)}
     

    </ul>
  );
};

export default SocialButtons