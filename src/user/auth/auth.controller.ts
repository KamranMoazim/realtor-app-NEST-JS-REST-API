import { Controller, Post, Body, Param, ParseEnumPipe, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { UserType } from '@prisma/client';


import { SignupDto, SigninDto, GenerateProductKeyDto } from '../dto/auth.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}

    @Post("/signup/:userType")
    async signup(
        @Body() body:SignupDto,
        @Param("userType", new ParseEnumPipe(UserType)) userType:UserType=UserType.BUYER
    ){

        if (userType !== UserType.BUYER) {
            if (!body.productKey) {
                throw new UnauthorizedException();
            }

            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_SECRET_KEY}`;

            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

            if (!isValidProductKey) {
                throw new UnauthorizedException();
            }
        }
        return this.authService.signup(body, userType);
    }

    @Post("/signin")
    signin(
        @Body() body:SigninDto
    ){
        return this.authService.signin(body);
    }

    @Post("/key")
    generateProductKey(
        @Body() {email, userType}:GenerateProductKeyDto
    ){
        return this.authService.generateProductKey(email, userType);
    }
}
