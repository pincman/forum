import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { MessageEntity } from '../entities';

import { SanitizeService } from '../services/sanitize.service';

/**
 * @description filter html tags of message content
 * @export
 * @class MessageSubscriber
 * @implements {EntitySubscriberInterface<MessageEntity>}
 */
@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<MessageEntity> {
    constructor(dataSource: DataSource, protected sanitizeService: SanitizeService) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return MessageEntity;
    }

    /**
     * @description sanitize the content
     * @param {MessageEntity} entity
     */
    async afterLoad(entity: MessageEntity) {
        entity.title = this.sanitizeService.sanitize(entity.title, {
            allowedTags: [],
            allowedAttributes: {},
        });
        entity.content = this.sanitizeService.sanitize(entity.content);
    }
}
