export type User = {
    id: string;
    username: string;
    display_name: string;
    permissions: {
        [community_id: string]: number;
    };
    created: number;
    email_verified: boolean;
    messages: string[];
    avatar: string;
    bio: string;
    location: string;
    website: string;
    pronouns: string[];
    communities: string[];
}

export type Community = {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    created: number;
    users: string[];
    messages: string[];
    audit_log: Audit[];
}

export type Audit = {
    action: Action;
    initiator_id: string;
    target_id?: string;
}

export type Message = {
    id: string;
    content: string;
    created: number;
    author_id: string;
    edits: string[];
}

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

export type TokenUser = User & { token: string }