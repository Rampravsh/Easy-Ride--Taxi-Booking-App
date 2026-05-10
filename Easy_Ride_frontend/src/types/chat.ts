export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  type?: 'text' | 'image' | 'location';
}

export interface ChatSession {
  id: string;
  participantName: string;
  participantAvatar?: any;
  messages: Message[];
}
