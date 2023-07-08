import { AiFillGitlab } from "react-icons/ai";
import { BiCameraMovie, BiChip, BiNetworkChart, BiTestTube } from "react-icons/bi";
import { DiAndroid, DiGoogleCloudPlatform, DiMysql } from "react-icons/di";
import { GoProject } from "react-icons/go";
import { TiFlowSwitch } from "react-icons/ti";
import { RiFlowChart } from "react-icons/ri";
import { GiDeliveryDrone } from "react-icons/gi";

import { FaAngular, FaApple, FaAws, FaBug, FaCode, FaCogs, FaCouch, FaCreditCard, FaDatabase, FaDocker, FaEmpire, FaGlobeEurope, FaGoogle, FaHtml5, FaJava, FaJenkins, FaLanguage, FaNetworkWired, FaNodeJs, FaPizzaSlice, FaPython, FaReact, FaShip, FaVolleyballBall } from "react-icons/fa";
import { SiDotnet, SiMicrosoftazure, SiKubernetes, SiRedhatopenshift, SiApollographql,SiAzuredevops, SiApachekafka, SiIbm, SiJava, SiMicrosoftsqlserver, SiSpring, SiOracle, SiPhp, SiGo, SiCouchbase, SiElastic, SiMongodb, SiIonic, SiRedis, SiSonarqube, SiCss3, SiJavascript, SiTailwindcss, SiRabbitmq, SiGraphql } from "react-icons/si";
import SkillInterface from "../../models/SkillInterface";



