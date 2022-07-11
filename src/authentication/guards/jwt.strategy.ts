import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorizationService } from '../services/auth/authorization.service';

@Injectable()
export class JwtStrategy implements CanActivate {

    constructor(private authorizationService: AuthorizationService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization){
            throw new UnauthorizedException();
        }

        return this.authorizationService.findByToken(authorization).then(user => {
            request.user = user;
            return true;
        }).catch(() => {
            throw new UnauthorizedException();
        });
    }

}