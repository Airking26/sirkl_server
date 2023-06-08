import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateNotificationDTO{
    @ApiPropertyOptional({type: String, isArray: true})
    @IsOptional()
    readonly hasBeenRead: string[]
}