const skilllData:SkillInterface={
   
    Certifications:[
        {Icon:SiApollographql, Name:"Graph Developer - Professional",  Institute:"Apollo GraphQL"},
        {Icon:SiApollographql, Name:"Graph Developer - Associate",  Institute:"Apollo GraphQL"},
        {Icon:FaAws, Name:"AWS Learning: Architecting",  Institute:"AWS"},
        {Icon:BiChip, Name:"Digital Technologies and the Future of Manufacturing Specialization(IIoT, Digital Twins, Additive Manufacturing)",  Institute:"University of Michigan"},
        {Icon:FaGoogle, Name:"Industrial IoT on Google Cloud",  Institute:"Google"},
        {Icon:SiRedis, Name:"Redis Certified Developer",  Institute:"Redis"},
        {Icon:SiCouchbase, Name:"Couchbase Certified Associate Architect",  Institute:"Couchbase"},
        {Icon:FaGoogle, Name:"Machine Learning with TensorFlow on Google Cloud Platform Specialization",  Institute:"Google"},
        {Icon:FaGoogle, Name:"Google Cloud Platform - Developer Enablement Program",  Institute:"Google"},
        {Icon:FaCreditCard, Name:"Nexi Dev Training Program",  Institute:"Nexi"},
        {Icon:FaLanguage, Name:"EF SET English Certificate 92/100 (C2 Proficient)",  Institute:"EF Standard English Test (EF SET)"},
        {Icon:GoProject, Name:"Project Management Program",  Institute:"International Business Management Institute (IBMI)"},
        {Icon:FaGoogle, Name:"Fundamentals of Digital Marketing",  Institute:"Google"},
        {Icon:FaGoogle, Name:"Machine Learning for Business Professionals",  Institute:"Google"},
        {Icon:SiMongodb, Name:"MongoDB(Multi)",  Institute:"MongoDB"},
        {Icon:BiTestTube, Name:"Certified Tester, Advanced Level - Test Automation Engineer (CTAL-TAE)",  Institute:"ISTQB - International Software Testing Qualifications Board"},
        {Icon:BiTestTube, Name:"Certificate Software Tester - Foundation Level",  Institute:"ISTQB - International Software Testing Qualifications Board"},
        {Icon:SiIbm, Name:"Big Data Foundations - Level 2",  Institute:"IBM"},
        {Icon:FaCogs, Name:"SmartBear Academy - TesComplete Graduate",  Institute:"SmartBear"},
        {Icon:FaShip, Name:"Maritime Logistics and Supply Chain Management",  Institute:"Technische Hochschule Lübeck"},

        
        
       
      ],

    Skills:[
        
        {Color:"text-fuchsia-500", TextColor:"text-gray-100", Name:".Net", GroupCode:"dev",  Icon:SiDotnet},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"MicroServices", GroupCode:"arch",  Icon:FaNetworkWired},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"MicroFrontends", GroupCode:"arch",  Icon:BiNetworkChart},
        {Color:"text-orange-400", TextColor:"text-gray-100", Name:"AWS", GroupCode:"cloud", Icon:FaAws},
        {Color:"text-blue-600", TextColor:"text-gray-100", Name:"Azure", GroupCode:"cloud",  Icon:SiMicrosoftazure},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"Google Cloud", GroupCode:"cloud",  Icon:DiGoogleCloudPlatform},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"Docker", GroupCode:"arch",  Icon:FaDocker},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"Kubernetes", GroupCode:"arch",  Icon:SiKubernetes},
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"Openshift", GroupCode:"arch",  Icon:SiRedhatopenshift},
        {Color:"text-sky-600", TextColor:"text-gray-100", Name:"Azure Pipelines", GroupCode:"cicd",  Icon:SiAzuredevops},
        {Color:"text-orange-500", TextColor:"text-gray-100", Name:"Gitlab Pipelines", GroupCode:"cicd", Icon:AiFillGitlab},
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"Java", GroupCode:"dev", Icon:SiJava},
        {Color:"text-green-500", TextColor:"text-gray-100", Name:"Spring", GroupCode:"dev", Icon:SiSpring},
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"Angular", GroupCode:"dev", Icon:FaAngular},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"ReactJs", GroupCode:"dev", Icon:FaReact},
        {Color:"text-green-500", TextColor:"text-gray-100", Name:"NodeJs", GroupCode:"dev", Icon:FaNodeJs},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"ElectronJs", GroupCode:"dev", Icon:FaReact},
        
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"CouchDB", GroupCode:"nosql", Icon:FaCouch},
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"CouchBase", GroupCode:"nosql", Icon:SiCouchbase},
        {Color:"text-green-300", TextColor:"text-gray-100", Name:"MongoDB", GroupCode:"nosql", Icon:SiMongodb},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"Elastic", GroupCode:"nosql", Icon:SiElastic},
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"Redis", GroupCode:"nosql", Icon:SiRedis},
        {Color:"text-green-700", TextColor:"text-gray-100", Name:"DB2", GroupCode:"db", Icon:FaDatabase},
        {Color:"text-rose-500", TextColor:"text-gray-100", Name:"MSSQL", GroupCode:"db", Icon:SiMicrosoftsqlserver},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"IBM", GroupCode:"cloud",  Icon:SiIbm},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"AMQP", GroupCode:"arch", Icon:TiFlowSwitch},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"MQTT", GroupCode:"arch", Icon:TiFlowSwitch},
        {Color:"text-orange-500", TextColor:"text-gray-100", Name:"RabbitMQ", GroupCode:"arch", Icon:SiRabbitmq},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"Apache Kafka", GroupCode:"arch", Icon:SiApachekafka},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"ESB", GroupCode:"arch", Icon:RiFlowChart},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"IoT", GroupCode:"arch", Icon:BiChip},
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"Oracle", GroupCode:"db", Icon:SiOracle},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"PowerBuilder", GroupCode:"dev",  Icon:FaCode},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"Test Automation", GroupCode:"test", Icon:FaCogs},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"Jenkins", GroupCode:"cicd", Icon:FaJenkins},
        {Color:"text-green-400", TextColor:"text-gray-100", Name:"Android",  GroupCode:"mobile", Icon:DiAndroid},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"Ionic",  GroupCode:"mobile", Icon:SiIonic},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"iOS",  GroupCode:"mobile", Icon:FaApple},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"React Native", GroupCode:"mobile", Icon:FaReact},

        {Color:"text-yellow-500", TextColor:"text-gray-100", Name:"Python", GroupCode:"dev", Icon:FaPython},

        {Color:"text-orange-500", TextColor:"text-gray-100", Name:"Html", GroupCode:"dev",  Icon:FaHtml5},
        {Color:"text-yellow-500", TextColor:"text-gray-100", Name:"Javascript", GroupCode:"dev",  Icon:SiJavascript},
        {Color:"text-blue-500", TextColor:"text-gray-100", Name:"Css", GroupCode:"dev",  Icon:SiCss3},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"Tailwind", GroupCode:"dev",  Icon:SiTailwindcss},

        {Color:"text-pink-500", TextColor:"text-gray-100", Name:"GraphQL", GroupCode:"dev",  Icon:SiGraphql},



        {Color:"text-violet-500", TextColor:"text-gray-100", Name:"Php", GroupCode:"dev", Icon:SiPhp},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"GO", GroupCode:"dev", Icon:SiGo},
        {Color:"text-orange-300", TextColor:"text-gray-100", Name:"MySQL", GroupCode:"db",  Icon:DiMysql},
        {Color:"text-blue-300", TextColor:"text-gray-100", Name:"Sonarqube", GroupCode:"dev",  Icon:SiSonarqube},

        {Color:"text-yellow-500", TextColor:"text-gray-100", Name:"Former National Waterpolo player & referee", GroupCode:"misc",  Icon:FaVolleyballBall},
        {Color:"text-red-500", TextColor:"text-gray-100", Name:"Pizza Lover", GroupCode:"misc",  Icon:FaPizzaSlice},
        {Color:"text-green-500", TextColor:"text-gray-100", Name:"Expert Bug Maker", GroupCode:"misc",  Icon:FaBug},
        {Color:"text-gray-100", TextColor:"text-gray-100", Name:"Empire Supporter", GroupCode:"misc",  Icon:FaEmpire},
        {Color:"text-green-500", TextColor:"text-gray-100", Name:"Love to ravel", GroupCode:"misc",  Icon:FaGlobeEurope},
        {Color:"text-gray-200", TextColor:"text-gray-100", Name:"Movies & Series enthusiast", GroupCode:"misc",  Icon:BiCameraMovie},
        {Color:"text-gray-300", TextColor:"text-gray-100", Name:"Drone Pilot & enthusiast", GroupCode:"misc",  Icon:GiDeliveryDrone}
        
        
        
    ]
}


export default skilllData;
 