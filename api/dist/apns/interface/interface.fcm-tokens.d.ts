export declare enum FCMTokenPlatform {
    iOS = 0,
    android = 1
}
export interface FCMToken {
    platform: FCMTokenPlatform;
    token: string;
}
