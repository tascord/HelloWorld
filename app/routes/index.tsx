import { ActionIcon, Box, Button, Group, LoadingOverlay, Modal, Paper, ScrollArea, Select, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { Calendar, Plus, Users } from "tabler-icons-react";
import { RichText } from "~/components/Editor";
import { ThemedText } from "~/root";
import { api_request } from "~/utils/Server";
import { getSession } from "~/utils/Session";
import { Community, Message, User } from "~/utils/Types";
import { Hint } from "./$id";
import { User as UserIcon } from "tabler-icons-react";

export const loader: LoaderFunction = ({ request }) => new Promise(async resolve => {
    const session = await getSession(request.headers.get('Cookie'));
    if (!session.has('token')) resolve('No user logged in');

    const user = await api_request<Message[]>('me', 'get', undefined, session.get('token'))
        .catch(resolve);

    resolve([user, session.get('token')])

});

export function PostButton({ community, user, token }: { community?: Community, user: User, token: string }) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const [fields, setFields] = useState<{ [key: string]: string }>({ community: community?.id || user.id });

    const [fetching, setFetching] = useState(false);
    const [communities, setCommunities] = useState<Community[]>([]);

    useEffect(() => {

        if (fetching) return;
        setFetching(true);

        let data: Community[] = [];
        for (let i = 0; i <= user.communities.length - 1; i++) {
            api_request<Community>(`community/${user.communities[i]}`, 'get', undefined, token)
                .then(community => data.push(community))
                .catch(e => console.log(`Unable to poll for community at ID ${i}:\n${e}`))
                .finally(() => {
                    if (i === Math.min(user.communities.length - 1, 10)) {
                        setCommunities(data);
                    }
                })
        }

    })

    function submit() {
        setLoading(true);
        api_request<Message>(`community/${fields['community']}/post`, 'put', fields, token)
            .then(message => {
                // TODO: Remix redirect
                window.location.pathname = `${fields['community']}/${message.id}`;
            })
            .catch(setError)
            .finally(() => setLoading(false))
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
        }}>
            <Modal
                size='xl'
                title="Create a post"
                opened={open}
                onClose={() => setOpen(false)}>
                <form>
                    <Select
                        searchable
                        required
                        description="Select a Community to post to, or post directly to your wall"
                        label="Community to post to"
                        placeholder="Pick one"
                        nothingFound="No options"
                        onChange={(e: any) => setFields({ ...fields, community: e })}
                        value={fields['community']}
                        data={communities.map(c => ({
                            value: c.id,
                            label: c.name,
                        })).concat(({
                            value: user.id,
                            label: 'Post to wall',
                        }))}
                    />

                    <Text color="red" mt="sm">{error}</Text>
                    <TextInput
                        required
                        label="Post title"
                        description="Sum up your post in a sentence or so"
                        onChange={e => setFields({ ...fields, title: e.target.value })} />
                    {/* TODO: Fix vertical overflow */}
                    <RichText
                        mt="sm"
                        value={fields.content ?? ''}
                        onChange={e => setFields({ ...fields, content: e })}
                        style={{ minHeight: '10rem' }} />
                    <Group
                        position="right">
                        <Button
                            mt="sm"
                            color="green"
                            variant="light"
                            leftIcon={<Plus />}
                            loading={loading}
                            onClick={() => submit()}>
                            Create post
                        </Button>
                    </Group>
                </form>
            </Modal>
            <ActionIcon
                size="xl"
                radius="xl"
                variant="light"
                color="grape"
                onClick={() => setOpen(true)}>
                <Plus />
            </ActionIcon>
        </div>
    )
}

export default function () {

    const data = useLoaderData<string | [User, string]>();

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

    const [user, token] = data;
    const [communityCache, setCommunityCache] = useState<{ [id: string]: Community }>({});
    const [messageCache, setMessageCache] = useState<Message[]>([]);
    const [userCache, setUserCache] = useState<{ [id: string]: User }>({});
    const [loading, setLoading] = useState(false);
    const [fetch, setFetch] = useState(false);
    const [page, setPage] = useState(0);

    function poll() {
        if (loading) return;
        api_request<Message[]>('scroll/home', 'post', { page: page }, token)
            .then(res => {
                setMessageCache([...messageCache, ...res]);
                res
                    .filter(m => !userCache[m.author_id])
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .forEach((v, i, a) => {
                        api_request<Community>('community/' + v.community_id, 'get', undefined, token)
                            .then(res => {
                                setCommunityCache({ ...communityCache, [v.community_id]: res });
                                api_request<User>('user/' + v.author_id, 'get', undefined, token)
                                    .then(res => {
                                        setUserCache({ ...userCache, [v.author_id]: res });
                                    })
                                    .catch(() => { })
                                    .finally(() => {
                                        if (i === a.length - 1) setLoading(false);
                                    })
                            })
                            .catch(() => {
                                if (i === a.length - 1) setLoading(false);
                            })
                    })
            })
            .catch(() => {
                // TODO: Alert user of error
                setLoading(false);
            })
    }

    const Posts = ({ }): JSX.Element => {
        return (
            <>
                {
                    messageCache.map(m => (
                        <Paper
                            key={m.id}
                            withBorder
                            p="md"
                            my="lg"
                            shadow="sm"
                            style={{ width: '100%' }}>
                            <Text
                                color="grape"
                                weight={700}
                                variant="gradient"
                                component={Link}
                                to={`/${m.community_id}/post/${m.id}`}
                                gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
                                sx={{ fontSize: '1.5rem' }}>
                                {m.title}
                            </Text>
                            <Group
                                mt="-sm"
                                direction="row">
                                <Hint
                                    icon={<Users />}
                                    text={communityCache[m.community_id]?.name ?? '...'}
                                    link={m.community_id}
                                    color="grape" />
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

    useEffect(() => {
        if (fetch) return;
        setFetch(true);
        poll();
    })

    return (
        <Box
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
            <LoadingOverlay visible={loading} />
            <ScrollArea
                style={{
                    height: '100%',
                    width: 'min(70vw, 45rem)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                {!loading && <Posts />}
            </ScrollArea>
        </Box>
    )

}