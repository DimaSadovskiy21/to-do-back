import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY } from 'common/constants';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard(STRATEGY.ACCESS) {}
