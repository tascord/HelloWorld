import Community from "./Community";
import User from "./User";

export const Roles = [
    'user',
    'helper',
    'moderator',
    'lead',
] as const;

export const Actions = [

    /* General Permissions */

    // Access community.
    // Excludes non-members and restricted members.
    'community_read',

    // Post messages to community.
    // Excludes non-members and restricted members.
    'community_post',

    // Like messages in community.
    // Excludes non-members and restricted members.
    'community_like',

    // Re-share messages in community.
    // Excludes non-members and restricted members.
    'community_reshare',

    // Comment on messages in community.
    // Excludes non-members and restricted members.
    'community_comment',

    // Delete own messages in community.
    // Excludes non-members and restricted members.
    'community_delete',

    /* Helper Permissions */

    // Delete messages in community.
    // Requires 'helper' or higher role.
    'community_helper_delete',

    // Lock comments to a post in community.
    // Requires 'helper' or higher role.
    'community_helper_lock',

    /* Moderator Permissions */

    // Restrict posting to community.
    // Requires 'moderator' or higher role.
    'community_moderator_restrict',

    // Unrestrict posting to community.
    // Requires 'moderator' or higher role.
    'community_moderator_unrestrict',

    // Pin a message in community.
    // Requires 'moderator' or higher role.
    'community_moderator_pin',

    /* Lead Permissions */

    // Promote user to moderator.
    // Requires 'lead' or higher role.
    'community_lead_promote_user',

    // Promote helper to moderator.
    // Requires 'lead' or higher role.
    'community_lead_promote_helper',

    // Demote user to helper.
    // Requires 'lead' or higher role.
    'community_lead_demote_moderator',

    // Demote helper to user.
    // Requires 'lead' or higher role.
    'community_lead_demote_helper',

    // Rename community.
    // Requires 'lead' or higher role.
    'community_lead_rename',

    // Change community description.
    // Requires 'lead' or higher role.
    'community_lead_description',

    // Change community owner.
    // Requires 'lead' or higher role.
    'community_lead_transfer',


] as const;

export type Role = typeof Roles[number];
export type Action = typeof Actions[number];

// Bitwise permissions for a user.
export function AddPermission(permission: number, action: Action): number {
    return permission |= 1 << Actions.indexOf(action);
}

export function RemovePermission(permission: number, action: Action): number {
    return permission &= ~(1 << Actions.indexOf(action));
}

export function HasPermission(permission: number, action: Action): boolean {
    return (permission & (1 << Actions.indexOf(action))) !== 0;
}

export function HasPermissions(permission: number, actions: Action[]): boolean {
    return actions.every(action => HasPermission(permission, action));
}

export function ConstructPermissions(actions: Action[], initial?: number): number {
    return actions.reduce((permission, action) => AddPermission(permission, action), initial ?? 0);
}

export function UserHasPermissionInCommunity(user: User, community: Community, action: Action): boolean {
    return HasPermission(user.permissions[community.id] ?? DefaultPermissions.user, action);
}

// Default Permissions
export const DefaultPermissions: { [key in typeof Roles[number]]: number } = {

    'user': ConstructPermissions([
        'community_read',
        'community_post',
        'community_like',
        'community_reshare',
        'community_comment',
        'community_delete',
    ]),

    'helper': ConstructPermissions([
        'community_read',
        'community_post',
        'community_like',
        'community_reshare',
        'community_comment',
        'community_delete',

        'community_helper_delete',
        'community_helper_lock',
    ]),

    'moderator': ConstructPermissions([
        'community_read',
        'community_post',
        'community_like',
        'community_reshare',
        'community_comment',
        'community_delete',
        'community_helper_delete',
        'community_helper_lock',

        'community_moderator_restrict',
        'community_moderator_unrestrict',
        'community_moderator_pin',
    ]),

    'lead': ConstructPermissions([
        'community_read',
        'community_post',
        'community_like',
        'community_reshare',
        'community_comment',
        'community_delete',
        'community_helper_delete',
        'community_helper_lock',
        'community_moderator_restrict',
        'community_moderator_unrestrict',
        'community_moderator_pin',

        'community_lead_promote_user',
        'community_lead_promote_helper',
        'community_lead_demote_moderator',
        'community_lead_demote_helper',
        'community_lead_rename',
        'community_lead_description',
        'community_lead_transfer',
    ])

}