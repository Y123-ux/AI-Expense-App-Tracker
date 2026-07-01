const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${timestamp()} - ${message}`, ...args);
  },
  success: (message: string, ...args: unknown[]) => {
    console.log(`${colors.green}[OK]${colors.reset} ${timestamp()} - ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${timestamp()} - ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${timestamp()} - ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${colors.cyan}[DEBUG]${colors.reset} ${timestamp()} - ${message}`, ...args);
    }
  },
};
