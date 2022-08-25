module.exports = (mcServer) => {

}
const log = require('../log');
const nodemailer = require('nodemailer');
const { emailBanList } = require('../emailbanlist.json');
const { RateLimiter } = require('discord.js-rate-limiter');

const emailRateLimiter = new RateLimiter(1000, 60000) // Rate limit to 10000 email to that email every hour i think;
// create reusable transporter object using the default SMTP transport
let emailClient = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: parseFloat(process.env.EMAIL_PORT),
    secure: parseFloat(process.env.EMAIL_PORT) == 465 ? true : false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function send(to, subject, body) {
    const footer = 'this was an automated email sent from https://www.mcstatusbot.site to notify you of your minecraft server status if you do not want to receive these email please reply and ask for your email to be blacklisted (only me and the email owner can see replys)';
    const limited = emailRateLimiter.take(to);
    if (emailBanList.includes(to)) {
        return;
    }
    if (limited) {
        return;
    }
    await emailClient.sendMail({
        from: `"${process.env.EMAIL_FROM || 'MC Status Bot'}" <${process.env.EMAIL_EMAILADRESS}>`, // sender address
        //  to: email + ', ' + email, // list of receivers
        to: to.join(', '), // list of receivers
        subject: strip_tags(subject) || 'MCStatusBot', // Subject line
        text: strip_tags(body) + '\n\n-----\n' + strip_tags(footer), // plain text body
        html: strip_tags(body) + '<br><br>-----<br>' + footer // html body
    }).then((send) => {
    }).catch((er) => {
        logger.error(er.stack || er)
    });
    return;
}

function strip_tags(html, ...args) {
    return html.replace(/<(\/?)(\w+)[^>]*\/?>/g, (_, endMark, tag) => {
        return args.includes(tag) ? '<' + endMark + tag + '>' : '';
    }).replace(/<!--.*?-->/g, '')
}