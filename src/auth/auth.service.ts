import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { MailService } from 'src/mail-service/mail.service';

@Injectable()
export class AuthService {
  private otpStore = new Map<string, {otp:string, expiresAt:number}>();
  constructor(private userService:UsersService,
    private jwtServices:JwtService,
    private mailService:MailService
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

  //send otp
  async sendOTP(email:string) {
    const user = await this.userService.findByEmail(email)
    if(!user) {
      throw new UnauthorizedException('User not found')
    }
    const otp = crypto.randomInt(100000,999999).toString()

    //otp expires in 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await this.userService.updateUser(email, {otp,otpExpires})
    await this.mailService.sendOTP(email,otp)
    return {message:"OTP sent to email"}
  }

  async verifyOTP(email:string, enteredOtp:string) {
    const user = await this.userService.findByEmail(email);
    if(!user || !user.otp || !user.otpExpires) {
      throw new BadRequestException("No OTP found this email")
    }
    if(new Date() > user.otpExpires) {
      await this.userService.updateUser(email,{otp:undefined, otpExpires:undefined})
      throw new BadRequestException("OTP expired")
    }

    if(user.otp !== enteredOtp){
      throw new BadRequestException('Invalid OTP')
    }

    await this.userService.updateUser(email,{otp:undefined, otpExpires:undefined})

    return {
      message:"OTP verified successfully"
    }
  }

  async resetPassword(email:string, newPassword:string){
    const user = await this.userService.findByEmail(email)
    if(!user){
      throw new BadRequestException("User not found")
    }

    //hash new password
    const hashedPassword = await this.userService.hashPassword(newPassword)

    //reset password and clear otp
    await this.userService.updateUser(email,
     { password:hashedPassword,
      otp:undefined,
      otpExpires:undefined}
    )

    return {message:"Password updated successfully..!!"}
  }
}
