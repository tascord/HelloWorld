export default function request(endpoint: string, authorization: string | undefined, data: Object): Promise<Object> {

    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        const method = 'POST';

        xhr.open(method, 'http://localhost:3001' + endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        if (authorization) xhr.setRequestHeader('Authorization', 'Bearer ' + authorization);

        xhr.send(JSON.stringify(data));

        xhr.onload = (data: any) => {

            let response = data.target.response;

            try { response = JSON.parse(response); }
            catch (e) { response = data.target.response; }

            if (data.target.status >= 200 && data.target.status < 300) resolve(response);
            else reject(response);

        }

    });

};