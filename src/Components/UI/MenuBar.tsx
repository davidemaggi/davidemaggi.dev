import React from "react";
import Clock from "./Clock";

const MenuBar: React.FC<{}> = (props) => {
  return (
    <div className="flex h-full w-full backdrop-blur-xl bg-black/60">
      <div className="item w-8 h-12">&nbsp;</div>
      <div className="item w-32 h-12">Logo</div>
      <div className="item w-32 h-12 flex-grow">&nbsp;</div>
      <div className="item w-32 h-12">
        <Clock />
      </div>
      <div className="item w-8 h-12">&nbsp;</div>
    </div>
  );
};

export default MenuBar;
