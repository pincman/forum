import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/core/decorators';

import { MessageEntity } from '../entities';

/**
 * @description custom the repository of message entity
 * @export
 * @class MessageRepository
 * @extends {Repository<MessageEntity>}
 */
@CustomRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {
    /**
     * @description build a base query for messasge
     */
    buildBaseQuery() {
        //  add channel relation
        return this.createQueryBuilder('message').leftJoinAndSelect('message.channel', 'channel');
    }
}
