import { Command } from 'commander'
import commands from './commands'
import figlet from 'figlet'
import pkgInfo from '../package.json'

const program = new Command()

program.version(pkgInfo.version)

const logo = figlet.textSync('ZER')

commands.forEach(commandInfo => {
  const { name, description, options = [], action, shortcut } = commandInfo
  ;[name, shortcut].forEach(e => {
    if (!e) return
    const pipeline = program.command(e).description(description)

    options.reduce((acc, item) => {
      return acc.option(item.name, item.description)
    }, pipeline)

    pipeline.action(action)
  })
})

const _helpInformation = program.helpInformation
program.helpInformation = function() {
  return `\n${logo}\n${_helpInformation.call(this)}`
}

program.description(pkgInfo.description)

program.parse(process.argv)
