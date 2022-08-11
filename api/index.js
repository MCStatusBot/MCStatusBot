
/*
 * this api is private and purerly for bot -> website backend comunication so the access code gets shared with no-one!
 * you dont even look at it if thats possible and no no passwords no Hunter1 you want a randomly generated string 
 * like your bots token BUT DONT USE THAT EITHER you can either use the setup script or manually generate one with a website
 * for a better lecture and what could happen if you leak this see https://docs.mcstatusbot.site/selfhosting/security
 * 
 * 
 * why have this in the first place so the website can go down for updates when the bot stays up and vise versa
*/


const express = require('express')