/**
 * GitHub Data Writer
 *
 * Writes product JSON files directly to the GitHub repo using the Git Tree API.
 * This is how the webhook persists data in production — no database, no external
 * services. The GitHub repo IS the database.
 *
 * Key design: Uses the Git Tree API to batch ALL changed files into a SINGLE
 * git commit, regardless of how many products changed. So updating 10,000
 * products only costs ~4 GitHub API calls (get ref → create tree → create commit
 * → update ref), well within GitHub's 5,000 req/hour free limit.
 */

const GITHUB_API = 'https://api.github.com';
const OWNER = process.env.GITHUB_OWNER || 'Danaemisdan';
const REPO = process.env.GITHUB_REPO || 'Nexmartapp';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const TOKEN = process.env.GITHUB_TOKEN || '';

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

// ─── Get current branch tip SHA ───────────────────────────────────────────────
async function getBranchSha(): Promise<string> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`GitHub: failed to get branch ref — ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.object.sha as string;
}

// ─── Get commit tree SHA from a commit SHA ────────────────────────────────────
async function getTreeSha(commitSha: string): Promise<string> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/commits/${commitSha}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`GitHub: failed to get commit — ${res.status}`);
  const data = await res.json();
  return data.tree.sha as string;
}

// ─── Create a new tree with file changes ─────────────────────────────────────
async function createTree(
  baseTreeSha: string,
  files: Array<{ path: string; content: string }>
): Promise<string> {
  const treeItems = files.map(f => ({
    path: f.path,
    mode: '100644', // regular file
    type: 'blob',
    content: f.content,
  }));

  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/trees`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
  });
  if (!res.ok) throw new Error(`GitHub: failed to create tree — ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.sha as string;
}

// ─── Create a commit ─────────────────────────────────────────────────────────
async function createCommit(
  message: string,
  treeSha: string,
  parentSha: string
): Promise<string> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/commits`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ message, tree: treeSha, parents: [parentSha] }),
  });
  if (!res.ok) throw new Error(`GitHub: failed to create commit — ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.sha as string;
}

// ─── Update branch ref to point to new commit ────────────────────────────────
async function updateRef(commitSha: string): Promise<void> {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ sha: commitSha, force: false }),
  });
  if (!res.ok) throw new Error(`GitHub: failed to update ref — ${res.status} ${await res.text()}`);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface GitHubFile {
  path: string; // e.g. "public/data/products/oval_1.json"
  content: string; // JSON string
}

/**
 * Commits a batch of file changes to the repo in a SINGLE git commit.
 * All 50k product files (if they all changed) = exactly 4 API calls.
 * Only changed files are included — unchanged ones are never touched.
 */
export async function commitFiles(files: GitHubFile[], message: string): Promise<void> {
  if (!TOKEN) {
    console.warn('[GitHub] No GITHUB_TOKEN set — skipping GitHub write (local mode)');
    return;
  }
  if (files.length === 0) {
    console.log('[GitHub] No files to commit.');
    return;
  }

  console.log(`[GitHub] Committing ${files.length} file(s)...`);

  const branchSha = await getBranchSha();
  const treeSha = await getTreeSha(branchSha);
  const newTreeSha = await createTree(treeSha, files);
  const newCommitSha = await createCommit(message, newTreeSha, branchSha);
  await updateRef(newCommitSha);

  console.log(`[GitHub] Committed ${files.length} files → ${newCommitSha.slice(0, 7)}`);
}

export function isGitHubConfigured(): boolean {
  return !!TOKEN;
}
