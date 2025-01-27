import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SDK, Config } from '@corbado/node-sdk';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    sdk: SDK;

    constructor(private configService: ConfigService) {
        const projectID = this.configService.get<string>('PROJECT_ID');
        const apiSecret = this.configService.get<string>('CORBADO_API');
        const frontendAPI = this.configService.get<string>(
            'CORBADO_FRONTEND_URL',
        );
        const backendAPI = this.configService.get<string>('BACKEND_API');

        const config = new Config(
            projectID,
            apiSecret,
            frontendAPI,
            backendAPI,
        );
        this.sdk = new SDK(config);
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request).then((response) => {
            if (response === null) {
                return false;
            }

            request.userId = response;

            return true;
        });
    }

    private extractToken(request): string | null {
        // Check Bearer token
        const authHeader = request.headers['authorization'];
        if (authHeader) {
            return authHeader.split(' ')[1];
        }

        // Check Corbado cookies
        const cookies = request.cookies;
        return (
            cookies['cbo_short_session'] || cookies['cbo_session_token'] || null
        );
    }

    async validateRequest(request): Promise<null | string> {
        const sessionToken = this.extractToken(request);

        if (!sessionToken) {
            return null;
        }

        try {
            const user = await this.sdk.sessions().validateToken(sessionToken);
            console.log(`User with ID ${user.userId} is authenticated!`);
            return user.userId;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
