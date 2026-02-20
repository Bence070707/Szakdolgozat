export type User = {
    id: string,
    displayName: string,
    userName: string,
    email: string,
    token: string
}


export type LoginCreds = {
    emaiL: string,
    password: string
}

export type RegisterCreds = {
    email: string,
    displayName: string,
    password: string
}