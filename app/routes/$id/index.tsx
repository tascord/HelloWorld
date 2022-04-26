import { Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { Box, Group, LoadingOverlay, Pagination, Paper, ScrollArea, Text } from "@mantine/core";
import { api_request } from "~/utils/Server";
import { Community, Message, User } from "~/utils/Types";
import { useEffect, useState } from "react";
import { RichText } from "~/components/Editor";
import { Calendar, User as UserIcon, Users } from "tabler-icons-react";
import { Hint } from "../$id";
import { getSession, commitSession } from "~/utils/Session";

export const loader: LoaderFunction = ({ request, params }) => new Promise(async resolve => {

    const session = await getSession(request.headers.get('Cookie'));
    if (!session.has('token')) {
        return resolve(redirect('/'));
    }

    const community = await api_request<Community>('community/' + params.id!, 'get', undefined, session.get('token'))
        .catch(resolve)

    if (!community) return;

    const target = community.id === '0' ? await api_request<User>('user/' + params.id!, 'get', undefined, session.get('token'))
        .catch(resolve) : undefined;

    const user = await api_request<Message[]>('me', 'get', undefined, session.get('token'))
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

export default function () {

    if (typeof useLoaderData() === 'string') return null;

    const [community, target, user, token] = useLoaderData<[Community, User | undefined, User, string]>();
    const [messageCache, setMessageCache] = useState<{ [page: number]: Message[] }>({});
    const [userCache, setUserCache] = useState<{ [id: string]: User }>({});
    const [messages, setMessages] = useState<Message[]>([]);
    const [page, setPage] = useState(-1);
    const [loading, setLoading] = useState(false);

    const Posts = ({ }): JSX.Element => {
        return (
            <>
                {
                    messages.map(m => (
                        <Paper
                            key={m.id}
                            withBorder
                            p="md"
                            my="lg"
                            shadow="sm"
                            style={{ width: 'calc(100% - 1rem)' }}>
                            <Text
                                color="grape"
                                weight={700}
                                variant="gradient"
                                component={Link}
                                to={`/${community.id}/post/${m.id}`}
                                gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
                                sx={{ fontSize: '1.5rem' }}>
                                {m.title}
                            </Text>
                            <Group
                                mt="-sm"
                                direction="row">
                                {m.community_id !== community.id && <Hint
                                    icon={<Users />}
                                    text={m.community_id}
                                    link={'/' + m.community_id}
                                    color="teal" />
                                }
                                <Hint
                                    icon={<UserIcon />}
                                    text={userCache[m.author_id]?.display_name ?? m.author_id}
                                    link={'/' + userCache[m.author_id]?.username ?? m.id}
                                    color="teal" />
                                <Hint
                                    icon={<Calendar />}
                                    text={new Date(m.created).toLocaleString()}
                                    color="yellow" />
                            </Group>
                            <RichText
                                readOnly
                                value={m.content}
                                onChange={() => { }} />
                        </Paper>
                    ))
                }
            </>
        )
    }


    const set_page = (page: number) => {

        if (Math.trunc(page) !== page) return;

        setLoading(true);
        setPage(page);

        if (messageCache[page]) {
            setMessages(messageCache[page]);
            setLoading(false);
            return;
        }

        api_request<Message[]>('scroll/' + target?.id ?? community.id, 'post', { page: page - 1 }, token)
            .then(res => {
                console.log('Polled:', res)
                setMessageCache({ ...messageCache, [page]: res });
                setMessages(res);

                const un = res
                    .map(m => m.author_id)
                    .filter(a => !userCache[a])
                    .filter((v, i, a) => a.indexOf(v) === i);

                if (un.length === 0) {
                    setLoading(false);
                    return;
                }

                un.forEach((v, i, a) => {
                    api_request<User>('user/' + v, 'get', undefined, token)
                        .then(res => {
                            setUserCache({ ...userCache, [v]: res });
                        })
                        .catch(() => { })
                        .finally(() => {
                            console.log(`Polled ${i + 1}/${a.length}`);
                            if (i === a.length - 1) setLoading(false);
                        })
                })


            })
            .catch((e) => {
                console.log(`Error polling scroll feed\n${e}`);
                // TODO: Alert user of error
                setMessages([]);
                setLoading(false);
            })

    }

    useEffect(() => {
        if (page === -1) set_page(1);
    });


    return (
        <>
            <ScrollArea
                type="always"
                style={{
                    flex: '1',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <LoadingOverlay visible={loading} />
                <Box
                    style={{
                        
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <Box
                        style={{
                            width: 'min(70vw, 45rem)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                        {!loading && <Posts />}
                    </Box>
                </Box>
            </ScrollArea>
            <Box
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                <Pagination
                    total={(community.messages.length / 10) + 1}
                    page={page}
                    onChange={e => set_page(e)} />
            </Box>
        </>
    )
}