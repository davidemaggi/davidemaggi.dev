import { useDispatch, useSelector } from "react-redux";
import English from "../assets/i18n/en";
import Italian from "../assets/i18n/it";
import { changeLanguage } from "../Slices/configSlice";
import { store, RootState } from "../store";
import _ from "lodash";

export const useTranslation = () => {
  const language = useSelector((state: RootState) => state.config.language);
  const dispatch = useDispatch();

  //console.log(language);

  let languages = {
    italian: Italian,
    english: English,
  };

  const setLanguage = (lang: string) => {
    dispatch(changeLanguage(lang));
  };

  const translate = (txt: string): string => {
    let ret: string[] = [];
    let tmp = txt.replaceAll(" ", "_");
    let expTxt = tmp.split("_");
    //console.log(tmp);
    //console.log(expTxt);

    expTxt.forEach((key) => {
      //console.log(key);

     let tmp=_.get(
        language === "it" ? languages.italian : languages.english,
        key,
        key
      )

      ret.push(
        typeof tmp  ==="string" ? tmp : key
      );
    
    });

    //console.log(`"${key}"`,languages,language);

    //let ret=_.get(language==="it" ? languages.italian : languages.english, txt);
    //console.log(ret)
    return ret.join("_").replaceAll("_"," ");
  };

  return { translate, setLanguage, language };
};
