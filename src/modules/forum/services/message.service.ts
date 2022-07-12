import { Injectable } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { EntityNotFoundError } from 'typeorm';

import { CreateMessageDto, QueryMessageDto, UpdateMessageDto } from '../dtos';
import { ChannelEntity, MessageEntity } from '../entities';

import { ChannelRepository, MessageRepository } from '../repositories';
/**
 * 消息查询参数
 */
type FindParams = {
    [key in keyof Omit<QueryMessageDto, 'limit' | 'page'>]: QueryMessageDto[key];
};
@Injectable()
export class MessageService {
    constructor(
        protected messageRepository: MessageRepository,
        protected channelRepository: ChannelRepository,
    ) {}

    /**
     * @description find messages by paginate
     */
    async list(params: FindParams, options: IPaginationOptions) {
        let query = this.messageRepository.buildBaseQuery().orderBy('message.createdAt', 'DESC');
        if (!isNil(params.channel)) {
            query = query.where('channel.id = :channel', { channel: params.channel });
        }
        return paginate<MessageEntity>(query, options);
    }

    /**
     * @description get detail of one message
     * @param {string} id
     */
    async findOne(id: string) {
        const item = this.messageRepository
            .buildBaseQuery()
            .where('message.id = :id', { id })
            .getOne();
        if (isNil(item)) throw new EntityNotFoundError(MessageEntity, `Message ${id} not exists!`);
        return item;
    }

    /**
     * @description create a message
     * @param {CreateMessageDto} data
     */
    async create(data: CreateMessageDto) {
        const item = await this.messageRepository.save({
            ...data,
            channel: await this.getChannel(data.channel),
        });
        return this.messageRepository.findOneOrFail({ where: { id: item.id } });
    }

    /**
     * @description update a new message
     * @param {UpdateMessageDto} data
     */
    async update(data: UpdateMessageDto) {
        const message = await this.findOne(data.id);
        if (data.channel) {
            const channel = await this.channelRepository.findOneOrFail({
                where: { id: data.channel },
            });
            message.channel = channel;
            await message.save();
        }
        await this.messageRepository.update(data.id, omit(data, ['id', 'channel']));
        return this.findOne(data.id);
    }

    /**
     * @description delete one message
     * @param {string} id
     */
    async delete(id: string) {
        const message = await this.messageRepository.findOne({ where: { id } });
        if (!message) throw new EntityNotFoundError(MessageEntity, `Message ${id} not exists!`);
        return this.messageRepository.remove(message);
    }

    /**
     * @description get the channel instance for create or update
     * @protected
     * @param {string} id
     */
    protected async getChannel(id: string) {
        const channel = await this.channelRepository.findOne({ where: { id } });
        if (isNil(channel)) {
            throw new EntityNotFoundError(
                ChannelEntity,
                `The channel ${id} which message belongs not exists!`,
            );
        }
        return channel;
    }
}
