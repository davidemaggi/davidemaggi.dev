import React from "react";
import { HiOutlineLocationMarker, HiOutlineBriefcase } from "react-icons/hi";
import IStackItem from "../../models/StackItemItnterface";

import { useTranslation } from "../../Utils/i18nUtil";
import StackItem from "./StackItem";

const ExperienceItem: React.FC<{logo?:string, role?:string, type?:string, company?:string, location?:string,description?:string, isCurrent?:boolean, from?:string, to?:string, stack?:IStackItem[]}> = (props) => {
  const { translate } = useTranslation();

  return (
    <div className="mb-5 item-section">
      <div className="company-logo">
        <img src={`/img/logo/${props.logo}`} />
      </div>

      <div className="w-full space-y-5">
        <div className="item-header">
          <div className="space-y-1.5">
            <div className="font-medium">{props.role}</div>
            <div className="flex space-x-5">
              <div className="item-header-info">
                <HiOutlineBriefcase />

                <span>{props.company}</span>
              </div>
              <div className="item-header-info">
                <HiOutlineLocationMarker />
                <span>{props.location}</span>
              </div>
            </div>
            
          </div>
          <div className="space-y-2 sm:text-right">
            <div className="job-item-badge">{props.type}</div>
            <div className="item-header-info">
              <i className="bx bxl-current-location text-3xl h4 w4"></i>

            <span>{props.from} – {props.isCurrent ? translate("Experience.Current"):props.to}</span>
            </div>
          </div>
        </div>
        <div className="w-full space-y-2 space-x-2">
              {props.stack?.map(s=> {return <StackItem key={s.Name} item={s}/>})}
            </div>
        <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: props.description || "" }}>
         
        </p>
        <div className="border-b border-gray-200"></div>
      </div>
    </div>
  );
};

export default ExperienceItem;
