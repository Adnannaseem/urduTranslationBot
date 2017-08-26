import * as apiai from 'apiai';
import { TextRequestOptions, Event, EventRequestOptions } from 'apiai';

let app = apiai('0fc57fb62042401a9d56268a993ce643');

export function textQuery(text: string, options: { sessionId: string }): Promise<any> {
    return new Promise((resolve, reject) => {

        let request = app.textRequest(text, options);

        request.on('response', function (response) {
            console.log("here it is: ", response);
            resolve(response);
        });

        request.on('error', function (error) {
            console.log("here it was: ", error);
            reject(error);
        });

        request.end();

    })
}
