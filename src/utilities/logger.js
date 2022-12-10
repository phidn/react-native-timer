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

const _loggerInstance = _logger.createLogger(defaultConfig)

const logger = (prefix, message, level = 'info') => {
  if (message && typeof message !== 'object') {
    _loggerInstance[level](`>> ${prefix}: ${message}`)
  }
  if (message && typeof message === 'object') {
    _loggerInstance[level](`>> ${prefix}:`, message)
  }
  if (!message && prefix) {
    _loggerInstance[level]('>>', prefix)
  }
}

export default logger
