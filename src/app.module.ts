import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config/database.config';
import { CoreModule } from './modules/core/core.module';
import { ForumModule } from './modules/forum/forum.module';

@Module({
    imports: [ForumModule, CoreModule.forRoot(database())],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
