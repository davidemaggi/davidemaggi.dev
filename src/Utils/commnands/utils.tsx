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
    
    return <ConsoleRow key={uuidv4()} showPrefix={false} content={s.repeat(n)}/>;
}


export const cageLine=(s:string=""):JSX.Element[]=>{
    let ret:JSX.Element[]=[]
    ret.push(...emptyLine(1));
    ret.push(separatorLine(s.length+2, "="));
    ret.push(<ConsoleRow key={uuidv4()} showPrefix={false} content={s}/>);
    ret.push(separatorLine(s.length+2, "="));
    ret.push(...emptyLine(1));

    

    return ret;
}