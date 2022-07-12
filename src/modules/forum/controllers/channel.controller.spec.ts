/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { Test } from '@nestjs/testing';

import { ModuleMocker } from 'jest-mock';
import { omit } from 'lodash';

import { v4 as uuidv4 } from 'uuid';

import { ChannelService } from '../services';

import { ChannelController } from './channel.controller';

const createdId = uuidv4();
const mockData = {
    id: uuidv4(),
    name: 'nestjs',
    order: 0,
    messgeCount: 0,
};
const moduleMocker = new ModuleMocker(global);

describe('ChannelController', () => {
    let channelController: ChannelController;
    // let channelService: ChannelService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ChannelController],
        })
            .useMocker((token) => {
                if (token === ChannelService) {
                    return {
                        list: jest.fn(async () => []),
                        findOne: jest.fn(async (id) => ({ id, ...omit(mockData, ['id']) })),
                        create: jest.fn(async (dto) => ({ id: createdId, ...dto })),
                        update: jest.fn(async (dto) => ({ ...dto, name: 'react' })),
                        delete: jest.fn(async (id) => mockData),
                    };
                }
                if (typeof token === 'function') {
                    const mockMetadata = moduleMocker.getMetadata(token) as any;
                    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                    return new Mock();
                }
            })
            .compile();

        channelController = moduleRef.get<ChannelController>(ChannelController);
    });

    it('should return an array of channels', async () => {
        expect(await channelController.index()).toEqual([]);
    });

    it('should return a channel data', async () => {
        expect(await channelController.show(mockData.id)).toEqual(mockData);
    });

    it('create a channel', async () => {
        expect(await channelController.store(omit(mockData, ['id']))).toEqual({
            id: createdId,
            ...omit(mockData, ['id']),
        });
    });

    it('update a channel', async () => {
        expect(await channelController.update(mockData)).toEqual({
            ...mockData,
            name: 'react',
        });
    });

    it('delete a channel', async () => {
        expect(await channelController.destroy(mockData.id)).toEqual(mockData);
    });
});
