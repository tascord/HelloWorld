import { redirect } from "@remix-run/node";
import { LoaderFunction } from "remix";
import { commitSession, getSession } from "~/utils/Session";

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get('Cookie'));
    session.unset('token');

    return redirect('/', {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    });
}