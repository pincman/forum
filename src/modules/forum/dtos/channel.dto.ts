import { Injectable } from '@nestjs/common';

import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { DataSource } from 'typeorm';

import { IsUnique, IsUniqueExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { ChannelEntity } from '../entities';

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateChannelDto {
    constructor(private dataSource: DataSource) {}

    /**
     * @description this function is for isunique validator
     */
    getManager() {
        return this.dataSource;
    }

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
    @IsUUID(undefined, { groups: ['update'], message: '频道ID格式错误' })
    @IsDefined({ groups: ['update'], message: '频道ID必须指定' })
    id!: string;
}
