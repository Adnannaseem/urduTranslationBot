import * as functions from 'firebase-functions';
import * as request from 'request';
import db from '../db/index';
import { Request, Response } from 'express';
import { textQuery } from '../core';
let Translate = require('@google-cloud/translate');

// Google Cloud Platform project ID
const projectId = 'spry-framework-177011';

// Instantiates a client
const translateClient = Translate({
    projectId: projectId
});

export let onConversation = functions.database.ref('/conversation/{pushId}')
    .onWrite(event => {
        const data = event.data.val();
        if (data != null) {
            console.log("hello")
            if (data.name === 'You') {
                request({
                    url: 'https://us-central1-spry-framework-177011.cloudfunctions.net/translateAPI',
                    method: 'POST',
                    json: {
                        'langCode': 'en',
                        'text': data.text
                    }
                },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("response: ", response);
                            console.log("response: ", response.body);
                            const translated_text = body.translate



                            textQuery(translated_text, {
                                sessionId: "dfgsdfgdsfgs"
                            }).then((res) => {
                                console.log("___res: ", res)

                                let answer = res.result.fulfillment.speech;
                                console.log("answer: ", answer)
                                if (answer != null) {
                                    request({
                                        url: 'https://us-central1-spry-framework-177011.cloudfunctions.net/translateAPI',
                                        method: 'POST',
                                        json: {
                                            'langCode': 'ur',
                                            'text': answer
                                        }
                                    }, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            const translatedText = body.translate
                                            db.ref('/conversation').push({
                                                name: 'Bot',
                                                imageUrl: '../assets/images/bot.jpg',
                                                text: translatedText
                                            })
                                        } else {
                                            console.log("http error code: ", response.statusCode);
                                        }
                                    })

                                } else {
                                    console.error("answer is null");
                                }


                            }).catch(e => {
                                console.log("___err: ", e);
                            })
                        } else {
                            console.log("http error: ", error);
                        }
                    })
            }

        }
    });

export let translateAPI = functions.https.onRequest(async (request: Request, response: Response) => {
    console.log("pakistan: ")
    let req = {
        "langCode": request.body.langCode,
        "text": request.body.text
    }
    const text = req.text
    let target;
    if (req.langCode === 'en') {
        target = req.langCode
    }
    else {
        target = req.langCode
    }
    // Translates text
    translateClient.translate(text, target)
        .then((results: any) => {
            const translation = results[0];

            console.log(`Text: ${text}`);
            console.log(`Translation: ${translation}`);
            let res = {
                'translate': translation
            }
            response.send(res)
        })
        .catch((err: any) => {
            console.error('ERROR:', err);
        });

})