import React from "react";
import UserCard from "./UserCard";
import UserInfo from "./UserInfo";
import UserSkill from "./UserSkills";

const LeftColumn: React.FC<{}> = (props) => {
  return (
    <div className="space-y-5">
      <UserCard />
      <UserInfo />
      <UserSkill />
    </div>
  );
};

export default LeftColumn;
