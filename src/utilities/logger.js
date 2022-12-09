import { logger as _logger, consoleTransport } from 'react-native-logs'

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: 'debug',
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  enabled: true,
}

const log = _logger.createLogger(defaultConfig)

const logger = (prefix, message, level = 'info') => {
  if (message) {
    log[level](`>> ${prefix}:`, message)
  } else {
    log[level](`>> :`, prefix)
  }
}

export default logger
