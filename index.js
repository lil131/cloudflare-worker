const LINKS = [
  { "name": "cloudflare", "url": "https://www.cloudflare.com/" },
  { "name": "github", "url": "https://www.github.com" },
  { "name": "assignment", "url": "https://github.com/cloudflare-hiring/cloudflare-2020-general-engineering-assignment/#deploy-a-json-api" },
];

const STATIC_LINK = "https://static-links-page.signalnerve.workers.dev";
const avatar_src = "https://avatars2.githubusercontent.com/u/43486346?s=400&u=720341aef70f93e7ef474f0be55c9e358868a75a&v=4";
const SVG = '<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>YouTube icon</title><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>';

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
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      });
    }  
    else {
      const newLink = new URL('/links', link);
      return getStatic(newLink.href);
    }
  } catch(err) {
    console.log("error: ", err.message)
    return new Response("ERROR", { status: 500 });
  }
};


class LinksTransformer {
  constructor(link) {
    this.link = link;
  }
  
  //add in a new a for each link in your API using HTMLRewriter.
  async element(element) {
    // const myLinks = LINKS;
    let myLinks;
    console.log(this.link)
    const response = await fetch(this.link, { 
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    });
    myLists = JSON.parse(await response.json());

    myLinks.forEach(link => {
      element.append(`<a href=${link.url}>${link.name}</a>`, { html: Boolean });
    });
  }
}

class AttrRemover {
  constructor(attributeName) {
    this.attributeName = attributeName;
  }

  async element(element) {
    element.removeAttribute('style');
  }
}

class AttrRewriter {
  constructor(attributeName, value) {
    this.attributeName = attributeName;
    this.value = value;
  };

  async element(element) {
    element.setAttribute(this.attributeName, this.value);
  };
}

class ContentRewriter {
  constructor(content) {
    this.content = content;
  }

  async element(element) {
    element.setInnerContent(this.content, { html: Boolean })
  }
}

async function getStatic(link) {
  const res = await fetch(STATIC_LINK, {
    headers: { "content-type": "text/html" }
    });

  // return res;
  return new HTMLRewriter()
    .on("div#links", new LinksTransformer(link))
    .on("div#profile", new AttrRemover("style"))
    .on("img#avatar", new AttrRewriter("src", avatar_src))
    .on("h1#name", new AttrRewriter("innerText", "LLL"))
    .on("div#social", new AttrRemover("style"))
    .on("div#social", new ContentRewriter(`<a href="https://youtube.com">${SVG}</a>`))
    .on("title", new ContentRewriter("Linlu Liu"))
    .on("body", new AttrRewriter("style", "background-color : #73C3D5"))
    .transform(res);
}