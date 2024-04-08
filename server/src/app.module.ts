import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageModule } from './messages/message.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './rooms/room.module';
import { SocketModule } from './sockets/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const userName = configService.get('MONGO_USERNAME');
        const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_DATABASE');
        const host = configService.get('MONGO_HOST');

        return {
          uri: `mongodb://${userName}:${password}@${host}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    MessageModule,
    UserModule,
    AuthModule,
    RoomModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
