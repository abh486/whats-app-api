import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginDto{

    //username
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username:string;

    //email
    @IsNotEmpty()
    @IsEmail()
    email:string;

    //password
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    password:string;
}