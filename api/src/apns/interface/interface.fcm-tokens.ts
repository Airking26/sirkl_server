export enum FCMTokenPlatform {
    iOS,
    android
}

export interface FCMToken {
    platform: FCMTokenPlatform;
    token: string;
}
