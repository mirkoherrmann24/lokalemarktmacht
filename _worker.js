// Trigger rebuild — re-deploy agency landing
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const rawHost = url.hostname;
    const hostname = rawHost.replace(/^www\./, '');

    if (hostname === 'lokalemarktmacht.de') {
      return Response.redirect('https://www.local-expert.de' + url.pathname + url.search, 301);
    }
    if (rawHost === 'local-expert.de') {
      return Response.redirect('https://www.local-expert.de' + url.pathname + url.search, 301);
    }

    const path = url.pathname;
    let assetPath = '/sites/' + hostname + path;
    if (assetPath.endsWith('/')) {
      assetPath += 'index.html';
    } else if (!assetPath.split('/').pop().includes('.')) {
      assetPath += '/index.html';
    }

    let response = await env.ASSETS.fetch(new URL(assetPath, url.origin));

    if (response.status === 404 && !path.endsWith('/') && !path.split('/').pop().includes('.')) {
      response = await env.ASSETS.fetch(new URL('/sites/' + hostname + path + '/index.html', url.origin));
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cache-Control', 'no-cache, must-revalidate');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers: newHeaders });
    }
    return response;
  }
};
