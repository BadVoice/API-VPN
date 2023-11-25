import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
        ) {}

    async signIn(email: string, pass: string) {
        const user = await this.userService.login(email, pass)
        .then(user => {
            if(!user) throw new UnauthorizedException({ success: false, 'error': 'Invalid credential' }) 
            else {
                delete user.password;
                delete user.email;
                return user
            } 
          });
          
       
        const access_token = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role
        })

        return { success: true, access_token, user };
    }
}


