import { ReceivedUser } from './user';

export type SerializedMessage = {
    MessageID: number;
    RoomID: string;
    User: Pick<ReceivedUser, 'Username' | 'FullName' | 'ProfileImage' | 'ID'>;
    Content: string;
    Type: 'MESSAGE' | 'IMAGE';
    CreatedAt: string;
    IsDeleted: boolean;
    Reactions?: {
        MessageID: number;
        Reaction: string;
        User: Pick<
            ReceivedUser,
            'Username' | 'FullName' | 'ProfileImage' | 'ID'
        >;
    }[];
    RepliedToMessage?: SerializedMessage;
};

export type CreateMessageDTO = {
    RepliedToMessageID?: number;
    Content: string;
    Type: 'MESSAGE' | 'IMAGE';
    GroupID: number;
};

export type UpdateMessageDTO = {
    Content: string;
    MessageID: number;
};

export type DeleteMessageDTO = {
    MessageID: number;
};

export type ReceivedTypingDTO = {
    IsTyping: boolean;
    Username: string;
    FullName: string;
};

export type MessageInfo = {
    MessageID: number;
    UserID: number;
    Username: string;
    FullName: string;
    ProfileImage: string;
    ReadAt: string; // Date
};

export type ReactToMessageDTO = {
    MessageID: number;
    Reaction: string;
};

export type SendIsTypingDTO = { IsTyping: boolean; GroupID: number };

export type ClientToServerEvents = {
    createMessage: (dto: CreateMessageDTO) => void;
    joinRoom: (dto: { ChatGroupId: number }) => void;
    leaveRoom: (dto: { ChatGroupId: number }) => void;
    typing: (data: SendIsTypingDTO) => void;
    deleteMessage: (data: DeleteMessageDTO) => void;
    editMessage: (data: UpdateMessageDTO) => void;
    getMessageInfo: (data: DeleteMessageDTO) => void;
    leaveMessageInfoRoom: (data: DeleteMessageDTO) => void;
    reactToMessage: (data: ReactToMessageDTO) => void;
};

export type ServerToClientEvents = {
    isTyping: (data: ReceivedTypingDTO) => void;
    newMessage: (message: SerializedMessage) => void;
    allMessages: (messages: SerializedMessage[]) => void;
    editedMessage: (message: SerializedMessage) => void;
    error: (data: any) => void; // TODO: fix this
    messageInfo: (data: any) => void; // TODO: fix this
    newMessageReadInfo: (data: any) => void; // TODO: fix this
    userStatus: (data: {
        username: string;
        status: 'online' | 'offline';
    }) => void;
};
