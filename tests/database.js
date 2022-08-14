require('dotenv').config({ path: __dirname+'/../.env' });
const db = require('../database/index');


async function main() {
    if (process.env.DEBUG != "true" && process.env.DEBUG != true) {
        process.exitCode = 1;
        throw new Error('you must enable debug to run test scripts');
    }

    //connec
    await db.connect();

    console.log("making user")
    await db.create('user', "245432544", {id: "245432544", username:"test", tag: '1234',avatar: 'https://example.bruvland.com/img.png',email: "example@bruvland.com"});
    console.log("made user");

    console.log("getting user");

    const user = await db.lookup('user', '245432544');
    console.log("got user");
    console.log(user);

    console.log("saving email change to user");
    user.email = "new.example@bruvland.com";
    await user.save();
    console.log("saved user");

    console.log("getting all users");
    const users = await db.getAll('user');
    console.log("got all users");
    console.log(users);

    console.log("deleting user");

    await db.delete('user', '245432544');
    console.log("deleted user please check mongo to see if its gone too");
    process.exitCode = 1;
    throw new Error('Exit');
}

main()