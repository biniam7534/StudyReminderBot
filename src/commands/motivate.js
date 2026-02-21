const quotes = [
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "It always seems impossible until it's done. - Nelson Mandela",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't let what you cannot do interfere with what you can do. - John Wooden",
    "Expert in anything was once a beginner. - Helen Hayes",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Your education is a dress rehearsal for a life that is yours to lead. - Nora Ephron",
    "Future depends on what you do today. - Mahatma Gandhi",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King"
];

module.exports = (bot) => {
    bot.command('motivate', (ctx) => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        ctx.reply(`✨ *Motivational Quote*\n\n"${randomQuote}"`, { parse_mode: 'Markdown' });
    });
};
