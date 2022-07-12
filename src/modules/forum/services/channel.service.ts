import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { CreateChannelDto, UpdateChannelDto } from '../dtos';

import { ChannelEntity } from '../entities';

import { ChannelRepository } from '../repositories';

@Injectable()
export class ChannelService {
    constructor(protected channelRepository: ChannelRepository) {}

    /**
     * @description find all channels
     */
    async list() {
        return this.channelRepository.buildBaseQuery().orderBy('channel.order', 'ASC').getMany();
    }

    /**
     * @description get detail of one channel
     * @param {string} id
     */
    async findOne(id: string) {
        const item = this.channelRepository
            .buildBaseQuery()
            .where('channel.id = :id', { id })
            .getOne();
        if (isNil(item)) throw new EntityNotFoundError(ChannelEntity, `Channel ${id} not exists!`);
        return item;
    }

    /**
     * @description create a channel
     * @param {CreateChannelDto} data
     */
    async create(data: CreateChannelDto) {
        const item = await this.channelRepository.save(data);
        return this.findOne(item.id);
    }

    /**
     * @description update a channel
     * @param {UpdateChannelDto} data
     */
    async update(data: UpdateChannelDto) {
        const { id, ...querySet } = data;
        if (Object.keys(querySet).length > 0) {
            await this.channelRepository.update(id, querySet);
        }
        return this.findOne(data.id);
    }

    /**
     * @description delete a channel
     * @param {string} id
     */
    async delete(id: string) {
        const category = await this.channelRepository.findOneOrFail({ where: { id } });
        await this.channelRepository.remove(category);
        return category;
    }
}
