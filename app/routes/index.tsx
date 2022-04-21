import { ActionIcon, Modal, Text } from "@mantine/core";
import { useState } from "react";
import { LoaderFunction, redirect, ActionFunction, Outlet, useLoaderData } from "remix";
import { Plus } from "tabler-icons-react";
import { ThemedText } from "~/root";
import { api_request } from "~/utils/Server";
import { getSession } from "~/utils/Session";
import { Community, Message } from "~/utils/Types";

export const loader: LoaderFunction = ({ request }) => new Promise(async resolve => {
    const session = await getSession(request.headers.get('Cookie'));
    if (!session.has('token')) return resolve(redirect('/'));

    api_request<Message[]>('scroll/home', 'get', undefined, session.get('token'))
        .then(resolve)
        .catch(resolve)

})

export function PostButton({ community }: { community?: Community }) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    return (
        <>
            <Modal
                opened={open}
                onClose={() => setOpen(false)}
                title="Create a post">

            </Modal>
            <ActionIcon
                variant="light"
                color="green">
                <Plus />
            </ActionIcon>
        </>
    )
}

export default function () {

    const scroll_data = useLoaderData<string | Message[]>();
    const error = typeof scroll_data === 'string' ? scroll_data : undefined;

    if (error) return (
        <>
            <ThemedText
                weight={900}
                style={{ fontSize: '2.5rem' }}>
                Sorry, but something went wrong.
            </ThemedText>
            <Text color="red">{error}</Text>
        </>
    )

    if (!scroll_data.length) return (
        <>
            <ThemedText
                weight={900}
                style={{ fontSize: '2.5rem' }}>
                Nothing to see here...
            </ThemedText>
            <ThemedText
                weight={100}
                lightness={2}
                style={{ fontSize: '1.25rem' }}>
                Might wan't to look at joining or creating a community!
            </ThemedText>
        </>
    )

    return (
        <pre>{JSON.stringify(scroll_data) + ' : ' + scroll_data.length}</pre>
    )
}