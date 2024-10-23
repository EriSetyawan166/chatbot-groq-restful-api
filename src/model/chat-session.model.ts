export class ChatSessionResponse {
  title: string;
  is_active: boolean;
  created_at?: string;
}

export class CreateChatSessionRequest {
  title: string;
}

export class UpdateChatSessionRequest {
  id: number;
  title: string;
}

export class ListChatSessionRequest {
  offset: number;
  limit: number;
}
