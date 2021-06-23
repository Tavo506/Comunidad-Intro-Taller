export interface Ejercicio{
    $key? : string;
    call : string;
    code : string;
    created : string;
    creator : string;
    details : string;
    examples : Ejemplo[];
    level : number;
    name : string;
    ratings? : number[];
    section : string;
    solution : {
        code : string;
        inputs : IO[];
        outputs : IO[];
    };
}


export interface Ejemplo{
    call : string;
    comment : string;
    result : string;
}

export interface IO{
    name : string;
    type : string;
}