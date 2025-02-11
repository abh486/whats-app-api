import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, userSchemaName } from 'src/models/UserModel';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(userSchemaName) private readonly userModel:Model<User>
  ){}

  async getByUserName(username:string) : Promise <User | null>{
    return await this.userModel.findOne({username})
  }

  async findByEmail(email:string) {
    return await this.userModel.findOne({email}).exec()
  }

  async updateUser(email:string, updateData: Partial<User>) {
    return await this.userModel.findOneAndUpdate({email},{$set:updateData}, {new:true})
  }

  async hashPassword(password:string) : Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
  }
}
