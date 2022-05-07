interface i18nLang {
  Common: {
    Information: string;
    DownloadCV: string;
    Role: string;
    Status: string;
    Location: string;
    BirthDay: string;
    Experience: string;
    Years: string;
  };

  Help: {
    Title: string;
    Intro: string;
    Description: string;
    Type:string;
    AvailableCmd:string,
    Topic:string,
    DescriptionTitle:string,
    Commands:{
        cmdAbout:string, 
        cmdAboutDescription:string,
        cmdCV:string, 
        cmdCVDescription:string,
        cmdCredits:string, 
        cmdCreditsDescription:string,
        cmdSkills:string, 
        cmdSkillDescription:string,
        cmdTranslate:string, 
        cmdTranslateDescription:string,
        cmdDump:string, 
        cmdDumpDescription:string,
        cmdClear:string, 
        cmdClearDescription:string,
        cmdHelp: string,
            cmdHelpDescription:  string,
            cmdShow: string,
            cmdShowDescription:  string
    }
  };

  Credits: {
    Title: string;
    Description: string;
    Msg: string;
    Support: string;
    Support2: string;
  };
  Translate: {
    Ok: string;
    Error: string;
    Missing: string;
  };
  About: {
    Title: string;
    Phone: string;
    Missing: string;
    About: string;
    Help: string;
  };
  Experience: {
    Current: string;
    Title: string;
  };
  Commands: {
    whoami: string;
    credits: string;
    skills: string;
    cv: string;
    clear: string;
    skill: string;
    dump: string;
    help:string;
    
  };
  Skills: {
    Title: string;
    Descr: string;
    Certifications: string;
    Dev: string;
    Arch: string;
    NoSql: string;
    Db: string;
    
    Misc: string;
    CiCd: string;
    Cloud: string;
    Mobile: string;
  };
}

export default i18nLang;
