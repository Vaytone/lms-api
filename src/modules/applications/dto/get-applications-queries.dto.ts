import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetApplicationsQueriesDto {
  @IsString()
  @IsOptional()
  query: string;
  @IsIn(['email', 'created_at', 'full_name'])
  sortBy: string;
  @IsIn(['watcher', 'student', 'admin', 'all'])
  role: string;
  page: number;
}
