import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MessageResolvers } from "./message.resolvers";
import { MessageService } from "./message.service";

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
