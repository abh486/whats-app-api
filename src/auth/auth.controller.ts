import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';



@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body:{username:string,password:string}){
    const user = await this.authService.validateUser(body.username,body.password);
    if(!user){
      throw new UnauthorizedException('Invalid username or password')
    }
    return this.authService.login(user)
  }

  @Post('send-otp')
  async sendOTP(@Body('email') email:string) {
    return this.authService.sendOTP(email)
  }

  @Post('verify-otp')
  async verifyOTp(@Body("email") email:string, @Body('otp') otp:string){
    return this.authService.verifyOTP(email,otp)
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email:string, @Body('newPassword') newPassword:string) {
    return this.authService.resetPassword(email,newPassword)
  }
  
}
