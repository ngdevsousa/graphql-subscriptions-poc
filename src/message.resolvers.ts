import { Inject, Logger } from "@nestjs/common";
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription
} from "@nestjs/graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { MessageService, IMessage } from "./message.service";

const CH_PREFIX = "channel";
const SND_PREFIX = "sender";

@Resolver("Message")
export class MessageResolvers {
  logger: Logger;

  constructor(
    @Inject("PUB_SUB") private pubSub: PubSubEngine,
    private readonly messageService: MessageService
  ) {
    this.logger = new Logger(MessageResolvers.name);
  }

  @Query("messages")
  async findMessages(): Promise<Array<IMessage>> {
    return this.messageService.findAll();
  }

  @Mutation("sendMessage")
  async sendMessage(
    @Args("text") text: string,
    @Args("channel") channel: string,
    @Args("senderId") senderId: string
  ) {
    const chEventName = `${CH_PREFIX}_${channel}`;
    const sndEventName = `${SND_PREFIX}_${senderId}`;
    const newMessage: IMessage = {
      text,
      channel,
      senderId
    };

    const msg = this.messageService.addMessage(newMessage);
    this.pubSub.publish(chEventName, { ["channelMessage"]: msg });
    this.pubSub.publish(sndEventName, { ["senderMessage"]: msg });

    return msg;
  }

  @Mutation("deleteMessage")
  async deleteMessage(@Args("messageId") messageId: string) {
    return this.messageService.delete(messageId);
  }

  @Subscription("channelMessage")
  subscribeToChannel(@Context() ctx, @Args("channel") channel: string) {
    // TODO: Add auth
    // const token: string = ctx.connection.context.token;
    // if (!token) throw new Error("Invalid credentials");
    const eventName = `${CH_PREFIX}_${channel}`;

    this.logger.log(`New subscription on ${eventName}`);
    return this.pubSub.asyncIterator(eventName);
  }

  @Subscription("senderMessage")
  subscribeToSender(@Context() ctx, @Args("senderId") senderId: string) {
    const eventName = `${SND_PREFIX}_${senderId}`;

    this.logger.log(`New subscription on ${eventName}`);
    return this.pubSub.asyncIterator(eventName);
  }
}
