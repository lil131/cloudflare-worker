# Cloudflare Workers project

## Introduction

This project is to deploy a Cloudflare Worker in order to build a linktree-style website.

It creates a worker using Cloudflare Wrangler and responds to two kinds of requests, one to generate a JSON API (defined below), and second, to serve an HTML page.

### Response with a JSON API
An array of links is defined in the worker as below: 
```json
[
    {
        "name": "cloudflare",
        "url": "https://www.cloudflare.com/"
    },
    {
        "name": "github",
        "url": "https://www.github.com"
    },
    {
        "name": "cloudflare assignment",
        "url": "https://github.com/cloudflare-hiring/cloudflare-2020-general-engineering-assignment/#deploy-a-json-api"
    }
]
```
A request handler is set up to respond to the path `/links`, and return the array itself as the root of the JSON response.
The response has `application/json;charset=UTF-8` as its `Content-Type`.

### Response with an HTML page
If the path requested _is not_ `/links`, the application will render a static HTML page using HTMLRewriter, by doing the following steps:

1. Retrieve a static HTML page from `https://static-links-page.signalnerve.workers.dev`.
2. Get the predefined array `links`, target the `div#links` selector, and add in a new `a` for each link.
3. Remove the `display: none` from the `div#profile` container, and inside of it, modify the two child elements to show an avatar and name.
4. Remove the `display: none` style from `div#social`, and add three social links as children to the container using `<a>` tag with `svg` icons. SVGs are from https://simpleicons.org.
5. Update the content of `<title>`.
6. Change the background color.
4. Return the transformed HTML page as the response from the Worker

## Instruction
Reference the [Getting Start](https://developers.cloudflare.com/workers/learning/getting-started) guide the detailed steps of setting up and deploying Workers applications.

### test
To test the application locally, run `wrangler dev`. 
The host address will be print out in console, e.g. `http://127.0.0.1:8787`.
Visit `http://127.0.0.1:8787/links` to get the link array as a JSON response.
Visit `http://127.0.0.1:8787` with/without other paths to get the static HTML page.

### deploy
Use `wrangler publish` to deploy the application. 
