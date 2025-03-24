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

import 'dotenv/config'

import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
  verifyKey,
} from 'discord-interactions';


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
      console.log(JSON.stringify(data, null, 4))
      const { name } = data;

      // "test" command
      if (name === 'test') {
        // Send a message into the channel where command was triggered from
        return {
          statusCode: 200,
          body: JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              // Fetches a random emoji to send from a helper function
              content: `server is working`,
            },
          })
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