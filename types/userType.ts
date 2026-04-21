export type Roles = 'admin' | 'user' | 'saleman' | 'agent' | 'customer' | 'admin_group' | 'test';

export type UserProps = {
    username: string,
    role: string
}