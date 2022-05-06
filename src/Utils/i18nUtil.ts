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




  const translate = (txt:string):string => {

  
    let ret:string[]=[];
    let tmp=txt.replace(" ", "_");
    let expTxt=txt.split("_");

    expTxt.forEach((key)=>{
//console.log(key);
      ret.push(_.get(language==="it" ? languages.italian : languages.english, key,key));

    })

//console.log(`"${key}"`,languages,language);

//let ret=_.get(language==="it" ? languages.italian : languages.english, txt);
//clearconsole.log(expTxt)
return ret.join("_");

    
  };

  

  return { translate, setLanguage, language };
};


