import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: DatabaseService,
    private jwtService: JwtService
  ) {}

  async canActivate( context: ExecutionContext) {
    const requiredRolesFromClass = this.reflector.get<Role[]>(ROLES_KEY, context.getClass());
    const requiredRolesFromHandler = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    const requiredRoles = [
     ...(requiredRolesFromClass || []),
     ...(requiredRolesFromHandler || [])
    ];
  
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Authorization header is malformed');
    }
    
    const token = parts[1];
    const decodedToken = this.jwtService.verify(token);
    const userId = decodedToken.id;

    const user  = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new UnauthorizedException();
    }
  
    if (!user.role) {
      throw new UnauthorizedException();
    }

    if (user.role === Role.Admin) {
      return true;
    }

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    
    return userRoles.some((role) => requiredRoles.includes(role));
  }
}