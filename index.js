const mineflayer = require('mineflayer');

const botOptions = {
    host: 'pookiesmp.in', 
    port: 25565,
    username: 'jhony68',   
    version: '1.21.1' 
};

function startBot() {
    console.log(`[${new Date().toLocaleTimeString()}] Connecting to pookiesmp.in...`);
    const bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log('Successfully spawned into lobby!');
        
        setTimeout(() => {
            console.log('Sending authentication credentials...');
            bot.chat('/register jhon883355 jhon883355');
            bot.chat('/login jhon883355');
        }, 2000);
    });

    bot.on('kicked', (reason) => {
        try {
            const cleanReason = JSON.parse(reason).text || reason;
            console.log(`Kicked/Gated by proxy: "${cleanReason}"`);
        } catch (e) {
            console.log(`Kicked/Gated by proxy: "${reason}"`);
        }
    });

    // Mandatory Kick-and-Rejoin AntiBot Bypass Logic
    bot.on('end', () => {
        const retryDelay = 3500; 
        console.log(`Connection dropped. Rejoining in ${retryDelay / 1000} seconds to clear verification token...`);
        setTimeout(() => {
            startBot(); 
        }, retryDelay);
    });

    bot.on('error', (err) => {
        console.error('System error:', err.message);
    });
}

startBot();
