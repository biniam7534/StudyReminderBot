const axios = require('axios');

const localQuotes = [
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Future depends on what you do today. - Mahatma Gandhi",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King"
];

module.exports = (bot) => {
    const motivateHandler = async (ctx) => {
        try {
            const response = await axios.get('https://zenquotes.io/api/random');
            const quote = response.data[0].q;
            const author = response.data[0].a;
            ctx.reply(`✨ *Motivational Quote*\n\n"${quote}"\n\n- _${author}_`, { parse_mode: 'Markdown' });
        } catch (error) {
            const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
            ctx.reply(`✨ *Motivational Quote*\n\n"${randomQuote}"`, { parse_mode: 'Markdown' });
        }
    };

    bot.command('motivate', motivateHandler);
    bot.hears('💡 Motivation', motivateHandler);
};
