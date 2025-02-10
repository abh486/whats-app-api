import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema, userSchemaName } from 'src/models/UserModel';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:userSchemaName,schema:userSchema
    }])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
