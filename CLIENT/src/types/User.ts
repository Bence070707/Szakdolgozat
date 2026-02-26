export type User = {
    id: string,
    displayName: string,
    userName: string,
    email: string,
    token: string,
    roles: string[]
}

export type ManagedUser = {
    id: string,
    email: string,
    roles: string[],
    isArchived: boolean,
    archivedAt: string | null
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