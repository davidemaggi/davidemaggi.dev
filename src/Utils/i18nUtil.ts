import React from "react";
import { useDispatch, useSelector } from "react-redux";
import English from "../assets/i18n/english";
import Italian from "../assets/i18n/italian";
import { changeLanguage } from "../Slices/i18nSlice";
import { store,RootState } from "../store";

export const useTranslation = () => {
  const currentLanguage = useSelector((state: RootState) => state.i18n.current);
  const dispatch = useDispatch()

  console.log(currentLanguage);

  let languages = {
    italian: Italian,
    English: English,
  };

const setLanguage=(lang:string)=>{dispatch(changeLanguage(lang))}




  const translate = (key:string) => "Test";
  return { translate, setLanguage, currentLanguage, languages };
};
