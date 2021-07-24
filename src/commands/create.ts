import { BaseCommand } from './utils'
import {
  copyFileAndReplace,
  defaultOrg,
  defaultPrefix,
  fmtGitRepo,
  getBasename,
  gitUpdate,
  ifDirExist,
  isFile,
  runShellSync,
} from '../utils'

type CreateCommandParams = {
  repo: string
  name: string
}

const initShell = 'zer-stand-by.sh'
const commandName = 'create'

class CreateCommand extends BaseCommand<CreateCommandParams> {
  options: CreateCommandParams | null = null

  parseParams(options: Partial<CreateCommandParams>) {
    let { repo, name } = options
    if (repo && name) {
      repo = fmtGitRepo(repo)
      this.options = {
        repo,
        name,
      }
    } else {
      this.log.error(`Repo and name required.`)
    }
  }

  handleCommand() {
    if (!this.options) return false
    if (ifDirExist(this.options.name)) {
      this.log.error(`Path "${this.options.name}" existed.`)
    }
    const { dirName, isRefresh } = gitUpdate(this.options.repo)
    const projectName = getBasename(this.options.name)
    this.log.success(
      `Fetched ${this.options.repo}, ${
        isRefresh ? 'refreshed' : 'from cached.'
      }`
    )
    copyFileAndReplace({
      filePath: dirName,
      output: this.options.name,
      excludes: [/\.git/g],
      replaceTpl: (e) => e.split('$ZER_NAME').join(projectName),
    })

    if (isFile(`${this.options.name}/${initShell}`)) {
      this.log.success(`Excuting zer-stand-by.sh`)
      runShellSync(`cd ${this.options.name} && sh zer-stand-by.sh`, {
        stdio: 'inherit',
      })
    }
    this.log.success(`Checkout your project ${this.options.name} here.`)
  }
}

const command: CommandInfo<CreateCommandParams> = {
  name: commandName,
  shortcut: 'c',
  description: 'create repository from template.',
  options: [
    {
      name: '-r, --repo <repo>',
      description: `Repo name like "py", ${defaultPrefix}-py, @${defaultOrg}/${defaultPrefix}-py`,
    },
    {
      name: '-n, --name <name>',
      description: `Project name.`,
    },
  ],
  args: ['name'],
  action: (args, options) => {
    const command = new CreateCommand(commandName)
    return command.handler({ ...options, name: args?.name ?? options.name })
  },
}

export default command
