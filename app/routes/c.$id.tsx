import { Link, LoaderFunction, MetaFunction, Outlet, redirect, useLoaderData } from "remix";
import { ActionIcon, Box, MantineColor, Text } from "@mantine/core";
import { api_request } from "~/utils/Server";
import { commitSession, getSession } from "~/utils/Session";
import { Community, Message, User } from "~/utils/Types";
import { ThemedText } from "~/root";
import { PostButton } from ".";

export const loader: LoaderFunction = ({ request, params }) => new Promise(async resolve => {

    const session = await getSession(request.headers.get('Cookie'));
    if (!session.has('token')) {
        return resolve(redirect('/'));
    }

    const community = await api_request<Message[]>('community/' + params.id!, 'get', undefined, session.get('token'))
        .catch(resolve)

    const user = await api_request<Message[]>('me', 'get', undefined, session.get('token'))
        .catch(async () => {
            session.unset('token');
            resolve(redirect('/', {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            }));
        })

    resolve([community, user, session.get('token')]);


})

export const meta: MetaFunction = ({ data }) => ({
    title: typeof data === 'string' ? 'bedroom !' : (data[0] as Community).name + ' @ bedroom !',
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

    const data = useLoaderData<string | [Community, User, string]>();

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

    const [community, user, token] = data;
   
    return (
        <>
            <PostButton user={user} community={community} token={token} />
            <Box
                style={{ height: '7.5rem' }}>
                <Text
                    color="grape"
                    weight={700}
                    variant="gradient"
                    gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
                    sx={{ fontSize: '2.5rem' }}>
                    {community.name}
                </Text>
                <ThemedText>
                    {community.description}
                </ThemedText>
            </Box>
            <Outlet />
        </>
    )
}