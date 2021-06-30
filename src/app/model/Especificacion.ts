export interface Especificacion{
    $key?: string;
    created: Date | string;
    creator: string;
    code: string;
    content: string;
    file?: File;
    fileName? : string,
    fileUrl?: string,
    name: string
    section: string;

}