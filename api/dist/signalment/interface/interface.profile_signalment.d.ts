export interface ProfileSignalement {
    readonly id: string;
    readonly createdBy: string;
    readonly description: string;
    readonly createdAt: Date;
    readonly idSignaled: string;
    readonly type: number;
}
