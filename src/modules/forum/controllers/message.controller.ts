import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
} from '@nestjs/common';

import { CreateMessageDto, QueryMessageDto, UpdateMessageDto } from '../dtos';
import { MessageService } from '../services';

@Controller('messages')
export class MessageController {
    constructor(private messageService: MessageService) {}

    /**
     * @description query messages by paginate and filter by channel
     * @param {QueryMessageDto} { page, limit, ...params }
     */
    @Get()
    @SerializeOptions({})
    async index(
        @Query()
        { page, limit, ...params }: QueryMessageDto,
    ) {
        return this.messageService.list(params, { page, limit });
    }

    /**
     * @description query one message by id
     * @param {string} message
     */
    @Get(':message')
    @SerializeOptions({})
    async show(@Param('message', new ParseUUIDPipe()) message: string) {
        return this.messageService.findOne(message);
    }

    /**
     * @description create a new message
     * @param {CreateMessageDto} data
     */
    @Post()
    @SerializeOptions({})
    async store(
        @Body()
        data: CreateMessageDto,
    ) {
        return this.messageService.create(data);
    }

    /**
     * @description update a message
     * @param {UpdateMessageDto} data
     */
    @Patch()
    @SerializeOptions({})
    async update(
        @Body()
        data: UpdateMessageDto,
    ) {
        return this.messageService.update(data);
    }

    /**
     * @description delete a message
     * @param {string} message
     */
    @Delete(':message')
    @SerializeOptions({})
    async destroy(
        @Param('message', new ParseUUIDPipe())
        message: string,
    ) {
        return this.messageService.delete(message);
    }
}
