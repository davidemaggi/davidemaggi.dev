import { useDispatch, useSelector } from "react-redux";
import English from "../assets/i18n/en";
import Italian from "../assets/i18n/it";
import { changeLanguage } from "../Slices/configSlice";
import { store,RootState } from "../store";
import _ from "lodash";

export const useTranslation = () => {
  const language = useSelector((state: RootState) => state.config.language);
  const dispatch = useDispatch()

  //console.log(language);

  let languages = {
    italian: Italian,
    english: English,
  };

const setLanguage=(lang:string)=>{dispatch(changeLanguage(lang))}




  const translate = (key:string):string => {




return _.get(language==="it" ? languages.italian : languages.english, key) || key

    
  };

  

  return { translate, setLanguage, language };
};
