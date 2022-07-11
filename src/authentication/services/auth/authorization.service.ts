import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../model/user';
import { UserRepository } from '../../repositories/user/user.repository';
import { TokenRepository } from '../../repositories/token/token.repository';

@Injectable()
export class AuthorizationService {

    constructor(
        private tokenRepository: TokenRepository,
        private userRepository: UserRepository
    ){}

    async findByToken(token: string) : Promise<User> {
        const authHeader = token.replace("Bearer ", "");

        return this.tokenRepository.verifyToken(authHeader).then(decodedToken => {
            return this.userRepository.findByUid(decodedToken.sub).then(user => {
                if (!user) {
                    throw new UnauthorizedException();
                }
                return user;
            });
        }).catch(error => {
            throw new UnauthorizedException(error);
        });
    }

}