import os from 'os'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

export const configRoot = `${os.homedir()}/.zer`
export const cacheRoot = `${configRoot}/cache`

export const ifDirExist = (dir: string) => {
  return fs.existsSync(dir)
}

export const isDir = (dir: string) => {
  return ifDirExist(dir) && fs.lstatSync(dir).isDirectory()
}

export const isFile = (filePath: string) => {
  return ifDirExist(filePath) && fs.lstatSync(filePath).isFile()
}

export const getPwd = (subDir: string, runtime = false) => {
  return path.resolve(runtime ? process.cwd() : __dirname, subDir)
}

export const getPwdRelativeProject = (subDir: string, runtime = false) => {
  return path.resolve(
    runtime ? process.cwd() : path.resolve(__dirname, '../'),
    subDir
  )
}

export const getBasename = (dir: string) => {
  return path.basename(dir);
}

export const copyFileSync = (source: string, target: string) => {
	let targetFile = target
	if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source))
  return targetFile
}

export const isRelativePath = (filePath: string) => /^\.\//.test(filePath)

export const isAbsolutePath = (filePath: string) => /^\//.test(filePath)

export const ensurePath = (dirName: string) => {
  if (!ifDirExist(dirName)) {
    mkdirp.sync(dirName)
  }
}

export const copyFileAndReplace = ({
  filePath,
  output,
  replaceTpl = content => content,
  excludes = [],
}: {
  filePath: string
  output: string
  replaceTpl?: (content: string) => string
  excludes?: RegExp[]
}) => {
  if (isFile(filePath)) {
    const content = fs.readFileSync(filePath).toString()
    const newContent = replaceTpl(content)
    fs.writeFileSync(output, newContent)
  } else if (isDir(filePath)) {
    const files = fs.readdirSync(filePath)
    files.forEach(fileName => {
      const formatFileName = replaceTpl(fileName)
      const childOutput = path.resolve(output, formatFileName)
      if (excludes.some(e => e.test(childOutput))) return
      ensurePath(path.dirname(childOutput))
      copyFileAndReplace({
        filePath: path.resolve(filePath, fileName),
        output: childOutput,
        replaceTpl,
        excludes,
      })
    })
  }
}
