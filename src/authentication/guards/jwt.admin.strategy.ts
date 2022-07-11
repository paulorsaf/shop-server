import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserType } from '../model/user-type';
import { AuthorizationService } from '../services/auth/authorization.service';

@Injectable()
export class JwtAdminStrategy implements CanActivate {

    constructor(private authorizationService: AuthorizationService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization){
            throw new UnauthorizedException();
        }
        
        return this.authorizationService.findByToken(authorization).then(user => {
            if (user.type != UserType.ADMIN){
                throw new UnauthorizedException();
            }
            request.user = user;
            return true;
        })
    }

}