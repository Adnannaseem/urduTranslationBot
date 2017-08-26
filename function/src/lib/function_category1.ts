import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Request, Response } from 'express';


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
export let helloWorld = functions.https.onRequest(async (request: Request, response: Response) => {

    console.log('User Action = ', request.body.result.action);
    switch (request.body.result.action) {
        case 'getTime':
            response.send(
                {
                    "speech": Date().toString()
                })
            break;

        case 'calculater':
            doCalculation(request, response);
            break;

        default:
            response.send(
                {
                    "speech": "Unknown Action: " + request.body.result.action
                }
            )
    }
    function doCalculation(request:any, response:any) {
        const operation = request.body.result.parameters.Operations;
        const firstNumber = parseInt(request.body.result.parameters.first);
        const secondNumber = parseInt(request.body.result.parameters.second);
        var result: any = 0;

        switch (operation) {
            case 'plus':
                result = firstNumber + secondNumber;
                break;

            case 'minus':
                result = firstNumber - secondNumber;
                break;

            case 'divide':
                result = (secondNumber == 0) ? "Err: Denominator must be grater than zero" : firstNumber / secondNumber;
                break;

            case 'multiply':
                result = firstNumber * secondNumber;
                break;

            default:
                result = "something went wrong"
                break;
        }

        response.send(
            {
                "speech": `${operation} = ${result}`
            }
        )
    }
});





