import { Logger } from '../utils'

export class BaseCommand<T> {
  options: T | null = null

  commandName = 'base-command'

  /** 日志相关的基础能力 */
  log = new Logger()

  parseParams(_: Partial<T>) {
    this.log.error(`you call baseCommand parseParams Function`)
  }

  handleCommand() {
    this.log.error(`you call baseCommand handleCommand Function`)
  }

  readSingleConfig() {}

  constructor(commandName: string, ifIgnoreConfig?: boolean) {
    this.commandName = commandName
    if (!ifIgnoreConfig) {
      this.readSingleConfig()
    }
  }

  handler(options: Partial<T>) {
    this.log.start(this.commandName)
    this.parseParams(options)
    const res = this.handleCommand()
    this.log.done()
    return res
  }
}
