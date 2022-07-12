import { Injectable } from '@nestjs/common';

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { IsUnique, IsUniqueExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { ChannelEntity } from '../entities';

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateChannelDto {
    @ApiProperty({ description: '频道名称,名称唯一', uniqueItems: true, required: true })
    @ApiPropertyOptional({ required: false })
    @IsUnique(ChannelEntity, {
        groups: ['create'],
        message: '分类名称重复',
    })
    @IsUniqueExist(ChannelEntity, {
        groups: ['update'],
        message: '分类名称重复',
    })
    @MaxLength(25, {
        always: true,
        message: '频道名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '频道名称不得为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;
}

@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdateChannelDto extends PartialType(CreateChannelDto) {
    @ApiProperty({ description: '频道UUID', required: true })
    @IsUUID(undefined, { groups: ['update'], message: '频道ID格式错误' })
    @IsDefined({ groups: ['update'], message: '频道ID必须指定' })
    id!: string;
}
