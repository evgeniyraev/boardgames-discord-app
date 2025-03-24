# Buardgames discord bot

this is a fun project to explore discord api

## Main idea

a bot to ask the chat who want to play this weekend, and make a thread and/or event for it, after the weekend is over to close this thread

## Usage

to start the bot you need to create `.env` file containign

``` bash
APP_ID=...
DISCORD_TOKEN=...
PUBLIC_KEY=...
```

`APP_ID` and `DISCORD_TOKEN` are used in `commands.js` to register the commands in discord in main direcotory

`PUBLIC_KEY` is used the the endponts to authenticate the api in front of Discord in the app directory

the .env can be copied in both directories or split in the parts whatever requres them

then the app can be build
`sam build` and started `sam local start-api` localy, and using `ngrok http 3000` to be provided with public api to be used in the [Discord Developers](https://discord.com/developers/)

how to create a Discord can be read [here](https://discord.com/developers/docs/quick-start/getting-started)

## Deploy
the deply is done via `sam deploy` after configuring AWC cli locally

TODO: that should be moved to GitHub Actions