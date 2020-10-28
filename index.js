const links = [
  { "name": "link-1", "url": "https://linkurl-1" },
  { "name": "link-2", "url": "https://linkurl-2" },
  { "name": "link-3", "url": "https://linkurl-3" },
];

const STATIC_LINK = 'https://static-links-page.signalnerve.workers.dev';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});
/**
 * @param {Request} request
 */
async function handleRequest(request) {
  let response;
  try {
    const link = new URL(request.url);
    if (link.pathname === '/links') {
      response = new Response(JSON.stringify(links), { 
        headers: { "content-type": "application/json" }
      });
    }  
    else {
      response = await fetch(STATIC_LINK, {
        headers: { "content-type": "text/html" }
      });
    }
  } catch {
    response = new Response("ERROR", { status: 500 });
  }
  return response;
};


// class LinksTransformer {
//   constructor(links) {
//     this.links = links;
//   }
  
//   // Target the div#links selector, and add in a new a for each link in your API using HTMLRewriter.
//   async element(element) {
//     console.log(element.tagName)
//   }
// }

// class HTMLHandler {

//   element(element) {
//     // An incoming element, such as `div`
//     console.log(`Incoming element: ${element.tagName}`)
//   }

//   comments(comment) {
//     // An incoming comment
//   }

//   text(text) {
//     // An incoming piece of text
//   }
// }

// async function handleRequest(req) {
//   const res = await fetch(req);
//   return res;
//   // return new HTMLRewriter().on("div#links", new LinksTransformer()).transform(res);
// }