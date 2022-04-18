import chalk from 'chalk';

export const Logger = {

    error: (message: string) => {
        console.log(
            chalk.redBright(`[💥] ${chalk.bold(`ERROR`)} :: `) + 
            chalk.whiteBright(message)
        );
    },

    warning: (message: string) => {
        console.log(
            chalk.yellowBright(`[💢] ${chalk.bold(`WARNING`)} :: `) + 
            chalk.whiteBright(message)
        );
    },

    info: (message: string, emoji: string = '🔨') => {
        console.log(
            chalk.cyanBright(`[${emoji}] ${chalk.bold(`INFO`)} :: `) + 
            chalk.whiteBright(message)
        );
    }

} 