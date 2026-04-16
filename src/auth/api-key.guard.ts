import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.header('x-api-key');
    const validApiKey = 'replace_with_sha256_hex_hash;'

    if (!apiKey) {
      throw new UnauthorizedException('Missing API key');
    }

    // hash incoming key
    const incomingHash = createHash('sha256').update(apiKey).digest();

    // look up client by key prefix or id in DB
    const client = await fakeFindClientByPrefix(apiKey.slice(0, 8));
    if (!client) {
      throw new UnauthorizedException('Invalid API key');
    }

    const storedHash = Buffer.from(client.keyHash, 'hex');

    if (
      storedHash.length !== incomingHash.length ||
      !timingSafeEqual(storedHash, incomingHash)
    ) {
      throw new UnauthorizedException('Invalid API key');
    }

    request.client = client;
    return true;
  }
}

// replace with real DB query
async function fakeFindClientByPrefix(prefix: string) {
  return {
    id: '123',
    name: 'Example Client',
    keyHash: 'replace_with_sha256_hex_hash',
  };
}