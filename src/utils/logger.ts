import chalk from 'chalk'

export class Logger {
  private command: string

  private startTime: number

  constructor() {
    this.command = ''
    this.startTime = new Date().getTime()
  }

  start(command: string) {
    this.command = command
    this.startTime = new Date().getTime()
  }

  log(text: string, color: string) {
    // eslint-disable-next-line no-console
    this.command && console.log(chalk[color](`[Zer ${this.command}]: ${text}`))
  }

  error(text: string) {
    this.log(text, 'red')
    if (process.env.NODE_ENV !== 'test') {
      process.exit(-1)
    }
  }

  warning(text: string) {
    this.log(text, 'yellow')
  }

  success(text: string) {
    this.log(text, 'green')
  }

  info(text: string) {
    this.log(text, 'white')
  }

  done() {
    const endTime = new Date().getTime()
    this.log(`Done! Finished in ${endTime - this.startTime}ms.`, 'green')
  }
}
