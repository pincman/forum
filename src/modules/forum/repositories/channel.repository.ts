import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/core/decorators';

import { ChannelEntity, MessageEntity } from '../entities';

/**
 * @description custom repository of channel entity
 * @export
 * @class ChannelRepository
 * @extends {Repository<ChannelEntity>}
 */
@CustomRepository(ChannelEntity)
export class ChannelRepository extends Repository<ChannelEntity> {
    /**
     * @description build a base query for channel
     */
    buildBaseQuery() {
        return (
            this.createQueryBuilder('channel')
                // add messages relation
                .leftJoinAndSelect('channel.messages', 'messages')
                // count the number of messages
                .addSelect((subQuery) => {
                    return subQuery
                        .from(MessageEntity, 'm')
                        .select('COUNT(m.id)', 'count')
                        .where('m.channel.id = channel.id');
                }, 'messageCount')
                .loadRelationCountAndMap('channel.messageCount', 'channel.messages')
        );
    }
}
