import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './auth.entity';
import { UserRepository } from './auth.repository';
import { Request } from 'express';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
            jwtFromRequest: ExtractJwt.fromExtractors([
              (request: Request) => {
                return request?.cookies?.Authentication;
              },
            ])
        })
    }

    async validate(payload) {
        const { username } = payload;
        const user: User = await this.userRepository.findOneBy( {username} );
        
        if(!user) {
            throw new UnauthorizedException();
        }

        return  {
            id: user.id,
            username: user.username,
            name: user.name
        };
    }
}
