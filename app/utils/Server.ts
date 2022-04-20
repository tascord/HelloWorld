export const ServerLocation = {
    base_url: 'http://localhost:4000',
}

export function api_request<T>(endpoint: string, method: 'post' | 'get' | 'put' | 'patch' | 'delete', data: any | undefined, token?: string): Promise<T> {
    return new Promise((resolve, reject) => {

        const headers: { [header: string]: string } = {
            'Content-Type': 'application/json',
        };

        if (token) headers['Authorization'] = `Bearer ${token}`;

        fetch(`${ServerLocation.base_url}/${endpoint}`, {
            method: method.toUpperCase(),
            headers,
            body: JSON.stringify(data),
        })
            .then(async res => {

                const text = await res.text();
                let json;

                try {
                    json = JSON.parse(text);
                } catch { }

                if (res.status < 200 || res.status > 200) return reject((json ?? {}).message ?? text)
                if (!json) {
                    console.log(`Non-JSON response from '/${endpoint}'`, text);
                    return reject('Invalid response sent.');
                }

                return resolve(json as T);

            })

            .catch(err => {
                console.log(`Unable to fetch '/${endpoint}'`, err);
                return reject(`Something went wrong. Sorry.`);
            })

    });
}

export function format_media(id: string) {
    return `${ServerLocation.base_url}/media/${id}`;
}