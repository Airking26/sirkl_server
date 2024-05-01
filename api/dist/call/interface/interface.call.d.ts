import { User } from "src/user/interface/interface.user";
export interface Call {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    ownedBy: User;
    called: User;
    status: number;
}
