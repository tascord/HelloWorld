import { Link, LoaderFunction, MetaFunction, Outlet, redirect, useLoaderData } from "remix";
import { ActionIcon, Box, Button, Group, MantineColor, Text } from "@mantine/core";
import { api_request } from "~/utils/Server";
import { commitSession, getSession } from "~/utils/Session";
import { Community, User } from "~/utils/Types";
import { ThemedText } from "~/root";
import { PostButton } from ".";
import { At, Globe, UserMinus, UserPlus, Users } from "tabler-icons-react";
import { RichText } from "~/components/Editor";
import { useState } from "react";

export const loader: LoaderFunction = ({ request, params }) => new Promise(async resolve => {

    const session = await getSession(request.headers.get('Cookie'));
    if (!session.has('token')) {
        return resolve(redirect('/'));
    }

    const community = await api_request<Community>('community/' + params.id!, 'get', undefined, session.get('token'))
        .catch(resolve)

    if (!community) return;

    const target = community.id === '0' ? await api_request<User>('user/' + params.id!, 'get', undefined, session.get('token'))
        .catch(resolve) : undefined

    const user = await api_request<User>('me', 'get', undefined, session.get('token'))
        .catch(async () => {
            session.unset('token');
            resolve(redirect('/', {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            }));
        })

    resolve([community, target, user, session.get('token')]);


})

export const meta: MetaFunction = ({ data }) => ({
    title: typeof data === 'string' ? 'bedroom !' : (data[0] as Community).name + ' // bedroom !',
})

export function Hint({ text, icon, link, color }: { text: string, icon: JSX.Element, link?: string, color?: MantineColor }) {
    return (
        <Box
            my="sm"
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <ActionIcon
                mr="sm"
                size={20}
                variant="light"
                color={color ?? 'grape'}>
                {icon}
            </ActionIcon>
            {
                color === undefined ? <ThemedText style={{ fontSize: 15 }}>
                    {
                        link === undefined ? text :
                            <Link
                                to={link}
                                style={{
                                    color: 'inherit',
                                    textDecoration: 'none'
                                }}
                            >
                                {text}
                            </Link>
                    }
                </ThemedText> : <Text color={color} style={{ fontSize: 15 }}>
                    {
                        link === undefined ? text :
                            <Link
                                to={link}
                                style={{
                                    color: 'inherit',
                                    textDecoration: 'none'
                                }}
                            >
                                {text}
                            </Link>
                    }
                </Text>
            }
        </Box>
    )
}

export default function () {

    const data = useLoaderData<string | [Community, User | undefined, User, string]>();

    if (typeof data === 'string') return (
        <>
            <ThemedText
                weight={900}
                style={{ fontSize: '2.5rem' }}>
                Sorry, but something went wrong.
            </ThemedText>
            <Text color="red">{data}</Text>
        </>
    )

    const [community, target, user, token] = data;
    const [following, setFollowing] = useState(false);
    const [followingWork, setFollowingWork] = useState(false);

    function toggle_follow() {
        if (followingWork) return;
        setFollowingWork(true);

        api_request('follow/' + user.id, following ? 'delete' : 'put', {}, token)
            .then(() => setFollowing(!following))
            .catch(() => { })
            .finally(() => {
                setFollowingWork(false);
            })

    }

    return (
        <Box
            style={{
                maxHeight: 'calc(100vh - 32px)',
                display: 'flex',
                flexDirection: 'column'
            }}>
            <PostButton user={user} community={community} token={token} />
            <Box
                style={{ height: '7.5rem' }}>
                <Text
                    color="grape"
                    weight={700}
                    variant="gradient"
                    gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
                    sx={{ fontSize: '2.5rem' }}>
                    {target?.display_name ?? community.name}
                </Text>
                {
                    !target ? <>
                        <Hint color="grape" icon={<Users />} text={`${community.users.length} member${community.users.length === 1 ? '' : 's'}`} />
                        <ThemedText>
                            {community.description}
                        </ThemedText>
                    </> : <>
                        <Group>
                            <Hint color="grape" icon={<At />} text={target.username} />
                            <Hint color="blue" icon={<Users />} text={`${target.followers.length} Follower${target.followers.length === 1 ? '' : 's'}, ${target.following.length} Following`} />
                            <Hint color="green" icon={<Globe />} text={`Member of ${target.communities.length} ${target.communities.length === 1 ? 'community' : 'communities'}`} />
                        </Group>
                        <Group>
                            <Button
                                variant="light"
                                loading={followingWork}
                                color={following ? 'red' : 'grape'}
                                leftIcon={following ? <UserMinus /> : <UserPlus />}
                                onClick={() => toggle_follow()}>
                                {following ? 'Unfollow' : 'Follow'}
                            </Button>
                        </Group>
                        {target.bio.length > 0 && <RichText onChange={() => { }} value={target.bio} readOnly />}
                    </>
                }
            </Box>
            <Outlet />
        </Box>
    )
}