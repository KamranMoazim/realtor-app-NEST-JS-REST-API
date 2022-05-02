import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export interface UserInfo {
    id:number;
    name:string;
    email:string;
    phone:string;
} 


export const User = createParamDecorator((data, context:ExecutionContext)=>{
    const request = context.switchToHttp().getRequest();
    return request.user;
}) 