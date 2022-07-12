import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { MessageEntity } from './message.entity';

/**
 * @description channel model
 * @export
 * @class ChannelEntity
 * @extends {BaseEntity}
 */
@Exclude()
@Entity('forum_channels')
export class ChannelEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: 'channel name' })
    name!: string;

    // expose the order column  only when the channel itself is queried
    // to avoid the embedded channel relation exposing too much redundant information
    // when querying the message
    @Expose({ groups: ['channel-list', 'channel-detail'] })
    @Column({ comment: 'the order of channel', default: 0 })
    order!: number;

    /**
     * expose the order column  only when the channel itself is queried like order
     * @description statistics on the number of messages in the channel
     * @type {number}
     */
    @Expose({ groups: ['channel-list', 'channel-detail'] })
    messageCount!: number;

    @OneToMany(() => MessageEntity, (message) => message.channel, {
        cascade: true,
    })
    messages!: MessageEntity[];
}
