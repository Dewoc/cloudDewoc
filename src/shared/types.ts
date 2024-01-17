export type GeneralResData = {
    success: number,
    successMsg: string,
    error: number,
    errorMsg: string
}

export interface LoginResData extends GeneralResData { data: { token: string }[] }
export type BasicCredentials = { email: string, password: string }

export type UserType = {
    id: number,
    nombre: string,
    email: string,
    password: string,
    apellido: string,
    fechaRegistro: string, // string Date
    fechaVencimiento: string, // string Date
    idRol: "1" | "2" | "3",
    cuit: string,
    cargo: string,
    departamento: string,
    errors: any,
}

export type BotType = {
    id: string,
    nombre: string,
    descripcion: string,
    precio: string
}

export type BotInputType = {
    idBot: string,
    cuit: string,
    input: string,
    errors?: []
}

export type LogsType = { 
    id: string,
    id_job: string,
    id_process: string,
    level:string,
    time: string,
    process_name:string,
    machine:string,
    message: string
}

export type colorTheme = {
    textColor: string,
    primaryColor: string
    accentColor: string, // color for hover, boders or related
}

export type UserViewTableType = { 
    apellido: string, 
    role: string, 
    nombre: string, 
    email: string, 
    edit: string, 
    delete: string,
    [key: string]: any
}

export type BotsViewTableType = { 
    id: string,
    nombre: string,
    descripcion: string,
    [key: string]: any
}

export type AssetsViewTableType = { 
    id: string,
    nombre: string,
    valor: string,
    [key: string]: any
}


export type BotInputViewTableType = { 
    idBot: string,
    cuit: string,
    input: string,
    [key: string]: any
}

export type JobsViewTableType = { 
    idJob: string,
    idBot: string,
    nombre: string,
    descripcion: string,
    fechaInicio: string,
    fechaFin: string,
    estado: string,
    [key: string]: any
}

export type LogsViewTableType = { 
    id_job: string,
    time: string,
    process_name: string,
    machine: string,
    message: string,
    [key: string]: any
}

export type TriggersViewTableType = { 
    nombre: string,
    cron: string,
    activo: string,
    fechaAlta: string,
    fechaModificacion: string,
    [key: string]: any
}