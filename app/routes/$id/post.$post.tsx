import { resolve } from "dns";
import { LoaderFunction, redirect } from "remix";
import { api_request } from "~/utils/Server";
import { getSession, commitSession } from "~/utils/Session";
import { Message } from "~/utils/Types";

export const loader: LoaderFunction = ({ request, params }) => new Promise(async resolve => {

    const session = await getSession(request.headers.get('Cookie'));
    if (!session.has('token')) {
        return resolve(redirect('/'));
    }

    const post = await api_request<Message[]>(`community/${params.id}/post/${params.post!}`, 'get', undefined, session.get('token'))
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

    resolve([post, user, session.get('token')]);

})