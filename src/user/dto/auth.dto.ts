import { UserType } from "@prisma/client";
import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, IsEnum, IsOptional } from "class-validator";




export class SignupDto {

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsEmail()
    email:string;

    @IsString()
    @MinLength(5)
    password:string;

    @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {message:"Phone Number is not Valid."})
    phone:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    productKey:string;
}



export class SigninDto {

    @IsEmail()
    email:string;

    @IsString()
    @MinLength(5)
    password:string;

}




export class GenerateProductKeyDto {

    @IsEmail()
    email:string;

    @IsEnum(UserType)
    userType:UserType;

}



export interface SignupBody {
    name:string;
    email:string;
    password:string;
    phone:string;
    productKey?:string;
}


export interface SigninBody {
    email:string;
    password:string;
}