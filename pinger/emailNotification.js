module.exports = (mcServer) => {};
const log = require("../log");
const nodemailer = require("nodemailer");
const emailBanList = require("../emailbanlist.json");
const { RateLimiter } = require("discord.js-rate-limiter");

const emailRateLimiter = new RateLimiter(1000, 60000); // Rate limit to 1000 email to that email every hour i think;
// create reusable transporter object using the default SMTP transport
let emailClient = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: parseFloat(process.env.EMAIL_PORT),
    secure: parseFloat(process.env.EMAIL_PORT) == 465 ? true : false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports.send = async function (to, subject, body) {
    const footer = "this is an automated email sent from https://www.mcstatusbot.site to notify you of your minecraft server status if you do not want to receive these email please reply and ask for your email to be blacklisted (only the bot/email owner can see replys)";
    const limited = emailRateLimiter.take(to);
    if (emailBanList.includes(to) || limited) return;
    try {
        await emailClient.sendMail({
            from: `"${process.env.EMAIL_FROM || "MC Status Bot"}" <${process.env.EMAIL_EMAILADRESS}>`, // sender address
            //to: email + ', ' + email, // list of receivers
            to: to, // list of receivers
            bcc: undefined,
            subject: strip_tags(subject) || "MCStatusBot", // Subject line
            text: strip_tags(body) + process.env.EMAIL_DISCLAIMER.toLocaleLowerCase() === "true" ? `\n\n-----\n${strip_tags(footer)}` : "", // plain text body
            html: strip_tags(body) + process.env.EMAIL_DISCLAIMER.toLocaleLowerCase() === "true" ? `<br><br>-----<br>${footer}` : "", // html body
        });
    } catch (er) {
        logger.error(er.stack || er);
    }
    return;
};

function strip_tags(html, ...args) {
  return html
    .replace(/<(\/?)(\w+)[^>]*\/?>/g, (_, endMark, tag) => {
      return args.includes(tag) ? "<" + endMark + tag + ">" : "";
    })
    .replace(/<!--.*?-->/g, "");
}
