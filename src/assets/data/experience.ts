import ExperienceItem from "../../models/ExperienceItemInterface";
import { colors } from "./Statics";

const ExperienceData: ExperienceItem[] = [
  {
    id:"6",
    Company: "Engineering I.I.",
    Role: "Head of Java Developments @ THL BU",
    Logo:"eng.png",
    Current: true,
    Location: "Genova",
    Type: "Full Time",
    From: "04/2020",
    Description: "Nel mio ruolo di responsabile per gli sviluppi Java per la Business Unit Travel, Hospitality & Logistics ho la responsabilita' del successo di tutti i progetti con tecnologie Java.\n \nI miei compiti includono l'ingaggio del cliente, il design completo della soluzione, la selezione, gestione e mentoring del team di sviluppo e se il progetto lo richiede adoro continuare a sporcarmi le mani nello sviluppo sia delle parti Back-End che Front-end.",
    DescriptionEng: "In my current position as Head of Java developments for Travel, Hospitality & Logistics business unit I’m responsabile for the success of projects relying on Java technologies.\n \n My duties include the engagement of the customer, the complete design of the solution, the selection, management and mentoring of the dev team, and if the project requires it I still love to make my hands dirty partecipating in the developments of both, Front-End and Back-end, parts of the project.",
  
    Stack:[
      {Name:"Java", Type:"prog"},
      {Name:"Spring", Type:"prog"},
      {Name:"SpringBoot", Type:"prog"},
      {Name:"CouchDB", Type:"db"},
      {Name:"DB2", Type:"db"},
      {Name:"MSSQL", Type:"db"},
      {Name:"IBM", Type:"cloud"},
      {Name:"AWS", Type:"cloud"},
      {Name:"Kafka"},


    ]

  },
  {
    id:"5",
    Company: "Engineering Ingegneria Informatica",
    Role: "Solution Architect / Tech. Leader",
    Logo:"eng.png",
    Current: true,
    Location: "Genova",
    Type: "Full Time",
    From: "04/08/2018",
    Description: "Occupandomi dell'architettura e sviluppo di progetti all'interno della Business Unit Travel & Hospitality, lavorando con clienti del calibro di Carnival, GNV, MSC & Alpitour",
    DescriptionEng: "Designing solutions and leading dev teams in the Hospitality BU, working together with Customers like Carnival, GNV, MSC & Alpitour",
  },
  {
    id:"4",
    Company: "Alpitour S.p.A.",
    Role: "Solution Architect / Tech. Leader",
    Logo:"alpitour.png",
    Current: true,
    Location: "Torino",
    Type: "Full Time",
    From: "04/2020",
    Description: "Riportando direttamente al top Management IT guido gli sviluppi di soluziani sia trasversali che di Brand.",
    DescriptionEng: "Reporting directly to the IT top management I’m leading the developments for both Group-wide and branded solutions.",
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
  },
];

export default ExperienceData;
