import React from "react";
import Card from "./UI/Card";
import userImage from "../assets/img/davide.png";
import personalData from "../assets/data/personal";
import { useTranslation } from "../Utils/i18nUtil";
import Flags from "country-flag-icons/react/3x2";
import styles from "../Utils/styles";

const UserInfo: React.FC<{}> = (props) => {
  const { translate, setLanguage } = useTranslation();

  const langHandler = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <div className="p-7 block-section">
      <div className="flex flex-wrap items-center content-center mb-3 justify-between">
        <h2 className={styles.blockTitle}>{translate("Common.Information")} </h2>
        <div className="flex flex-row">
        <Flags.IT title="Italian" className="w-6 h-4 mr-3 cursor-pointer rounded" onClick={langHandler.bind(this,"it")}/>
        <Flags.GB title="English" className="w-6 h-4 cursor-pointer	rounded" onClick={langHandler.bind(this,"en")}/>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-gray-400">{translate("Common.Location")}</div>
          <div className="font-medium text-right text-gray-600">
            {personalData.location}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-400">{translate("Common.BirthDay")}</div>
          <div className="font-medium text-right text-gray-600">
            {personalData.birthDay}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-400">{translate("Common.Experience")}</div>
          <div className="font-medium text-right text-gray-600">
            +{new Date().getFullYear() - 2006} {translate("Common.Years")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
