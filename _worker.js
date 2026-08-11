// Trigger rebuild — re-deploy agency landing
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname.replace(/^www\./, '');
    const path = url.pathname;

    // Build asset path within sites/${hostname}/
    let assetPath = `/sites/${hostname}${path}`;

    // Normalize: directory paths get index.html appended
    if (assetPath.endsWith('/')) {
      assetPath += 'index.html';
    } else if (!assetPath.split('/').pop().includes('.')) {
      assetPath += '/index.html';
    }

    // Try to serve the asset
    let response = await env.ASSETS.fetch(new URL(assetPath, url.origin));

    // If 404 and path had no trailing slash, try as directory
    if (response.status === 404 && !path.endsWith('/') && !path.split('/').pop().includes('.')) {
      const dirPath = `/sites/${hostname}${path}/index.html`;
      response = await env.ASSETS.fetch(new URL(dirPath, url.origin));
    }

    return response;
  }
};
