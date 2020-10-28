const LINKS = [
  { "name": "cloudflare", "url": "https://www.cloudflare.com/" },
  { "name": "github", "url": "https://www.github.com" },
  { "name": "assignment", "url": "https://github.com/cloudflare-hiring/cloudflare-2020-general-engineering-assignment/#deploy-a-json-api" },
];

const STATIC_LINK = 'https://static-links-page.signalnerve.workers.dev';
const avatar_src = "https://avatars2.githubusercontent.com/u/43486346?s=400&u=720341aef70f93e7ef474f0be55c9e358868a75a&v=4";
// const SVG = '<svg class="svg-icon" viewBox="0 0 20 20"><path fill="none" d="M18.258,3.266c-0.693,0.405-1.46,0.698-2.277,0.857c-0.653-0.686-1.586-1.115-2.618-1.115c-1.98,0-3.586,1.581-3.586,3.53c0,0.276,0.031,0.545,0.092,0.805C6.888,7.195,4.245,5.79,2.476,3.654C2.167,4.176,1.99,4.781,1.99,5.429c0,1.224,0.633,2.305,1.596,2.938C2.999,8.349,2.445,8.19,1.961,7.925C1.96,7.94,1.96,7.954,1.96,7.97c0,1.71,1.237,3.138,2.877,3.462c-0.301,0.08-0.617,0.123-0.945,0.123c-0.23,0-0.456-0.021-0.674-0.062c0.456,1.402,1.781,2.422,3.35,2.451c-1.228,0.947-2.773,1.512-4.454,1.512c-0.291,0-0.575-0.016-0.855-0.049c1.588,1,3.473,1.586,5.498,1.586c6.598,0,10.205-5.379,10.205-10.045c0-0.153-0.003-0.305-0.01-0.456c0.7-0.499,1.308-1.12,1.789-1.827c-0.644,0.28-1.334,0.469-2.06,0.555C17.422,4.782,17.99,4.091,18.258,3.266"></path></svg>'
const SVG = ' <svg xmlns="http://www.w3.org/2000/svg"> <text x="10" y="50" font-size="30">My SVG</text> </svg> '

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
        headers: { "Content-Type": "application/json" }
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
    const response = await fetch(this.link, { 
      headers: { "Content-Type": "text/plain" }
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
    .on("div#links", new LinksTransformer(LINKS))
    .on("div#profile", new AttrRemover("style"))
    .on("img#avatar", new AttrRewriter("src", avatar_src))
    .on("h1#name", new AttrRewriter("innerText", "LLL"))
    .on("div#social", new AttrRemover("style"))
    .on("div#social", new ContentRewriter(`<a href="https://youtube.com">${SVG}</a>`))
    .on("title", new ContentRewriter("Linlu Liu"))
    .on("body", new AttrRewriter("style", "background-color : #73C3D5"))
    .transform(res);
}