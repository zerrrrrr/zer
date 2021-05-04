export const defaultOrg = 'zerrrrrr'
export const defaultPrefix = 'zer-boilerplate'

export const fmtGitRepo = (repo = 'nts') => {
  if (repo.includes('/')) return repo
  if (repo.includes(defaultPrefix)) return `${defaultOrg}/${repo}`
  return `${defaultOrg}/${defaultPrefix}-${repo}`
}
