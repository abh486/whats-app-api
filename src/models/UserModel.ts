import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({
    timestamps:true
})
export class User extends Document{
    @Prop({required:true})
    username:string;

    @Prop({required:true,unique:true})
    email:string

    @Prop({required:true,min:6,max:20})
    password:string

}

export const userSchema = SchemaFactory.createForClass(User)

export const userSchemaName ='users';