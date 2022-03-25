import React from "react";
import Card from "./UI/Card";
import userImage from "../assets/img/davide.png";
import personalData from "../assets/data/personal";
import { useTranslation } from "../Utils/i18nUtil";


const UserCard: React.FC<{}> = (props) => {

    const {translate, setLanguage, currentLanguage, languages} = useTranslation();

const testHandler=()=>{

    setLanguage("en")

    console.log(translate("AAAAA"))

}

console.log(currentLanguage,languages)

  return (
    <Card>
      <div className={`h-32 bg-cover header`}></div>
      <div className="pt-14 p-7 bg-white relative">
        <span className="status-badge bg-gray-400">Busy</span>
        <a href="/personal_cv/">
          <img src={userImage} alt="Avatar" className="user-photo" />
        </a>
        <div className="text-lg font-semibold mb-1.5">{personalData.fullName}</div>
        <div className="text-sm text-gray-400 mb-7">Senior Developer</div>
        <div className="flex group">
          <button className="download-btn" onClick={testHandler}>Download CV</button>
          <button className="download-btn-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
