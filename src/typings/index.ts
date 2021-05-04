interface CommandInfo {
  /** 命令名称 */
  name: string
  /** 命令描述 */
  description: string
  /** 缩写 */
  shortcut?: string
  /** 命令参数 */
  options?: {
    /** 参数名称 */
    name: string
    /** 参数描述 */
    description: string
  }[]
  /** 命令处理函数 */
  action: (option: any) => any
}
