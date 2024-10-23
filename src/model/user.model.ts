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

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
