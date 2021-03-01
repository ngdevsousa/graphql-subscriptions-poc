import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AppController } from "./health/health.controller";
import { AppService } from "./health/health.service";
import { MessageResolvers } from "./messages/message.resolvers";
import { MessageService } from "./messages/message.service";

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      typePaths: ["./**/*.graphql"],
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        if (connection) return { connection };
      },
      subscriptions: {
        onConnect: (params: any) => {
          return { token: params.authorization };
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MessageService,
    MessageResolvers,
    { provide: "PUB_SUB", useValue: new PubSub() }
  ]
})
export class AppModule {}
