import {cookies, headers} from "next/headers";
import payload, {extractJWT} from "payload";

export const getUser =()=>{

    const jwt = extractJWT({headers: headers(), payload:payload, isGraphQL:false})


}