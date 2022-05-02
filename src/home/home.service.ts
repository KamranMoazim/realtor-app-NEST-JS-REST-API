import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { HomeResponseDto, GetHomeFilters, CreateHomeParams, UpdateHomeParams } from './dto/home.dto';



const homeSelect = {
    id:true,
    address:true,
    price:true,
    propertyType:true,
    city:true,
    number_of_bathrooms:true,
    number_of_bedrooms:true,
    listed_date:true,
    land_size:true,
}


@Injectable()
export class HomeService {

    constructor(private readonly prismaService:PrismaService){}

    async getHomes(
        filters:GetHomeFilters
    ) : Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany({
            select:{
                ...homeSelect,
                images: {
                    select: {
                        url:true
                    },
                    take:1
                }
            },
            where:filters
        });

        if (!homes.length) {
            throw new NotFoundException();
        }

        return homes.map((home)=>{
            const fetchHome = {...home, image:home.images[0].url}
            delete fetchHome.images;
            return new HomeResponseDto(fetchHome);
        })
    }

    async getHomeById(id:number) {
        const home = await this.prismaService.home.findFirst({
            where:{
                id
            },
            select:{
                ...homeSelect,
                images: {
                    select: {
                        url:true
                    }
                },
                realtor:{
                    select:{
                        name:true,
                        email:true,
                        phone:true
                    }
                }
            }
        })

        if (!home) {
            throw new NotFoundException();   
        }

        return new HomeResponseDto(home);
    }

    async createHome({
        address,
        numberOfBathrooms,
        numberOfBedrooms,
        city,
        price,
        propertyType,
        landSize,
        images}:CreateHomeParams, 
        id:number
        ){
        const home = await this.prismaService.home.create({
            data:{
                address,
                number_of_bathrooms:numberOfBathrooms,
                number_of_bedrooms:numberOfBedrooms,
                city,
                price,
                propertyType,
                land_size:landSize,
                realtor_id:id
            }
        })

        // const homeImages = await this.prismaService.image.createMany({
        //     data:[{ url:"images", home_id:4 }]
        // })

        const homeImages = images.map((image)=>{
            return {...image, home_id:home.id}
        })

        await this.prismaService.image.createMany({
            data:homeImages
        })

        return new HomeResponseDto(home);

    }

    async updateHomeById(id,{address,numberOfBathrooms,numberOfBedrooms,city,price,propertyType,land_size}:UpdateHomeParams){

        const data = {
            address,
            city,
            price,
            propertyType,
            land_size,
            number_of_bedrooms:numberOfBedrooms,
            number_of_bathrooms:numberOfBathrooms,
        }
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            }
        })

        if (!home) {
            throw new NotFoundException();
        }

        const updatedHome = await this.prismaService.home.update({
            where:{
                id
            },
            data
        })

        return new HomeResponseDto(updatedHome);
    }

    async deleteHomeById(id){
        await this.prismaService.image.deleteMany({
            where:{
                home_id:id
            }
        })

        await this.prismaService.home.delete({
            where:{
                id
            }
        })
    }

    async getRealtorByHomeId(id:number){
        const home = await this.prismaService.home.findUnique({
            where:{
                id
            },
            select:{
                realtor:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        phone:true
                    }
                }
            }
        })
        if(!home){
            throw new NotFoundException();
        }

        return home.realtor;
    }
}
