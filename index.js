const mineflayer = require('mineflayer');

const botOptions = {
    host: 'as.pookiesmp.in',             // Server IP
    port: 25565,                         
    username: 'jhon88',                  // Bot Username
    version: '1.21.11'                   
};

const botPassword = "jhon883355"; 

function createBot() {
    console.log('Bot (jhon88) is connecting via Termux mobile network...');
    const bot = mineflayer.createBot(botOptions);

    // Auto-accept server texture packages
    bot.on('resourcePack', (url, hash) => {
        console.log('Server resource pack requested. Accepting...');
        bot.acceptResourcePack();
    });

    bot.on('spawn', () => {
        console.log('jhon88 successfully spawned in!');
    });

    // Right-clicks hotbar slot 1 after logging in
    function useHotbarItem() {
        console.log('Password sent. Waiting 3.5 seconds before right-clicking...');
        setTimeout(() => {
            try {
                bot.setQuickBarSlot(0); 
                console.log('Equipped the 1st hotbar slot.');
                bot.activateItem(); 
                console.log('Right-clicked item. Waiting for survival selector menu...');
            } catch (err) {
                console.log(`Failed to right-click item: ${err.message}`);
            }
        }, 3500); 
    }

    // Auto-clicks survival option inside the chest GUI layout
    bot.on('windowOpen', (window) => {
        console.log(`Menu opened! Title/Type: ${window.title || window.type}`);
        const targetItem = window.containerItems().find(item => {
            const itemText = JSON.stringify(item).toLowerCase();
            return itemText.includes('survival');
        });

        if (targetItem) {
            console.log(`Found survival option at slot index: ${targetItem.slot}. Clicking it...`);
            bot.clickWindow(targetItem.slot, 0, 0)
                .then(() => console.log('Successfully clicked survival menu item! Joining game...'))
                .catch(err => console.log(`Click failed: ${err.message}`));
        } else {
            console.log('Could not find an option matching "survival" in this menu.');
        }
    });

    // Master command listener for minak
    bot.on('chat', (username, message) => {
        if (username !== 'minak') return;
        console.log(`Master minak issued a command: ${message}`);
        const cleanMessage = message.toLowerCase().trim();

        if (cleanMessage === 'tpa' || cleanMessage === 'tp') {
            console.log('Teleport command detected. Sending TPA request...');
            bot.chat('/tpa minak');
        }
        else if (message.startsWith('say ')) {
            const chatToRepeat = message.replace('say ', '');
            bot.chat(chatToRepeat);
        }
        else if (cleanMessage === 'drop') {
            if (bot.heldItem) bot.tossStack(bot.heldItem);
            else bot.chat('I am not holding any item to drop, minak.');
        }
        else if (cleanMessage === 'look') {
            const playerFilter = (entity) => entity.type === 'player' && entity.username === 'minak';
            const masterPlayer = bot.nearestEntity(playerFilter);
            if (masterPlayer) bot.lookAt(masterPlayer.position.offset(0, masterPlayer.height, 0));
            else bot.chat('I cannot see you nearby, minak!');
        }
    });

    // Handles Auth Server Registration
    bot.on('message', (jsonMsg) => {
        const message = jsonMsg.toString();
        if (message.includes('/register')) {
            bot.chat(`/register ${botPassword} ${botPassword}`);
            useHotbarItem(); 
        } 
        else if (message.includes('/login')) {
            bot.chat(`/login ${botPassword}`);
            useHotbarItem(); 
        }
    });

    // 20-Second Auto-Reconnect Delay
    bot.on('end', (reason) => {
        console.log(`jhon88 disconnected: ${reason}. Reconnecting in 20 seconds...`);
        setTimeout(() => createBot(), 20000); 
    });

    bot.on('error', (err) => {
        console.log(`Minecraft Bot Error: ${err.message}.`);
    });
}

createBot();
