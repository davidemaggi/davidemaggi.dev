export const insertInString = (insert:string, txt:string, position:number ):string => {

        return [txt.slice(0, position), insert, txt.slice(position)].join('');
}