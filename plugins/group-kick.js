const { cmd } = require('../command');
const { getGroupAdmins } = require('../lib/functions');

cmd({
    pattern: 'kick',
    react: '🙃',
    desc: 'Removes a user by replying to their message & reacts',
    fromMe: true,
    type: 'group'
}, async (message, match) => {
    try {
        if (!message.isGroup) return await message.send('⚠️ This command only works in groups.');

        const botNumber = message.conn.user.jid.split(':')[0] + '@s.whatsapp.net';
        const groupAdmins = await getGroupAdmins(message.chat);

        if (!groupAdmins.includes(botNumber)) {
            return await message.send('⚠️ I need to be an admin to kick users.');
        }

        if (!message.quoted) {
            return await message.send('⚠️ Please reply to the user\'s message you want to kick.');
        }

        const userToKick = message.quoted.sender;

        if (groupAdmins.includes(userToKick)) {
            return await message.send('⚠️ Cannot kick an admin!');
        }

        // Remove user
        await message.groupRemove([userToKick]);

        // React to the original message
        await message.conn.sendMessage(message.chat, {
            react: {
                text: '✅', // Emoji reaction
                key: message.quoted.key
            }
        });

        await message.send('✅ User has been removed from the group and reaction added.');
    } catch (error) {
        console.log(error);
        await message.send('❌ Failed to kick the user.');
    }
});
