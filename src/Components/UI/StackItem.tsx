import React from "react";
import { colors } from "../../assets/data/Statics";
import IStackItem from "../../models/StackItemItnterface";

const StackItem: React.FC<{item:IStackItem}> = (props) => {

    let color:string= colors.miscChip;
    let background:string= colors.miscChipBack;

    if(props.item.Type=='prog'){
        color= colors.progChip;
        background= colors.progChipBack;  
    }
    if(props.item.Type=='db'){
        color= colors.dbChip;
        background= colors.dbChipBack;  
    }
    if(props.item.Type=='cloud'){
        color= colors.cloudChip;
        background= colors.cloudChipBack;  
    }


    
  return (
    <div className="job-item-badge" style={{
        backgroundColor:background,
        color:color
        
    }}>{props.item.Name}</div>
  );
};

export default StackItem;
