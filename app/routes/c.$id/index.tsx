import { Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { Box, Group, LoadingOverlay, Pagination, Paper, Text } from "@mantine/core";
import { api_request } from "~/utils/Server";
import { Message, User } from "~/utils/Types";
import { useEffect, useState } from "react";
import { RichText } from "~/components/Editor";
import { Calendar, User as UserIcon } from "tabler-icons-react";
import { Hint } from "../c.$id";
import { getSession, commitSession } from "~/utils/Session";

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

export default function () {

    if (typeof useLoaderData() === 'string') return null;

    const [community, user, token] = useLoaderData();
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
                            shadow="sm"
                            style={{ width: '100%' }}>
                            <Text
                                color="grape"
                                weight={700}
                                variant="gradient"
                                component={Link}
                                to={`/c/${community.id}/p/${m.id}`}
                                gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
                                sx={{ fontSize: '1.5rem' }}>
                                {m.title}
                            </Text>
                            <Group
                                mt="-sm"
                                direction="row">
                                <Hint
                                    icon={<UserIcon />}
                                    text={userCache[m.author_id]?.display_name ?? m.author_id}
                                    link={`/u/${userCache[m.author_id]?.username ?? m.id}`}
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

        api_request<Message[]>('scroll/' + community.id, 'post', { page: page - 2 }, token)
            .then(res => {
                setMessageCache({ ...messageCache, [page]: res });
                setMessages(res);

                res
                    .map(m => m.author_id)
                    .filter(a => !userCache[a])
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .forEach((v, i, a) => {
                        api_request<User>('user/' + v, 'get', undefined, token)
                            .then(res => {
                                setUserCache({ ...userCache, [v]: res });
                            })
                            .catch(() => { })
                            .finally(() => {
                                if (i === a.length - 1) setLoading(false);
                            })
                    })

            })
            .catch(() => {
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
            <Box
                style={{
                    height: 'calc(100vh - 32px - 7.5rem - 2.5rem)',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                <LoadingOverlay visible={loading} />
                <Group
                    position="left"
                    direction="column"
                    style={{
                        width: 'min(70vw, 45rem)'
                    }}>
                    {!loading && <Posts />}
                </Group>
            </Box>
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