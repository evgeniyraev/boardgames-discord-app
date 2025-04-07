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
import axios from 'axios';

// const axios = require('axios');
let channelId = "203836637761765376"

let poll = {
  "question": {
    "text": "What’s your favorite fruit?"
  },
  "answers": [
    {
      "answer_id": 0,
      "poll_media": {
        "text": "Apple"
      }
    },
    {
      "answer_id": 1,
      "poll_media": {
        "text": "Banana"
      }
    },
    {
      "answer_id": 2,
      "poll_media": {
        "text": "Grape"
      }
    }
  ],
  "duration": 1,
  //expiry: tenMinutesLater.toISOString(),
  "allow_multiselect": true,
  "layout_type": 1
}

export let lambdaHandler = async (event) => {
  console.log(`hello from ${channelId}`)

  try {
    const response = await axios.post(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      { content: "hello!" },
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log("Message sent:", response.data)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent to Discord!" })
    }

  } catch (error) {
    console.error("Failed to send message:", error.response?.data || error.message)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send message to Discord", details: error.message })
    }
  }
}