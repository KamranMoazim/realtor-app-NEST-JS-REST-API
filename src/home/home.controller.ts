import { Controller, Get, Post, Put, Delete, Query, Param, ParseIntPipe, Body, UnauthorizedException, UseGuards } from '@nestjs/common';

import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guards';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { HomeService } from './home.service';
import { Roles } from './../user/decorators/roles.decorators';

@Controller('home')
export class HomeController {

    constructor(private readonly homeService:HomeService){}

    @Get()
    async getHomes(
        @Query("city") city:string,
        @Query("minPrice") minPrice:string,
        @Query("maxPrice") maxPrice:string,
        @Query("propertyType") propertyType:PropertyType,
    ) : Promise<HomeResponseDto[]> {

        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte:parseFloat(minPrice)}),
            ...(maxPrice && {lte:parseFloat(maxPrice)}),
        } : undefined

        const filters = {
            ...(city && {city}),
            ...(price && {price}),
            ...(propertyType && {propertyType}),
        };
        return await this.homeService.getHomes(filters);
    }

    @Get(":id")
    getHomeById(
        @Param("id", ParseIntPipe) id:number
    ){
        return this.homeService.getHomeById(id)
    }

    @Roles(UserType.ADMIN, UserType.REALTOR)
    @UseGuards(AuthGuard)
    @Post()
    createHome(
        @Body() body:CreateHomeDto,
        @User() user:UserInfo
    ){
        // return this.homeService.createHome(body, user.id)
        return "createHome";
    }

    @Put(":id")
    async updateHome(
        @Param("id", ParseIntPipe) id:number,
        @Body() body:UpdateHomeDto,
        @User() user:UserInfo
    ){
        // console.log(body)
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if (realtor.id !== user.id) {
            throw new UnauthorizedException();
            
        }

        return this.homeService.updateHomeById(id, body);
    }

    @Delete(":id")
    async deleteHome(
        @Param("id", ParseIntPipe) id:number,
        @User() user:UserInfo
    ){
        const realtor = await this.homeService.getRealtorByHomeId(id);
        if (realtor.id !== user.id) {
            throw new UnauthorizedException();
            
        }

        this.homeService.deleteHomeById(id);
    }


    @Get("/me")
    me(@User() user:UserInfo){
        return user
    }
}
