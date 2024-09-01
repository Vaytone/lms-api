import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetGroupsQueriesDto {
  @IsString()
  @IsOptional()
  query: string;
  page: number;
}
