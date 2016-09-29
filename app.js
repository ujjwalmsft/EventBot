require('./globals.js')(); // global configurations
require('./capitalize.js')(); // adding capitalize method to the string prototype
require('./config.js')();
require('./connectorSetup.js')();
require('./helpers.js')();
require('./search.js')();


//require('./lib/msgMiddleware.js')(); // message middleware

// Entry point of the bot
bot.dialog('/', [
    function (session) {
        /*
        if(!session.message.source == "skype"){
            useQuickReply = false;
        }
        */
        //If this is our first time seeing this user
        if (session.userData.welcome != true)
        {
             session.replaceDialog('/welcome');
        }
        session.replaceDialog('/promptButtons');
    }    
]);

bot.dialog('/welcome', [
    function (session) {
        if (session.userData.welcome != true)
        {
            session.userData.welcome = true;
            session.sendTyping();       
            var msg = "Welcome to the AI Conference Bot. This message will only open once";
            session.send(msg);
        }
    }
]);

bot.dialog('/error', [
    function (session) {
            var msg = "Seems I slipped up - sorry!";
            session.send(msg);
            global.restartDialog(session,'/promptButtons');
        }
]);

bot.dialog('/promptButtons', [
    function (session) {
        builder.Prompts.choice(session, "How would you like to explore the AI conference?", "Sessions|People|Sponsors/Sessions");
    },
    function (session, results) {
        if (results.response) {
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Sessions":
                    session.replaceDialog('/sessions');
                    break;
                case "People":
                    session.replaceDialog('/people');
                    break;
                case "Sponsors/Expos":
                    session.replaceDialog('/sponsors');
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
]);

require('./dialogs/events.js')();
require('./dialogs/people.js')(); 
require('./dialogs/sponsors.js')(); 
require('./dialogs/results.js')();