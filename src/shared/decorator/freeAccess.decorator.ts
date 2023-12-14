import { SetMetadata } from '@nestjs/common';

export const IS_FREE_ACCESS_KEY = 'isFreeAccess';
export const FreeAccess = () => SetMetadata(IS_FREE_ACCESS_KEY, true);
