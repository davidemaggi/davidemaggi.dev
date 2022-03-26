import React from "react";

import { useTranslation } from "../Utils/i18nUtil";
import ExperienceItem from "./UI/ExperienceItem";

import ExperienceData from "../assets/data/experience"
import styles from "../Utils/styles";

const UserExperience: React.FC<{}> = (props) => {
  const { language } = useTranslation();

const xxx=[1,2,3,4]

  return (
    <div className="p-7 block-section">
      <h2 className={styles.blockTitle}>Experience</h2>
      
      {ExperienceData.map(exp=>{return <ExperienceItem key={exp.id} logo={exp.Logo} stack={exp.Stack} company={exp.Company} role={exp.Role} from={exp.From} description={language==='it' ? exp.Description : exp.DescriptionEng} isCurrent={exp.Current} location={exp.Location} type={exp.Type}/>})}

      
      
    </div>
  );
};

export default UserExperience;
