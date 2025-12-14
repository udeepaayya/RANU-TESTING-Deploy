const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');

// Fake ChatGPT vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=94762095304:+94762095304
END:VCARD`
        }
    }
};

// ALIVE COMMAND
cmd({
    pattern: "alive2",
    alias: ["hyranu2", "ranu2", "status2", "a2"],
    react: "🌝",
    desc: "Check bot online or no. Reply 1 to alive message to get ping.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, sender, reply }) => {
    try {
        await robin.sendPresenceUpdate('recording', from);

        // Voice Note
        await robin.sendMessage(from, {
            audio: {
                url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/Ranumitha-x-md-Alive-org.opus"
            },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: fakevCard });

        // Stylish Alive Caption with numbered menu
        const status = `
╭─〔 💠 ALIVE STATUS 💠 〕─◉
│
│🐼 *Bot*: 𝐑𝐀𝐍𝐔𝐌𝐈𝐓𝐇𝐀-𝐗-𝐌𝐃
│🤵‍♂ *Owner*: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴ𝐴
│⏰ *Uptime*: ${runtime(process.uptime())}
│⏳ *Ram*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│🖊 *Prefix*: [ ${config.PREFIX} ]
│🛠 *Mode*: [ ${config.MODE} ]
│🖥 *Host*: ${os.hostname()}
│🌀 *Version*: ${config.BOT_VERSION}
╰─────────────────────────────⊷
     
      1. ʙᴏᴛ ᴍᴇɴᴜ  
      2. ʙᴏᴛ ꜱᴘᴇᴇᴅ 
> 𝐌𝐚𝐝𝐞 𝐛𝐲 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝐀 🥶`;

        // Send Image + Caption and store message ID
        let aliveMsg = await robin.sendMessage(from, {
            image: {
                url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/GridArt_20250726_193256660.jpg"
            },
            caption: status,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: false,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: '',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Store alive message ID in memory
        if (!global.aliveMessages) global.aliveMessages = [];
        global.aliveMessages.push(aliveMsg.key.id);

    } catch (e) {
        console.log("Alive Error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});

// LISTENER FOR REPLY WITH NUMBER 1
cmd({
    pattern: ".*",
    fromMe: false,
    desc: "Reply with 1 to alive message to check ping",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, sender, quoted, reply }) => {
    try {
        // Only proceed if message is a reply
        if (!quoted || !quoted.key) return;

        // Check if replied message is an alive message
        if (global.aliveMessages && global.aliveMessages.includes(quoted.key.id)) {
            // Only trigger if user replied with "1"
            if (m.text && m.text.trim() === "1") {
                const startTime = Date.now();
                const emojis = ['💀', '⚡'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

                // React
                await robin.sendMessage(from, {
                    react: { text: randomEmoji, key: mek.key }
                });

                // Send initial ping message
                let sentMsg = await robin.sendMessage(from, { text: "Pinging..." }, { quoted: mek });

                // Calculate ping
                const ping = Date.now() - startTime;

                // Edit same message with ping result
                const newText = `*Ping: _${ping}ms_ ${randomEmoji}*`;
                await robin.sendMessage(from, {
                    edit: sentMsg.key,
                    text: newText,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: false,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '',
                            newsletterName: "",
                            serverMessageId: 143
                        }
                    }
                });
            }
        }
    } catch (e) {
        console.error("Ping reply error:", e);
    }
});
