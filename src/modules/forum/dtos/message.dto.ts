import { Injectable } from '@nestjs/common';

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { tNumber } from '@/modules/core/helpers';
import { PaginateDto } from '@/modules/core/types';

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryMessageDto implements PaginateDto {
    /**
     * @description filter by channel
     * @type {string}
     */
    @ApiProperty({ description: '消息所属的频道UUID', type: 'string' })
    @IsUUID(undefined, { message: '频道ID格式错误' })
    @IsOptional()
    channel: string;

    /**
     * @description current page
     */
    @ApiProperty({
        description: '当前页',
        default: 1,
        minimum: 1,
        type: Number,
    })
    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    /**
     * @description number of messages displayed per page
     */
    @ApiProperty({
        description: '每页显示的消息数量',
        default: 10,
        minimum: 1,
        type: Number,
    })
    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '每页显示消息必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;
}

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateMessageDto {
    @ApiProperty({
        description: '消息标题',
        maxLength: 255,
        required: true,
    })
    @ApiPropertyOptional({
        required: false,
    })
    @MaxLength(255, {
        always: true,
        message: '消息标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '消息标题必须填写' })
    @IsOptional({ groups: ['update'] })
    title!: string;

    @ApiProperty({
        description: '消息内容',
        required: true,
    })
    @ApiPropertyOptional({
        required: false,
    })
    @IsNotEmpty({ groups: ['create'], message: '消息内容必须填写' })
    @IsOptional({ groups: ['update'] })
    content!: string;

    @ApiProperty({
        description: '消息所属频道ID',
        nullable: true,
        required: true,
        type: String,
    })
    @ApiPropertyOptional({
        nullable: false,
        required: false,
    })
    @IsUUID(undefined, { always: true, message: '所属频道的ID格式错误' })
    @IsDefined({ groups: ['create'], message: '所属频道的ID必须指定' })
    channel!: string;
}

@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    @ApiProperty({ description: '消息UUID', required: true })
    @IsUUID(undefined, { groups: ['update'], message: '消息ID格式错误' })
    @IsDefined({ groups: ['update'], message: '消息ID必须指定' })
    id!: string;
}
