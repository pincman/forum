import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    SerializeOptions,
} from '@nestjs/common';

import { CreateChannelDto, UpdateChannelDto } from '../dtos';

import { ChannelService } from '../services';

@Controller('channels')
export class ChannelController {
    constructor(private channelService: ChannelService) {}

    /**
     * @description query channel list
     */
    @Get()
    @SerializeOptions({ groups: ['channel-list'] })
    async index() {
        return this.channelService.list();
    }

    /**
     * @description query one channel
     * @param {string} channel
     */
    @Get(':channel')
    @SerializeOptions({ groups: ['channel-detail'] })
    async show(@Param('channel', new ParseUUIDPipe()) channel: string) {
        return this.channelService.findOne(channel);
    }

    /**
     * @description create a new channel
     * @param {CreateChannelDto} data
     */
    @Post()
    @SerializeOptions({ groups: ['channel-detail'] })
    async store(
        @Body()
        data: CreateChannelDto,
    ) {
        return this.channelService.create(data);
    }

    /**
     * @description update the channel
     * @param {UpdatePostDto} data
     */
    @Patch()
    @SerializeOptions({ groups: ['channel-detail'] })
    async update(
        @Body()
        data: UpdateChannelDto,
    ) {
        return this.channelService.update(data);
    }

    /**
     * @description delete the channel
     * @param {string} channel
     */
    @Delete(':channel')
    @SerializeOptions({ groups: ['channel-detail'] })
    async destroy(
        @Param('channel', new ParseUUIDPipe())
        channel: string,
    ) {
        return this.channelService.delete(channel);
    }
}
