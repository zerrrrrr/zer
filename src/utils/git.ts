import { cacheRoot, ensurePath, ifDirExist } from './file'
import { runShellSync } from './process'

export const gitUpdate = (repo: string) => {
  ensurePath(cacheRoot)
  const dirName = `${cacheRoot}/${repo}`
  let isRefresh = !ifDirExist(dirName)
  runShellSync(
    isRefresh
      ? `git clone git@github.com:${repo}.git --depth=1 ${dirName}`
      : `cd ${dirName} && git pull`
  )
  const currentHash = runShellSync(`cd ${dirName} && git rev-parse HEAD`)
  return { isRefresh, currentHash, dirName }
}
