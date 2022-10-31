import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Role } from "src/user/role.enum";
import { JwtStrategy } from "./jwt.strategy";
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtAuthenticationGuard from "./jwt-authentication.guard";


const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
 
      const request = context.switchToHttp().getRequest();
      const user = request.user;
 
      return user?.role.includes(role);
    }
  };
 
  return mixin(RoleGuardMixin);
};
 
export default RoleGuard;