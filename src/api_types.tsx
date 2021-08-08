export type UserData = {

    id: string
    handle: string
    username: string
    password: string
    session?: {
        token: string
        expires: Date
    }

}

export type ProfileData = {

    id: string
    username: string
    handle: string,

    followers: UserData[]
    following: UserData[]

    bio: string
    avatar: string

}
