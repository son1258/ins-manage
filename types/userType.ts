export type Roles = 'admin' | 'user' | 'saleman' | 'agent' | 'customer' | 'admin_group';

export type UserProps = {
    username: string,
    role: string
}