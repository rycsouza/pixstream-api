import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  health() {
    return { status: 'ok' };
  }
}
