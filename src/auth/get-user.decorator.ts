import { createParamDecorator } from "@nestjs/common/decorators";
import { User } from "./auth.entity";

export const GetUser = createParamDecorator((data, ctx): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})