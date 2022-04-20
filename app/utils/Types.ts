export type User = {
    id: string;
    username: string;
    display_name: string;
    permissions: {
        [community_id: string]: number;
    };
    created: Date;
    email_verified: boolean;
    messages: string[];
    avatar: string;
    bio: string;
    location: string;
    website: string;
    pronouns: string[];
}