import React from "react";

import { useTranslation } from "../Utils/i18nUtil";
import styles from "../Utils/styles";

const UserSkill: React.FC<{}> = (props) => {
  const { translate, setLanguage } = useTranslation();

  return (
    <div className="p-7 block-section flow-root">
      <h2 className={styles.blockTitle}>Skills</h2>
      <div className="-m-2 flex flex-wrap">
        <span className="skill-tag">JavaScript</span>
        <span className="skill-tag">React</span>
        <span className="skill-tag">Vue</span>
        <span className="skill-tag">SQL</span>
        <span className="skill-tag">HTML/CSS</span>
        <span className="skill-tag">Java</span>
      </div>
    </div>
  );
};

export default UserSkill;
