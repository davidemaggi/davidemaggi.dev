import i18nLang from "../../models/LangInterface";

const English:i18nLang={
    Common: {
        Information: "Information",
        DownloadCV: "Download CV",
        Role: "SW Architect / Tech. Leader",
        Status: "Full Time",
        Location: "Location",
        BirthDay: "Birthday",
        Experience: "Experience",
        Years: "Years",
    },
    Credits: {
        Title: "Credits",
        Description: "How this site has been built?",
        Msg:"Made with ❤️ in ",
        Support:"Consider a donation to help children",
        Support2:"If you are an IT professional, consider to join us"
        
    },
    Translate: {
        Ok: "Language Applied!",
        Error: "Please insert a valid Language: 'en' or 'it'",
        Missing: "Please insert the desired Language: 'en' or 'it'",
    },
    Experience: {
        Current: "present",
        Title: "Work Experience"
    },
    About: {
        Title: "Hi! I'm Davide 👋",
        Phone: "<Hidden>",
        Missing: "",
        Help:"If this is your first visit, and you don't want to play, type help and press ENTER to show the help menu.",
        About: " I'm a Nerd, a Geek, I love Programming and find solutions. After 9 years as Developer, 4 years in QA as QA Manager and Test Automation Enginner, I'm now part of one of the biggest companies in my country, finding solution, developing things, leading teams of people I'm proud to work with."
    },
    Commands: {
        whoami: "About Me",
        credits: "Credits",
        skills: "Skills",
        cv: "Exprience",
        clear: "clear",
        skill: "Skills",
        dump: "Dump",
        help: "Help",
    },
    Skills: {
        Title: "Skills & Interests",
        Descr: "My Interests and Skills... I forgot something... for sure...",
        Certifications: "My Certifications",
        Dev: "Development",
        Arch: "Architecture",
        NoSql: "NoSql",
        Db: "Database",
        Misc: "Other interests",
        CiCd: "CI / CD",
        Cloud: "Cloud",
        Mobile: "Mobile Developments"
    },
    Help: {
        Title: "DavideMaggi.dev Help System",
        Intro:"How to navigate this website",
        AvailableCmd:"AVAILABLE COMMANDS",
        Topic:"TOPIC",
        DescriptionTitle:"DESCRIPTION",
        Description: "This is my Personal WebPage, it's not a regoular website, so it's fine to look 4 help ",
        Type:"Type",
        Commands: {
            cmdAbout: "i | im | whoami | about | info",
            cmdAboutDescription: "to show an about me page.",
            cmdCV: "e | cv | exp | experience | job | work",
            cmdCVDescription: "to see my work experieces.",
            cmdCredits: "dev | credits",
            cmdCreditsDescription: "to know how this website has been made.",
            cmdSkills: "c | s | skill | skills | cert | certs | certifications",
            cmdSkillDescription: "to discover my Skills & Interests.",
            cmdTranslate: "tr | translate <it | en>",
            cmdTranslateDescription: "to translate the website in the desired language.",
            cmdDump: "dump",
            cmdDumpDescription: "to show Everything!!!",
            cmdClear: "clear | cls",
            cmdClearDescription:  "to clear the console.",
            cmdHelp: "h | help",
            cmdHelpDescription:  "to reopennthis help view.",
            cmdShow: "show | menu",
            cmdShowDescription:  "to show/hide  navigation",
        }
}
}

export default English