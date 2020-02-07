
<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>
 
# Twilio SMS Support Chatbot

[![Actions Status](https://github.com/twilio-labs/sample-autopilot-support-bot/workflows/Node%20CI/badge.svg)](https://github.com/twilio-labs/sample-autopilot-support-bot/actions)

## About

This sample application shows how to build an automated SMS chatbot using Twilio's autopilot

Implementations in other languages:

| .NET | Java | Python | PHP | Ruby |
| :--- | :--- | :----- | :-- | :--- |
| TBD  | TBD  | TBD    | TBD | TBD  |

### How it works

After the user sets and submits the configuration parameters on the `/config` page, the sample will automatically create an Autopilot assistant with predefined Tasks and actions using Twilio's REST API. Then, the user can send a text message to the configure phone number to start the conversation. The bot will ask the user for specific input to provide a proper response.

## Features

- Node.js web server using [Express.js](https://npm.im/express)
- Basic web user interface using [Pug](https://npm.im/pug) for templating and Bootstrap for UI
- User interface to configure some SMS parameters.
- Sms parameters can be stored in a JSON database using lowdb.
- Unit tests using [`mocha`](https://npm.im/mocha) and [`chai`](https://npm.im/chai)
- [Automated CI testing using GitHub Actions](/.github/workflows/nodejs.yml)
- Linting and formatting using [ESLint](https://npm.im/eslint) and [Prettier](https://npm.im/prettier)
- Interactive configuration of environment variables upon running `npm run setup` using [`configure-env`](https://npm.im/configure-env)
- Project specific environment variables using `.env` files and [`dotenv-safe`](https://npm.im/dotenv-safe) by comparing `.env.example` and `.env`.
- One click deploy buttons for Heroku and Glitch

## Set up

### Requirements

- [Node.js](https://nodejs.org/)
- A Twilio account - [sign up](https://www.twilio.com/try-twilio)

### Twilio Account Settings

This application should give you a ready-made starting point for writing your
own SMS chatbot application. Before we begin, we need to collect
all the config values we need to run the application:

| Config&nbsp;Value | Description                                                                                                                                                  |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account&nbsp;Sid  | Your primary Twilio account identifier - find this [in the Console](https://www.twilio.com/console).                                                         |
| Auth&nbsp;Token   | Used to authenticate - [just like the above, you'll find this here](https://www.twilio.com/console).                                                         |
| Phone&nbsp;number | A Twilio phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164) - you can [get one here](https://www.twilio.com/console/phone-numbers/incoming) |

### Local development

After the above requirements have been met:

1. Clone this repository and `cd` into it

```bash
git clone git@github.com:twilio-labs/sample-autopilot-support-bot.git
cd sample-autopilot-support-bot
```

2. Install dependencies

```bash
npm install
npm install -g ngrok
```

3. Set your environment variables

```bash
npm run setup
```

See [Twilio Account Settings](#twilio-account-settings) to locate the necessary environment variables.

4. Run the application

```bash
npm start
```

Alternatively, you can use this command to start the server in development mode. It will reload whenever you change any files.

```bash
npm run dev
```

5. Once you have your server running, you need to expose your `localhost` to a public domain so the Twilio aurtopilot can reach the expected endpoint. This is easy using `ngrok`:
```
ngrok http 3000
``` 
This will generate a url similar to: `https://cd2ef758.ngrok.io`

6. Navigate to `/config` preceding with the ngrok url you got earlier to set the SMS params and create the autopilot assistant. **NOTE:** Always submit the configuration using the ngrok url, never with localhost. Otherwise the autopilot assistant won't be able to establish a call with the operator, if you choose that option.

7. (Optional) After submitting the configuration you can go to your [Twilio's Console](https://www.twilio.com/console/autopilot/list) and take a look at at the created autopilot for more details.

8. Send a text message to the phone number provisioned on Twilio to start the conversation!

That's it!

### Tests

You can run the tests locally by typing:

```bash
npm test
```

### Cloud deployment

Additionally to trying out this application locally, you can deploy it to a variety of host services. Here is a small selection of them.

Please be aware that some of these might charge you for the usage or might make the source code for this application visible to the public. When in doubt research the respective hosting service first.

*Don't forget to set the environmental variables on each hosting service!*

| Service                           |                                                                                                                                                                                                                           |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Heroku](https://www.heroku.com/) | [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://www.heroku.com/deploy/?template=https://github.com/twilio-labs/sample-autopilot-support-bot/tree/master)                                                                                                                                       |
| [Glitch](https://glitch.com)      | [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/clone-from-repo?REPO_URL=https://github.com/twilio-labs/sample-autopilot-support-bot.git) |

Here are some notes about the services:
- **Heroku**: Very straightforward, just create an account and after clicking the deploy button you need to follow the instructions and that's it.
- **Glitch**: It requirers an additional step. Once you click on the deploy button, you need to manually create the file `.env` and set the variables. You can duplicate the `.env.example` file and edit it accordingly.

## Resources
- This project was generated using this [sample NodeJS template](https://github.com/twilio-labs/sample-template-nodejs)

- [GitHub's repository template](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) functionality

## Contributing

This template is open source and welcomes contributions. All contributions are subject to our [Code of Conduct](https://github.com/twilio-labs/.github/blob/master/CODE_OF_CONDUCT.md).

[Visit the project on GitHub](https://github.com/twilio-labs/sample-autopilot-support-bot)

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.

[twilio]: https://www.twilio.com
