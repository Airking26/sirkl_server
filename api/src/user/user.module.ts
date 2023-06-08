import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APNsModule } from 'src/apns/apns.module';
import { CallSchema } from 'src/call/schema/schema.call';
import { FollowSchema } from 'src/follow/schema/schema.follow';
import { InboxSchema } from 'src/inbox/schema/schema.inbox';
import { NFTSchema } from 'src/nfts/schema/schema.nft';
import { NicknamesSchema } from 'src/nicknames/schema/schema.nicknames';
import { NotificationSchema } from 'src/notifications/schema/schema.notification';
import { StorySchema } from 'src/story/schema/story.schema';
import { UserSchema } from './schema/schema.user';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FollowModule } from 'src/follow/follow.module';
import { FollowService } from 'src/follow/follow.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'User', schema: UserSchema},
            {name: 'Follow', schema: FollowSchema},
            {name: 'Call', schema: CallSchema},
            {name: "Inbox", schema: InboxSchema},
            {name: "Nicknames", schema: NicknamesSchema},
            {name: "Notification", schema: NotificationSchema},
            {name: 'Story', schema: StorySchema},
            {name: 'NFT', schema: NFTSchema}
        ]),
        APNsModule
        ],
    providers: [UserService, FollowService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {
}
