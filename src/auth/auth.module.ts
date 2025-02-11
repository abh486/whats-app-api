import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwtConstants';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema, userSchemaName } from 'src/models/UserModel';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail-service/mail.module';

@Module({
  imports:[
    UsersModule,
    MailModule,
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions:{expiresIn:jwtConstants.jwtExpires}
    }),
    MongooseModule.forFeature([{name:userSchemaName,schema:userSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
