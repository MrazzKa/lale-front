import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    const authHeader = request.headers.authorization;
    const rawRoleHeader = request.headers.role ?? '';

    const roles = String(rawRoleHeader)
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean);

    request.user = { roles };

    return !!authHeader;
  }
}