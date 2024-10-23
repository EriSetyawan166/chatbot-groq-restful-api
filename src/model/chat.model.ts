export class ChatResponse {
  id: number;
  sender: string;
  message: string;
  created_at?: string;
}

export class CreateChatRequest {
  session_id: number;
  message: string;
}
