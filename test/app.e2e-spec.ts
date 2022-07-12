/* eslint-disable jest/expect-expect */
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { omit } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { database } from '@/config/database.config';
import { CoreModule } from '@/modules/core/core.module';
import { ForumModule } from '@/modules/forum/forum.module';

import { ChannelService } from '@/modules/forum/services';

let app: NestFastifyApplication;
const createdId = uuidv4();
const mockData = {
    id: uuidv4(),
    name: 'nestjs',
    order: 0,
    messgeCount: 0,
};
const channelService = {
    list: jest.fn(async () => [mockData]),
    findOne: jest.fn(async (id) => ({ id, ...omit(mockData, ['id']) })),
    create: jest.fn(async (dto) => ({ id: createdId, ...dto })),
    update: jest.fn(async (dto) => ({ ...dto, name: 'react' })),
    delete: jest.fn(async (id) => mockData),
};

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [ForumModule, CoreModule.forRoot(database())],
    })
        .overrideProvider(ChannelService)
        .useValue(channelService)
        .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
});

it(`/GET channels`, () => {
    return app
        .inject({
            method: 'GET',
            url: '/channels',
        })
        .then((result) => {
            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual(JSON.stringify([mockData]));
        });
});

afterAll(async () => {
    await app.close();
});
