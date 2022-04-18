import Community from "./Community";
import User from "./User";
export declare const Roles: readonly ["user", "helper", "moderator", "lead"];
export declare const Actions: readonly ["community_read", "community_post", "community_like", "community_reshare", "community_comment", "community_delete", "community_helper_delete", "community_helper_lock", "community_moderator_restrict", "community_moderator_unrestrict", "community_moderator_pin", "community_lead_promote_user", "community_lead_promote_helper", "community_lead_demote_moderator", "community_lead_demote_helper", "community_lead_rename", "community_lead_description", "community_lead_transfer"];
export declare type Role = typeof Roles[number];
export declare type Action = typeof Actions[number];
export declare function AddPermission(permission: number, action: Action): number;
export declare function RemovePermission(permission: number, action: Action): number;
export declare function HasPermission(permission: number, action: Action): boolean;
export declare function HasPermissions(permission: number, actions: Action[]): boolean;
export declare function ConstructPermissions(actions: Action[], initial?: number): number;
export declare function UserHasPermissionInCommunity(user: User, community: Community, action: Action): boolean;
export declare const DefaultPermissions: {
    [key in typeof Roles[number]]: number;
};
