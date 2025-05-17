import { User } from "../Types"; 

const user = JSON.parse(sessionStorage.getItem('user') ?? '{}'); 

export const getUserFromSession = (): User => {
    return user;
}

export const getUserMailFromSession = (): string => {
    return user.email;
}

export const getUserRoleFromSession = (): string => {
    return user.role
}