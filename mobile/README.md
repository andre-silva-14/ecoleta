<h1 align="center">Mobile App</h1>

<p align="center">
  <img alt="Ecoleta - Your Waste Collection Marketplace" title="Ecoleta - Your Waste Collection Marketplace" src="../.github/mobile.gif" />
</p>


## Getting started...

First, clone the repository and install all the project dependencies:

    $ git clone https://github.com/andre-silva-14/ecoleta.git
    $ cd ecoleta/mobile
    $ npm install

Next, start the server which will trigger Expo start and open-up the expo dashboard in your browser:

    $ npm start

At this point you can use a mobile emulator or simply install [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) on a mobile device and scan the QR Code.

Expo will set up the whole enviroment and build the JS Bundle natively.


## Configuring the server

Please note that for a seamless experience using the app you should have the API Server already running, check [here](https://github.com/andre-silva-14/ecoleta/tree/master/server) for instructions on how to run the API Server.

***Important!*** If you are running the app on your mobile device, you may not be able to reach the localhost of your computer, where the API Server is running, from your phone, depending of the network configuration. For this reason, I recommend using [ngrok](https://ngrok.com/) to create a temporary public host tunnel for the API.

Whichever option you chose, localhost or public tunnel, you **must** configure [this file](https://github.com/andre-silva-14/ecoleta/blob/master/mobile/src/services/api.ts) inserting here the API URL.

##### Example:

```js
const api = axios.create({
    baseURL: 'http://127.0.0.1:3333/',
});
```