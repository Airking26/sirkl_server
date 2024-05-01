import { User } from "src/user/interface/interface.user";
export interface Story {
    _id: string;
    createdAt: Date;
    createdBy: User;
    url: string;
    readers: User[];
    type: number;
}
