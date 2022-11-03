# Google Messages

By GyozaGuy

## Description

A basic Electron app that wraps [messages.android.com](https://messages.android.com).

## Security Concerns

Being concerned about security and suspicious of third-party apps stealing your data is important. This app does nothing but wrap the Google Messages site in a way that allows it to run independent of a web browser. You can see everything it does in `main.js`. (Disclaimer: I can only guarantee the security of the files in this repository, you'll have to trust Electron yourself.)

If you are still concerned about security (and you should be as a general rule), you can build this yourself by cloning the repository and running the following:
- `npm install`
- `npm run build`

Specific build scripts for each OS also exist:
- `npm run build-darwin`
- `npm run build-linux`
- `npm run build-win32`
