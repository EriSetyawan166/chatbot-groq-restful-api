export class UserResponse {
    username: string;
    name: string;
    created_at?: string;
    token?: string;
}

export class CreateUserRequest {
    username: string;
    password: string;
    name: string;
}