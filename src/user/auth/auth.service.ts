import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import {UserType} from "@prisma/client"
import { SignupBody, SigninBody } from './../dto/auth.dto';
import { PrismaService } from './../../prisma/prisma.service';



@Injectable()
export class AuthService {

    constructor(private readonly prismaService:PrismaService){}

    async signup( {email, password, name, phone}:SignupBody, userType:UserType ) {
        const userExists = await this.prismaService.user.findUnique({
            where:{
                email,
            },
        })

        if (userExists) {
            throw new ConflictException("User with given email Already Exists!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prismaService.user.create({
            data:{
                email,
                name,
                phone,
                password:hashedPassword,
                user_type:userType
            }
        })

        const token = await this.generateJwt(newUser.name, newUser.id)

        return {token};
    }


    async signin( {email, password}:SigninBody ) {
        const userExists = await this.prismaService.user.findUnique({
            where:{
                email,
            },
        })

        if (!userExists) {
            throw new HttpException("Invalid Credentials!", 400);
        }

        const hashedPassword = userExists.password;

        const isInvalidPassword = await bcrypt.compare(password, hashedPassword)

        if(!isInvalidPassword) {
            throw new HttpException("Invalid Credentials!", 400);
        }

        const token = await this.generateJwt(userExists.name, userExists.id)

        return {token};
    }

    async generateProductKey(email:string, userType:UserType){
        const str = `${email}-${userType}-${process.env.PRODUCT_SECRET_KEY}`;

        return await bcrypt.hash(str, 10);
    }



    private async generateJwt(name:string, id:number){
        const token = await jwt.sign({
            name,
            id
        }, process.env.JSON_SECRET_KEY, {
            expiresIn:3600*24
        })

        return token;
    }
}
