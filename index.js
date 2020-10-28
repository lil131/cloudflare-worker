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
    // else {
    //   // trial
    //   response = new Response(await fetch(STATIC_LINK, {
    //     method: 'GET',
    //     }), {
    //       headers: { 'Content-Type': 'text/html' }
    //     }
    //   );

    //   // real res
    //   // response = await getStaticHTML();
    // } 
    else {
      response = new Response("NOT FOUND", { status: 404 });
    };
  } catch {
    response = new Response("ERROR", { status: 500 });
  }
  return response;
};

// async function getStaticHTML() {
//   try {
//     const res = await fetch(STATIC_LINK, {
//       method: 'GET',
//       headers: { 'Content-Type': 'text/html' }
//     });

//   } catch(err) {
    
//   }
// };

// class LinksTransformer {
//   constructor(links) {
//     this.links = links
//   }
  
//   async element(element) {
//     // Your code
//   }
// }

// class ElementHandler {
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
//   const res = await fetch(req)

//   return new HTMLRewriter().on("div", new ElementHandler()).transform(res)
// }