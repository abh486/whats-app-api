import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'
import * as crypto from'crypto'
import { mailConstants } from "./mailConstants";
import { from } from "rxjs";

@Injectable()
export class MailService {
    private transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:mailConstants.email,
                pass:mailConstants.password
            },
        });
    }

    //create otp
    generateOTP():string {
        return crypto.randomInt(100000,999999).toString()
    }

    //send otp
    async sendOTP(to:string,otp:string) {
        const mailOptions = {
            from:mailConstants.email,
            to,
            subject:"Forgot Password",
            text:`Hi....!!
            Your OTP Code is : ${otp},
            OTP is valid for 10 minutes`
        }
        await this.transporter.sendMail(mailOptions);
    }
}