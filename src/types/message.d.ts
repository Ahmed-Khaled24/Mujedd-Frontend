import { ReceivedUser } from './user';

export type SerializedMessage = {
    MessageID: number;
    RoomID: string;
    User: Pick<ReceivedUser, 'Username' | 'FullName' | 'ProfileImage' | 'ID'>;
    Content: string;
    Attachment: string;
    CreatedAt: string;
};

export type CreateMessageDTO = {
    Content: string;
    GroupID: number;
};

export type ReceivedTypingDTO = {
    IsTyping: boolean;
    Username: string;
    FullName: string;
};
export type SendIsTypingDTO = { IsTyping: boolean; GroupID: number };

export type ClientToServerEvents = {
    createMessage: (dto: CreateMessageDTO) => void;
    joinRoom: (dto: { ChatGroupId: number }) => void;
    leaveRoom: (dto: { ChatGroupId: number }) => void;
    typing: (data: SendIsTypingDTO) => void;
    deleteMessage: (data: { MessageID: number }) => void;
    editMessage: (data: { MessageID: number; Content: string }) => void;
};

export type ServerToClientEvents = {
    isTyping: (data: ReceivedTypingDTO) => void;
    newMessage: (message: SerializedMessage) => void;
    allMessages: (messages: SerializedMessage[]) => void;
    error: (data: any) => void; // TODO: fix this
    userStatus: (data: {
        username: string;
        status: 'online' | 'offline';
    }) => void;
};