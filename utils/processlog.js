const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');

async function append(text) {
    var stats = fs.statSync(__dirname + '/logs/log.log');
    var fileSizeInkilobytes = stats.size / 1000;
    if (fileSizeInkilobytes > 500) {
        await fs.renameSync(__dirname + '/logs/log.log', __dirname + '/logs/archive-' + moment().format('YYYY-MM-DD') + '.log',)
        await fs.writeFileSync(__dirname + '/logs/log.log',""); 
    }
    
    fs.appendFileSync(__dirname + '/logs/log.log', text + '\n', function(err) {
        if (err) console.error(chalk.red('Error writing logs to file: ' + err))
    });
}

module.exports = logger = {
    info: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stdout.write(chalk.gray(`${time} [info]: `) + text + '\n')

        append(time + ' [info]: ' + text)
    },
    success: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stdout.write(chalk.gray(`${time} [${chalk.green('success')}]: `) + text + '\n')

        append(time + ' [success]: ' + text)
    },
    error: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.red('error')}]: `) + chalk.red(text) + '\n')

        append(time + ' [error]: ' + text)
    },
    warn: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.yellow('warn')}]: `) + text + '\n')

        append(time + ' [warn]: ' + text)
    },
    crash: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.red('CRASH')}]: `) + text + '\n')
        
        append(time + ' [CRASH]: ' + text)
    }
}