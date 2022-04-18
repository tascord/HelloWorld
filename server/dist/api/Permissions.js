"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPermissions = exports.UserHasPermissionInCommunity = exports.ConstructPermissions = exports.HasPermissions = exports.HasPermission = exports.RemovePermission = exports.AddPermission = exports.Actions = exports.Roles = void 0;
exports.Roles = [
    'user',
    'helper',
    'moderator',
    'lead',
];
exports.Actions = [
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
];
// Bitwise permissions for a user.
function AddPermission(permission, action) {
    return permission |= 1 << exports.Actions.indexOf(action);
}
exports.AddPermission = AddPermission;
function RemovePermission(permission, action) {
    return permission &= ~(1 << exports.Actions.indexOf(action));
}
exports.RemovePermission = RemovePermission;
function HasPermission(permission, action) {
    return (permission & (1 << exports.Actions.indexOf(action))) !== 0;
}
exports.HasPermission = HasPermission;
function HasPermissions(permission, actions) {
    return actions.every(function (action) { return HasPermission(permission, action); });
}
exports.HasPermissions = HasPermissions;
function ConstructPermissions(actions, initial) {
    return actions.reduce(function (permission, action) { return AddPermission(permission, action); }, initial !== null && initial !== void 0 ? initial : 0);
}
exports.ConstructPermissions = ConstructPermissions;
function UserHasPermissionInCommunity(user, community, action) {
    var _a;
    return HasPermission((_a = user.permissions[community.id]) !== null && _a !== void 0 ? _a : exports.DefaultPermissions.user, action);
}
exports.UserHasPermissionInCommunity = UserHasPermissionInCommunity;
// Default Permissions
exports.DefaultPermissions = {
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
};
//# sourceMappingURL=Permissions.js.map