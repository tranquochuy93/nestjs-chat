import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './http/controllers/user.controller';
import { User, UserSchema } from './shemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
