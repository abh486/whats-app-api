import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, userSchemaName } from 'src/models/UserModel';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(userSchemaName) private readonly userModel:Model<User>
  ){}

  async getByUserName(username:string){
    return await this.userModel.findOne({username})
  }
}
