import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private userService:UsersService,
    private jwtServices:JwtService
  ){}
  async validateUser(username:string,password:string,) : Promise<any>{
    //check user by name
    const user = await this.userService.getByUserName(username)

    if(!user){
      throw new UnauthorizedException("User not found")
    }

    //check password
    const validatePassword =  await bcrypt.compare(password, user.password)

    if(user && validatePassword){
      return user
    }
    return null
  }

  //user login
  async login(user:any) {
    const payload = {email:user.email, sub:user._id};
    return{
      access_token:this.jwtServices.sign(payload)
    }
  }
}
