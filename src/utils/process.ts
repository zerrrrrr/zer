const childProcess = require('child_process');

export const runShellSync = (cmd: string, options = {}) => {
  return childProcess.execSync(cmd, options)?.toString()?.trim();
};
