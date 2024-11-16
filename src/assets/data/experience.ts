import ExperienceItem from "../../models/ExperienceItemInterface";
import { DiAndroid, DiGoogleCloudPlatform, DiJava, DiMysql } from "react-icons/di";
import {
  SiMongodb,
  SiRabbitmq,
  SiSpring,
  SiIbm,
  SiApachekafka,
  SiMicrosoftsqlserver,
  SiDotnet,
  SiMicrosoftazure,
  SiJava,
  SiPhp,
  SiOracle,
  SiKubernetes,
  SiRedhatopenshift,
  SiAzuredevops,
  SiElastic,
  SiSplunk,
  SiSonarqube,
  SiGraphql,
  SiRedis, SiPostgresql
} from "react-icons/si";
import { FaNetworkWired, FaJava,FaAngular,FaCouch,FaAws,FaDatabase, FaReact, FaCloud, FaNodeJs, FaApple, FaCode, FaPython, FaDocker, FaCogs, FaJenkins } from "react-icons/fa";
import { BiChip, BiNetworkChart } from "react-icons/bi";
import { AiFillGitlab } from "react-icons/ai";

const ExperienceData: ExperienceItem[] = [
  {
    id:"7",
    Company: "Accenture - Industry X",
    Role: "System Architect - Tech Lead",
    Logo:"acn.png",
    Current: true,
    Location: "Torino",
    Type: "Full Time",
    From: "06/2022",
    Description: "Sono un System Architect presso Accenture Industry X, dove coordino lo sviluppo di una soluzione per la gestione della qualità. Nel mio ruolo, mi occupo della progettazione dell'architettura complessiva del sistema, ricoprendo anche il ruolo di tech lead e guidando il team di sviluppo nell'implementazione. Lavoro a stretto contatto con la direzione per garantire che gli obiettivi del progetto siano allineati e che la soluzione soddisfi i requisiti sia aziendali che tecnici.",
    DescriptionEng: "I am a System Architect at Accenture Industry X, leading the development of a quality management solution. In my role, I design the overall architecture of the system while also acting as a technical lead, guiding the development team through the implementation process. I collaborate closely with management to ensure alignment on project goals and deliverables, ensuring the solution meets both business and technical requirements.",
    Stack:[
      {Name:"MicroServices", Color:"text-gray-100", Icon:FaNetworkWired},
      {Name:"MicroFrontends", Color:"text-gray-100", Icon:BiNetworkChart},
      {Name:"Kubernetes", Color:"text-blue-300", Icon:SiKubernetes},
      {Name:".Net", Color:"text-fuchsia-500", Icon:SiDotnet},
      {Name:"PostgreSQL", Color:"text-blue-500", Icon:SiPostgresql},
      {Name:"MSSQL", Color:"text-rose-500", Icon:SiMicrosoftsqlserver},
      {Name:"Azure", Color:"text-blue-600", Icon:SiMicrosoftazure},
      {Name:"MongoDB", Color:"text-green-500", Icon:SiMongodb},
      {Name:"ReactJS", Color:"text-blue-300", Icon:FaReact},
      {Name:"IoT", Color:"text-gray-100", Icon:BiChip},
      {Name:"RabbitMQ", Color:"text-orange-500", Icon:SiRabbitmq},
      {Name:"GraphQL", Color:"text-orange-500", Icon:SiGraphql},
      {Name:"Redis", Color:"text-red-500", Icon:SiRedis},

      
      
    ]
  },
  {
    id:"6",
    Company: "Engineering Ingegneria Informatica",
    Role: "Head of Java Developments @ THL BU",
    Logo:"eng.png",
    Current: false,
    Location: "Genova",
    Type: "Full Time",
    From: "04/2020",
    To: "06/2022",
    Description: "Nel mio ruolo di responsabile per gli sviluppi Java per la Business Unit Travel, Hospitality & Logistics ho la responsabilita' del successo di tutti i progetti con tecnologie Java.\n \nI miei compiti includono l'ingaggio del cliente, il design completo della soluzione, la selezione, gestione e mentoring del team di sviluppo e se il progetto lo richiede adoro continuare a sporcarmi le mani nello sviluppo sia delle parti Back-End che Front-end.",
    DescriptionEng: "In my current position as Head of Java developments for Travel, Hospitality & Logistics business unit I’m responsabile for the success of projects relying on Java technologies.\n \n My duties include the engagement of the customer, the complete design of the solution, the selection, management and mentoring of the dev team, and if the project requires it I still love to make my hands dirty partecipating in the developments of both, Front-End and Back-end, parts of the project.",
  },
  {
    id:"5",
    Company: "Engineering Ingegneria Informatica",
    Role: "Solution Architect / Tech. Leader",
    Logo:"eng.png",
    Current: false,
    Location: "Genova",
    Type: "Full Time",
    From: "04/08/2018",
    To: "06/2022",
    Description: "Occupandomi dell'architettura e sviluppo di progetti all'interno della Business Unit Travel & Hospitality, lavorando con clienti del calibro di Carnival, GNV, MSC & Alpitour",
    DescriptionEng: "Designing solutions and leading dev teams in the Hospitality BU, working together with Customers like Carnival, GNV, MSC & Alpitour",
    Stack:[
      {Name:"MicroServices", Color:"text-gray-100", Icon:SiDotnet},
      {Name:"MicroFrontends", Color:"text-gray-100", Icon:BiNetworkChart},
      {Name:"AWS", Color:"text-orange-400", Icon:FaAws},
      {Name:"Azure", Color:"text-blue-600", Icon:SiMicrosoftazure},
      {Name:"Google Cloud", Color:"text-gray-100", Icon:DiGoogleCloudPlatform},
      {Name:"Docker", Color:"text-blue-300", Icon:FaDocker},
      {Name:"Kubernetes", Color:"text-blue-300", Icon:SiKubernetes},
      {Name:"Openshift", Color:"text-red-500", Icon:SiRedhatopenshift},
      {Name:"Azure Pipelines", Color:"text-sky-600", Icon:SiAzuredevops},
      {Name:"Gitlab CI/CD", Color:"text-orange-500", Icon:AiFillGitlab},
      {Name:"SonarQube", Color:"text-blue-300", Icon:SiSonarqube},

     
    ]
  
  },
  {
    id:"4",
    Company: "Alpitour S.p.A.",
    Role: "Solution Architect / Tech. Leader",
    Logo:"alpitour.png",
    Current: false,
    Location: "Torino",
    Type: "Full Time",
    From: "04/2020",
    To: "06/2022",
    Description: "Riportando direttamente al top Management IT guido gli sviluppi di soluzioni sia trasversali che di Brand.",
    DescriptionEng: "Reporting directly to the IT top management I’m leading the developments for both Group-wide and branded solutions.",
    Stack:[
      {Name:"Java", Color:"text-red-500", Icon:SiJava},
      {Name:"Spring", Color:"text-green-500", Icon:SiSpring},
      {Name:"Angular", Color:"text-red-500", Icon:FaAngular},
      {Name:"NodeJs", Color:"text-green-500", Icon:FaNodeJs},
      {Name:"ElectronJs", Color:"text-blue-300", Icon:FaReact},
      {Name:"CouchDB", Color:"text-red-500", Icon:FaCouch},
      {Name:"DB2", Color:"text-green-700", Icon:FaDatabase},
      {Name:"MSSQL", Color:"text-rose-500", Icon:SiMicrosoftsqlserver},
      {Name:"IBM", Color:"text-blue-300", Icon:SiIbm},
      {Name:"AWS", Color:"text-orange-500", Icon:FaAws},
      {Name:"Kafka", Color:"text-gray-100", Icon:SiApachekafka},
      {Name:"Elastic", Color:"text-gray-100", Icon:SiElastic},

      
      {Name:"Azure Devops", Color:"text-blue-600", Icon:SiAzuredevops},
    ]
  },
  {
    id:"3",
    Company: "Carnival Corporation",
    Role: "Solution Architect / BA",
    Logo:"carnival.png",
    Current: false,
    Location: "Genova",
    Type: "Full Time",
    From: "01/08/2018",
    To: "04/2020",
    DescriptionEng: "I started my experience with Engineering as a BA @ Carnival due to my experience in Asset Management solutions, but then I switched back to a technical role proposing, designing and developing a corporation wide Asset Management Solution.",
    Description: "Ho cominciato la mia esperienza in Engineering come BA in Carnival(Costa Crociere) per la mia esperienza nel settore dell'asset management, ma sono tornato quasi immediatamente a ricoprire un ruolo tecnico proponendo, disegnando, e sviluppando un sistema trasversale di asset management.",
    Stack:[
      {Name:".Net", Color:"text-fuchsia-500", Icon:SiDotnet},
      {Name:"MSSQL", Color:"text-rose-500", Icon:SiMicrosoftsqlserver},
      {Name:"Azure", Color:"text-blue-600", Icon:SiMicrosoftazure},
      {Name:"Angular", Color:"text-red-500", Icon:FaAngular},
      {Name:"CouchDB", Color:"text-red-500", Icon:FaCouch},
      {Name:"ReactJS", Color:"text-blue-300", Icon:FaReact},
      {Name:"IoT", Color:"text-gray-100", Icon:BiChip},
      {Name:"Splunk", Color:"text-green-300", Icon:SiSplunk},
      
    ]
  },
  {
    id:"2",
    Company: "SpecTec S.p.A.",
    Role: "Senior Software Tester / Senior Test Automation Engineer",
    Logo:"spectec.png",
    Current: false,
    Location: "Genova",
    Type: "Full Time",
    From: "17/01/2015",
    To: "31/07/2018",
    Description: "Cominciato da Tester ho preso poi in carico la gestione del Dipartimento QA ed ho introdotto la Test Automation in azienda.",
    DescriptionEng: "Started as a Tester I built my way up Leading the Test Automation efforts and then managing the QA Department.",
    Stack:[
      {Name:".Net", Color:"text-fuchsia-500", Icon:SiDotnet},
      {Name:"MSSQL", Color:"text-rose-500", Icon:SiMicrosoftsqlserver},
      {Name:"Sybase", Color:"text-gray-100", Icon:FaDatabase},
      {Name:"Oracle", Color:"text-red-500", Icon:SiOracle},
      {Name:"PowerBuilder", Color:"text-gray-100", Icon:FaCode},
      {Name:"Test Automation", Color:"text-gray-100", Icon:FaCogs},
      {Name:"Jenkins", Color:"text-gray-100", Icon:FaJenkins},
      
    ]
  },
  {
    id:"1",
    Company: "Freelance / Bhalu",
    Role: "Programmer / Consultant / Founder",
    Logo:"bhalu.png",
    Current: false,
    Location: "Rapallo",
    Type: "Freelance",
    From: "17/06/2006",
    To: "16/01/2015",
    DescriptionEng: "Right After Highschool I started my life as a developer, focusing on Mobile and Web solutions but as programming enthusiast I continued to study and making my hands dirty with many different technologies.",
    Description: "Subito dopo aver terminato la scuola ho cominciato la mia vita da programmatore, concentrandomi su sviluppo Web e Mobile, ma da buon smanettone ho continuato a studiare e a sporcarmi le mani con molte tecnologie diverse.",
    Stack:[
      {Name:".Net", Color:"text-fuchsia-500", Icon:SiDotnet},
      {Name:"Java", Color:"text-red-500", Icon:FaJava},
      {Name:"Android", Color:"text-green-400", Icon:DiAndroid},
      {Name:"iOS", Color:"text-gray-100", Icon:FaApple},
      {Name:"Python", Color:"text-yellow-500", Icon:FaPython},
      {Name:"Php", Color:"text-violet-500", Icon:SiPhp},
      {Name:"MySQL", Color:"text-orange-300", Icon:DiMysql}
    ]
  },
];

export default ExperienceData;
