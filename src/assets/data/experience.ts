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
    Description: "<p>IT In my current position as Head of Java developments for Travel, Hospitality & Logistics business unit I’m responsabile for the success of projects relying on Java technologies.<p></p> My duties include the engagement of the customer, the complete design of the solution, the selection, management and mentoring of the dev team, and if the project requires it I still love to make my hands dirty partecipating in the developments of both, Front-End and Back-end, parts of the project.</p>",
    DescriptionEng: "<p>In my current position as Head of Java developments for Travel, Hospitality & Logistics business unit I’m responsabile for the success of projects relying on Java technologies.<p></p> My duties include the engagement of the customer, the complete design of the solution, the selection, management and mentoring of the dev team, and if the project requires it I still love to make my hands dirty partecipating in the developments of both, Front-End and Back-end, parts of the project.</p>",
  
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
    Company: "Engineering I.I.",
    Role: "Solution Architect / Tech. Leader",
    Logo:"eng.png",
    Current: true,
    Location: "Genova",
    Type: "Full Time",
    From: "04/08/2018",
    Description: "<p>Designing solutions and leading dev teams in the Hospitality BU, working together with Customers like Carnival, GNV, MSC & Alpitour</p>",
    DescriptionEng: "<p>Designing solutions and leading dev teams in the Hospitality BU, working together with Customers like Carnival, GNV, MSC & Alpitour</p>",
  },
  {
    id:"4",
    Company: "Alpitour",
    Role: "Solution Architect / Tech. Leader",
    Logo:"alpitour.png",
    Current: true,
    Location: "Torino",
    Type: "Full Time",
    From: "04/2020",
    Description: "<p>Reporting directly to the IT top management I’m leading the developments for both Group-wide and branded solutions.</p>",
    DescriptionEng: "<p>Reporting directly to the IT top management I’m leading the developments for both Group-wide and branded solutions.</p>",
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
    Description: "<p>I started my Experience with Engineering as a BA @ Carnival due to my experience in Asset Management solutions, but then I switched back to a technical role proposing, designing and developing a corporation wide Asset Management Solution. After the initial release and subsequent proposal to the corporation top management the project has been greenlighted(now named as LEVANTE) and a dedicated teams of developers and BAs(me + 2 developers + 2 BAs) has been formed to analyze and develop every new module requested by the business. When Pandemic stopped the Cruise market I followed the migration of the solution from On-Prem to Azure Cloud before being released to work on other customers. As of today the project has been re-starded and is employing 30+ resources, I’m not oﬃcially involved in it but I still provide support to the team.</p>",
    DescriptionEng: "<p>Reporting directly to the IT top management I’m leading the developments for both Group-wide and branded solutions.</p>",
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
    Description: "<p>Started as a Tester I built my way up Leading the Test Automation efforts and then managing the QA Department.</p>",
    DescriptionEng: "<p>Started as a Tester I built my way up Leading the Test Automation efforts and then managing the QA Department.</p>",
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
    Description: "<p>Right After Highschool I started my life as a developer, focusing on mobile and web solutions but as programming enthusiast I continued to study and making my hands dirty with many different technologies</p>",
    DescriptionEng: "<p>Right After Highschool I started my life as a developer, focusing on mobile and web solutions but as programming enthusiast I continued to study and making my hands dirty with many different technologies</p>",
  },
];

export default ExperienceData;
