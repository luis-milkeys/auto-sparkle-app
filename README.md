# Auto Sparkle 🦄

A `daily usage driven` mobile app that uses the Derpibooru API.

## Why?

I once was someone who would download images from Derpibooru every single day, so I made this app so I could basically keep up from where I left and continue to fuel my addiction.

Since I no longer want this life, I do not use this app anymore, then I decided to make it open-source, in case anyone want to use it, or just play with a React Native based app that specifically uses the Derpibooru API.

Please also refer to the [Derpibooru API Documentation](https://derpibooru.org/pages/api).

## Running the app

Just follow these steps.

I am assuming you already know a little about React Native and NodeJS. If you don't, please make sure you have a proper environment configured as described on the [React Native documentation](https://reactnative.dev/docs/environment-setup).

1. First, install the dependencies.

    ```bash
      yarn 
    ```

    or

    ```bash
      npm install
    ```

2. Run the app for Android (This app was never tested on iOS since i'm poor)

    ```bash
      yarn android 
    ```

    or

    ```bash
      npm run android
    ```

    With this step, you can run the app on an Android emulator or physical device.

3. (Optional) Build the app

    ```bash
      yarn release 
    ```

    or

    ```bash
      npm run release
    ```

    This will build a `.apk` file that should be able to be installed on any Android device.

## How to use the app

As mentioned previously, this app is a `daily usage based` application, it will remember the last image you downloaded with the app from Derpibooru, and from that image, will fetch all the images you haven't downloaded yet, so you can choose which image you want to download.

The app the created a "queue" of images to be downloaded. Once you are happy with the images you have chosen, you can click on the big "download" button to, as the name suggests, download everything.

The images will be saved locally to your phone on three separated folders, one for Imagens, one for AI generated content, and another one for videos.

Be aware that the app shows explict results by default. You can choose whitch tags (comma separated) the app will look for on the app settings. You can also set up a filter id so the app uses a filter from derpibooru.

In case you have any question, just open an issue on this repository, I may or may not answer it. There's a 50% chance.


