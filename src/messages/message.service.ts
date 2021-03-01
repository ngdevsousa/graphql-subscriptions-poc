import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

export interface IMessage {
  id?: string;
  senderId: string;
  text: string;
  channel: string;
}

@Injectable()
export class MessageService {
  messages: Array<IMessage> = [];

  addMessage(data: IMessage): IMessage {
    const newMessage: IMessage = { ...data, id: uuid() };
    this.messages.push(newMessage);
    return newMessage;
  }

  findAll(): Array<IMessage> {
    return this.messages;
  }

  findBySenderId(senderId: string): Array<IMessage> {
    return this.messages.filter((m) => m.senderId === senderId);
  }

  delete(messageId: string): string {
    this.messages = this.messages.filter((m) => m.id !== messageId);
    return messageId;
  }
}
