import { Group } from "../interface/interface.group";
export declare class GroupDTO {
    readonly name: string;
    readonly image: string;
    readonly contractAddress: string;
}
export declare function formatToGroupDTO(data: Group): {
    name: string;
    image: string;
    contractAddress: string;
};
export declare function formatMultipleGroupDTO(data: Group[]): {
    name: string;
    image: string;
    contractAddress: string;
}[];
