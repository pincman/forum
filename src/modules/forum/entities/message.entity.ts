import { Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { ChannelEntity } from './channel.entity';

/**
 * @description message model
 * @export
 * @class MessageEntity
 * @extends {BaseEntity}
 */
@Expose()
@Entity('forum_messages')
export class MessageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: 'message title' })
    title!: string;

    @Column({ comment: 'message body' })
    content!: string;

    @Type(() => Date)
    @CreateDateColumn({
        comment: 'created time of message',
    })
    createdAt!: Date;

    @ManyToOne(() => ChannelEntity, (channel) => channel.messages, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    channel!: ChannelEntity;
}
