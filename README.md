# ScratchAuth.JS

A typed API wrapper and middleware for [Scratch Auth by Looky1173](https://auth.itinerary.eu.org/documentation/about)

To install, use:

```sh
$   npm install scratchauth.js
```

## Express Middleware Example

```js
const ScratchAuth = require("scratchauth.js");
const express = require("express");

const app = express();

app.get(
  "/auth",
  ScratchAuth.middleware.authUrl(
    "http://localhost:3000/auth/scratch",
    "ScratchAuth.js Test"
  )
);

const ScratchAuthMiddleware = ScratchAuth.middleware.validateAuth({
  redirectUrl: "http://localhost:3000/auth/scratch", // IMPLEMENT THIS FOR SECURITY
  onFail: (req, res, next) => {
    res.status(401).json({ code: 401, message: "Unauthorized" });
  },
});

app.get("/auth/scratch", ScratchAuthMiddleware, (req, res) => {
  if (req.scratch) {
    res.send(`Welcome, ${req.scratch.username}`);
  }
});

app.listen(3000, () => {
  console.log("Server ready!");
});
```

### Functions

```js
const ScratchAuth = require("scratchauth.js");
// Gives the encoded url for authenticating the user.
ScratchAuth.makeAuthUrl("url", "Example Application");
// Gives the response for validating the auth token you have.
ScratchAuth.validateAuth("912...39b");
```

### Middleware Functions

```js
const ScratchAuth = require("scratchauth.js");
// Makes the auth url and redirects any user to the result URL.
ScratchAuth.middleware.authUrl("url", "Example Application");
// Validates the auth token passed in the request.
ScratchAuth.middleware.validateAuth({
  fail: (req, res, next) => {},
  redirectUrl: "http://localhost:3000/", // use this for security
});
```

## Express Middleware

To get the user from express, use `req.scratch` to get the scratch user info (if valid, you should check if it exists. at all)
