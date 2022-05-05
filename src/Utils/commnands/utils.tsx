import ConsoleRow from "../../Components/UI/ConsoleRow";
import { v4 as uuidv4 } from 'uuid';
import React from "react";

export const emptyLine=(n:number=1):JSX.Element[]=>{
    let ret:JSX.Element[]=[]
    
    for(let i=0;i<n;i++){
        ret.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={" "}/>);
    }

    return ret;
}


export const separatorLine=(n:number=1, s:string="-"):JSX.Element=>{
    let ret:string=""
    
    for(let i=0;i<n;i++){
        ret+=s;
    }

    return <ConsoleRow key={uuidv4()} showPrefix={false} content={ret}/>;
}