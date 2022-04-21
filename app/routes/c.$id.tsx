import { LoaderFunction, redirect, useLoaderData } from "remix";
import { Text } from "@mantine/core";
import { api_request } from "~/utils/Server";
import { getSession } from "~/utils/Session";
import { Community, Message } from "~/utils/Types";
import { ThemedText } from "~/root";

export const loader: LoaderFunction = ({ request, params }) => new Promise(async resolve => {

    const session = await getSession(request.headers.get('Cookie'));
    if (!session.has('token')) return resolve(redirect('/'));

    api_request<Message[]>('community/' + params.id!, 'get', undefined, session.get('token'))
        .then(resolve)
        .catch(resolve)

})

export default function () {

    const data = useLoaderData<string | Community>();

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

    return (
        <>
            <Text
                color="grape"
                weight={700}
                variant="gradient"
                gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
                sx={{ fontSize: '2.5rem' }}>
                {data.name}
            </Text>
            <ThemedText>
                {data.description}
            </ThemedText>
        </>
    )
}