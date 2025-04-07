/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */


import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
  verifyKey,
} from 'discord-interactions';

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const client = new LambdaClient({ region: "eu-central-1" }); // Set your region

export let lambdaHandler = async (event) => {

  try {
    const rawBody = event.body;

    console.log(event.headers)

    const signature = event.headers['X-Signature-Ed25519'] || event.headers['x-signature-ed25519'];;
    const timestamp = event.headers['X-Signature-Timestamp'] || event.headers['x-signature-timestamp'];

    console.log(`validation with ${signature} and ${timestamp}`)
    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY);

    if (isValidRequest == false) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Bad request signature'
        }),
      };
    }

    const body = JSON.parse(rawBody);
    const { type, id, data } = body;

    console.log(`type: ${type}`)

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          type: InteractionResponseType.PONG
        })
      }      
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      // "test" command
      if (name === 'test') {
        const command = new InvokeCommand({
          FunctionName: "SendMassage", // Logical name or full ARN
          InvocationType: "Event", // 'RequestResponse' for sync, 'Event' for async
          Payload: Buffer.from(JSON.stringify({ foo: "bar" }))
        });

        console.log("here")
        try {
          // Real AWS Lambda call
          const response = await client.send(command);
          // console.log("Invocation result:", response);

          console.log("here 2")

          return {
            statusCode: 200,
            body: JSON.stringify({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "lets vote",
              }
            })
          }
       
        } catch (error) {
          console.error("Error invoking function:", error);

          return {
            statusCode: 200,
            body: JSON.stringify({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "error",
              }
            })
          }
        }
      }

      console.error(`unknown command: ${name}`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'unknown command'
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello"
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}