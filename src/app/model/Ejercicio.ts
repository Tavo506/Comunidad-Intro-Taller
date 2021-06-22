export default class Ejercicio{
    call? : string;
    code? : string;
    created? : string;
    creator? : string;
    details? : string;
    examples? : Ejemplo[];
    level? : number;
    name? : string;
    ratings? : number[];
    section? : string;
    solution? : {
        code : string;
        inputs : IO[];
        outputs : IO[];
    }
}


export class Ejemplo{
    call? : string;
    comment? : string;
    result? : string;
}

export class IO{
    name? : string;
    type? : string;
}