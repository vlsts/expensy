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
        const frontendAPI = this.configService.get<string>('FRONTEND_API');
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
        return this.validateRequest(request);
    }

    async validateRequest(request): Promise<boolean> {
        let sessionToken = request.headers['authorization'];

        if (!sessionToken) {
            return false;
        }

        try {
            // remove "Bearer " from the auth token
            sessionToken = sessionToken.split(' ')[1];
            const user = await this.sdk.sessions().validateToken(sessionToken);

            console.log(`User with ID ${user.userId} is authenticated!`);
            return true;
        } catch (e) {
            console.log(e);

            return false;
        }
    }
}
