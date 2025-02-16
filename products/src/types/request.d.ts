import { Request } from 'express';
import { IOffsetLimit } from './offset-limit';

declare module 'express' {
  export interface Request extends IOffsetLimit {}
}
