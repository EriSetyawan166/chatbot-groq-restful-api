export class ChatSessionResponse {
    title: string;
    is_active: Boolean;
    created_at?: string;
}

export class CreateChatSessionRequest{
    title: string;
}