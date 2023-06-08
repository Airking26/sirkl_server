export interface Inbox{
    id: string,
    idChannel: string,
    createdBy: string,
    wallets: string[],
    members: string[],
    messages: string[]
}