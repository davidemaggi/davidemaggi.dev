import React from "react";
import { Route, Routes } from "react-router-dom";
import UserAbout from "./UserAbout";
import UserCard from "./UserCard";
import UserExperience from "./UserExperience";
import UserInfo from "./UserInfo";
import UserSkill from "./UserSkills";

const LeftColumn: React.FC<{}> = (props) => {
  return (
    <div className="space-y-5 lg:col-span-2">
      <UserAbout />
      
      <Routes>
      <Route path="experience" element={<UserExperience />}/>
      <Route path="contact" element={<UserCard />}/>
        
      <Route path="*" element={<UserExperience />}/>
       
      
    </Routes>

    </div>
  );
};

export default LeftColumn;
