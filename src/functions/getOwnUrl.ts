export const getOwnUrl = () => {
  const vercelUrl = process.env["VERCEL_URL"] as string | undefined
  const gitpodWorkspaceUrl = process.env["GITPOD_WORKSPACE_URL"] as string | undefined
  const gitpodUrl = gitpodWorkspaceUrl?.replace(/^https:\/\//, "https://3000-")

  return vercelUrl || gitpodUrl
}
