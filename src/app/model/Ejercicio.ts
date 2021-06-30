export interface Ejercicio{
    $key? : string;
    call : string;
    code : string;
    created : Date | string;
    creator : string;
    details : string;
    examples : Ejemplo[];
    file? : File;
    fileName? : string;
    fileUrl? : string;
    level : number;
    name : string;
    ratings? : number[];
    section : string;
    solution : {
        code : string;
        inputs? : IO[];
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