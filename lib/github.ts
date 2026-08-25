const GITHUB_API = "https://api.github.com";

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN!;

function headers() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function getGithubFile(path: string) {
  const url =
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}` +
    `?ref=${branch}`;

  const response = await fetch(url, {
    headers: headers(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `GitHub GET failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function updateGithubFile(
  path: string,
  content: string,
  message: string,
  sha: string
) {
  const url =
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const encodedContent = Buffer.from(content).toString("base64");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: encodedContent,
      sha,
      branch,
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `GitHub UPDATE failed: ${response.status} ${error}`
    );
  }

  return response.json();
}

export async function createGithubFile(
  path: string,
  content: Buffer,
  message: string
) {
  const url =
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const encodedContent = content.toString("base64");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: encodedContent,
      branch,
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `GitHub CREATE failed: ${response.status} ${error}`
    );
  }

  return response.json();
}

export async function deleteGithubFile(
  path: string,
  message: string,
  sha: string
) {
  const url =
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sha,
      branch,
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `GitHub DELETE failed: ${response.status} ${error}`
    );
  }

  return response.json();
}