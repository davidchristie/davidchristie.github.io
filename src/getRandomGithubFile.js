import axios from 'axios'

const USER = 'davidchristie'

async function getBranches (respository) {
  const owner = respository.owner.login
  const repo = respository.name
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/branches`
  )
  return response.data
}

function getFiles (tree) {
  return tree.filter(element => element.type === 'blob')
}

async function getRepositories () {
  const response = await axios.get(`https://api.github.com/users/${USER}/repos`)
  const repositories = response.data
  return repositories.filter(repository => !repository.fork)
}

async function getTree (owner, repo, sha) {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`
  )
  return response.data.tree
}

function pickRandom (elements) {
  return elements[Math.floor(elements.length * Math.random())]
}

export default async function getRandomGithubFile () {
  const owner = USER
  const repository = pickRandom(await getRepositories())
  const repo = repository.name
  let branch = null
  while (!branch) {
    branch = pickRandom(await getBranches(repository))
  }
  const sha = branch.commit.sha
  const tree = await getTree(owner, repo, sha)
  const file = pickRandom(getFiles(tree))
  const { path } = file
  const raw = await axios.get(
    `https://cdn.rawgit.com/${owner}/${repo}/${branch.name}/${path}`
  )
    .then(response => response.data)
  return {
    content: typeof raw === 'string'
      ? raw
      : JSON.stringify(raw, null, 2),
    path,
    url: `https://github.com/${owner}/${repo}/blob/${branch.name}/${path}`
  }
}
