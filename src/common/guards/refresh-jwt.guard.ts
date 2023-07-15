import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY } from 'common/constants';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard(STRATEGY.REFRESH) {}
