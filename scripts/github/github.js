const request = require('request-promise-native');
const { GITHUB_API_TOKEN } = process.env;

function getFileContent(owner, repo, path, commit) {
  let endpoint = `/repos/${owner}/${repo}/contents/${path}`;
  if (commit) {
    endpoint += `?ref=${commit}`;
  }
  return apiRequest(endpoint).then(result => {
    if (result && result.content) {
      const encoding = result.encoding || 'base64';
      const content = Buffer.from(result.content, encoding).toString();
      return content;
    }
  });
}

async function fetchContent(url) {
  const result = await _request(url);
  if (result && result.content) {
    const encoding = result.encoding || 'base64';
    const content = Buffer.from(result.content, encoding).toString();
    return content;
  } else {
    return null;
  }
}

async function fetchPRFile(owner, repo, pr, filename) {
  const endpont = `/repos/${owner}/${repo}/pulls/${pr}/files`
  const prFiles = await apiRequest(endpont);
  for (const prFile of prFiles) {
    if (prFile.filename === filename) {
      const contentUrl = prFile.contents_url;
      const content = await fetchContent(contentUrl);
      return content;
    }
  }
  throw new Error('File not found');
}

function fetchFile({base, commit, path, prefix}) {
  // try to match base as a github repo url
  const matches = new RegExp('^https?://github[.]com/([^/]+)/([^/]+)(?:/tree/([^/]+))?(.*)$').exec(base);

  // couldn't match the base
  if (!matches) {
    throw new Error('Could not extract repo and owner from url');
  }

  // build github contents api url
  const owner = matches[1];
  const repo = matches[2];
  const baseRef = matches[3];
  const basePath = matches[4];

  let filePath = basePath;
  if (prefix) {
    filePath += '/' + prefix;
  }
  filePath += '/' + path;
  if (filePath[0] === '/') {
    filePath = filePath.slice(1);
  }

  if (!commit && baseRef) {
    commit = baseRef;
  }

  return getFileContent(owner, repo, filePath, commit);
}

async function fetchJson({base, commit, path, prefix}) {
  const content = await fetchFile({base, commit, path, prefix});
  try {
    const json = JSON.parse(content);
    return json;
  } catch(parseErr) {
    return Promise.reject(parseErr);
  }
}

async function fetchPluginJson(url, commit) {
  let json;

  for (const prefix of ['dist', '', 'src']) {
    try {
      json = await fetchJson({ base: url, commit, path: 'plugin.json', prefix });
      return { json, prefix };
    } catch(err) {
      // Skip errors for first two prefixes
      if (prefix === 'src') {
        throw new Error(err.message);
      }
    }
  }

  throw new Error('Could not find plugin.json');
}

function apiRequest(endpoint) {
  const githubApiUrl = 'https://api.github.com';
  const url = `${githubApiUrl}${endpoint}`;
  return _request(url);
}

function _request(url) {
  const options = {
    uri: url,
    headers: {
      'User-Agent': 'NodeJS'
    },
    json: true
  };
  if (GITHUB_API_TOKEN) {
    options.headers['Authorization'] = `token ${GITHUB_API_TOKEN}`;
  }
  return request(options);
}

module.exports = {
  getFileContent,
  fetchPluginJson,
  fetchPRFile,
  request: apiRequest,
};
