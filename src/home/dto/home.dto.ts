import { Exclude, Expose, Type } from "class-transformer";

import { PropertyType } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";



export class HomeResponseDto {
    id:number;
    address:string;
    price:number;
    propertyType:PropertyType;
    image:string;
    city :string;

    @Exclude()
    number_of_bedrooms:number;
    @Expose({name:"numberOfBedrooms"})
    numberOfBedrooms(){
        return this.number_of_bathrooms
    }


    @Exclude()
    number_of_bathrooms:number;
    @Expose({name:"numberOfBathrooms"})
    numberOfBathrooms(){
        return this.number_of_bathrooms
    }

    @Exclude()
    listed_date:Date;
    @Expose({name:"listedDate"})
    listedDate(){
        return this.listed_date
    }

    @Exclude()
    land_size:number;
    @Expose({name:"landSize"})
    landSize(){
        return this.land_size
    }


    @Exclude()
    created_at:Date;
    @Exclude()
    updated_at:Date;


    constructor(partial: Partial<HomeResponseDto>){
        Object.assign(this, partial);
    }
}

class Image {
    @IsString()
    @IsNotEmpty()
    url:string
}

export class CreateHomeDto {

    @IsString()
    @IsNotEmpty()
    address:string;

    @IsNumber()
    @IsPositive()
    numberOfBedrooms:number;

    @IsNumber()
    @IsPositive()
    numberOfBathrooms:number;

    @IsString()
    @IsNotEmpty()
    city :string;

    @IsNumber()
    @IsPositive()
    price:number;

    @IsNumber()
    @IsPositive()
    landSize:number;

    @IsEnum(PropertyType)
    propertyType:PropertyType;

    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>Image)
    images:Image[];

}


export class UpdateHomeDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address:string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBedrooms:number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBathrooms:number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city :string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price:number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    landSize:number;

    @IsOptional()
    @IsEnum(PropertyType)
    propertyType:PropertyType;

}



export interface GetHomeFilters {
    city?:string;
    price?:{
        gte?:number;
        lte?:number;
    }
    propertyType?:PropertyType;
}


export interface CreateHomeParams {
    address:string;
    numberOfBedrooms:number;
    numberOfBathrooms:number;
    city :string;
    price:number;
    landSize:number;
    propertyType:PropertyType;
    images:Image[];
}

export interface UpdateHomeParams {
    address?:string;
    numberOfBedrooms?:number;
    numberOfBathrooms?:number;
    city?:string;
    price?:number;
    land_size?:number;
    propertyType?:PropertyType;
}