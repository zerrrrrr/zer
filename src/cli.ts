import { Command } from 'commander'
import commands from './commands'
import figlet from 'figlet'
import pkgInfo from '../package.json'

const program = new Command()

program.version(pkgInfo.version)

const logo = figlet.textSync('ZER')

commands.forEach((commandInfo) => {
  const {
    name,
    description,
    options = [],
    action,
    shortcut,
    args = [],
  } = commandInfo
  ;[name, shortcut].forEach((e) => {
    if (!e) return
    let pipeline = program.command(e).description(description)
    if (args) pipeline = pipeline.arguments(args.map((e) => `<${e}>`).join(' '))
    options.reduce((acc, item) => {
      return acc.option(item.name, item.description)
    }, pipeline)

    pipeline.action((...processArgs) => {
      const options = processArgs[args?.length]
      const a = args?.length
        ? Object.fromEntries(
            args.map((e, idx) => [e, processArgs?.[idx] ?? ''])
          )
        : {}
      action(a, options)
    })
  })
})

const _helpInformation = program.helpInformation
program.helpInformation = function () {
  return `\n${logo}\n${_helpInformation.call(this)}`
}

program.description(pkgInfo.description)

program.parse(process.argv)
