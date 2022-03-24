export interface User {
    email: string;
    password: string;
}
export type UserWithToken = User & {
    token: string;
}
