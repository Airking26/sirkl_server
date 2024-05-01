import { User } from "src/user/interface/interface.user";
export interface Nicknames {
    ownedBy: User;
    value: Map<String, String>;
}
