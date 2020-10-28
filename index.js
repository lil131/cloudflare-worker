const LINKS = [
  { "name": "cloudflare", "url": "https://www.cloudflare.com/" },
  { "name": "github", "url": "https://www.github.com" },
  { "name": "assignment", "url": "https://github.com/cloudflare-hiring/cloudflare-2020-general-engineering-assignment/#deploy-a-json-api" },
];

const STATIC_LINK = 'https://static-links-page.signalnerve.workers.dev';
const avatar_src = "https://avatars2.githubusercontent.com/u/43486346?s=400&u=720341aef70f93e7ef474f0be55c9e358868a75a&v=4";


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});
/**
 * @param {Request} request
 */
async function handleRequest(request) {
  const link = new URL(request.url);
  try {
    if (link.pathname === '/links') {
      return new Response(JSON.stringify(LINKS), { 
        headers: { "content-type": "application/json" }
      });
    }  
    else {
      const newLink = new URL('/links', link);
      console.log(request.url)
      return getStatic(newLink.hrel);
    }
  } catch {
    return new Response("ERROR", { status: 500 });
  }
};


class LinksTransformer {
  constructor(links) {
    this.links = links;
  }
  
  //add in a new a for each link in your API using HTMLRewriter.
  async element(element) {
    this.links.forEach(link => {
      element.append(`<a href=${link.url}>${link.name}</a>`, { html: Boolean });
    });
  }
}

class MakeVisible {
  async element(element) {
    element.removeAttribute('style');
  }
}

class ElementRewriter {
  constructor(attributeName, value) {
    this.attributeName = attributeName;
    this.value = value;
  };

  async element(element) {
    element.setAttribute(this.attributeName, this.value);
  };
}

async function getStatic(link) {
  const res = await fetch(STATIC_LINK, {
    headers: { "content-type": "text/html" }
    });
  
  let myLinks;
  const response = await fetch(link, { 
    headers: { "content-type": "application/json" }
  });
  myLists = JSON.stringify(await response.json());

  // return res;
  return new HTMLRewriter()
    .on("div#links", new LinksTransformer(myLinks))
    .on("div#profile", new MakeVisible())
    .on("img#avatar", new ElementRewriter("src", avatar_src))
    .on("h1#name", new ElementRewriter("innerText", "LLL"))
    .transform(res);
}