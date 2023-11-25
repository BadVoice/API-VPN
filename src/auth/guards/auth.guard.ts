import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { DatabaseService } from 'src/database/database.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private prisma: DatabaseService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
  
      if (!token) {
        throw new UnauthorizedException();
      }
  
      const { id } = await this.jwtService.verifyAsync(token).catch(() => {
        throw new ForbiddenException();
      });
  
      const user = await this.prisma.user
        .findUnique({ where: { id } })
        .catch(() => {
          throw new UnauthorizedException();
        });
  
      if (!user) throw new UnauthorizedException();
  
      request['user'] = user;
  
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  