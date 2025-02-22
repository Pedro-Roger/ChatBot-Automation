require('dotenv').config();
const axios = require('axios');
const venom = require('venom-bot');
const banco = require('./src/banco.js');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("Erro: Chave da API do Gemini não encontrada. Defina a variável GEMINI_API_KEY no .env.");
    process.exit(1);
}

const start = (client) => {
    client.onMessage(async (message) => {

        const userCadastrado = banco.db.find(numero => numero.numero === message.from);

        if (!userCadastrado) {
            console.log("cadastrando usuário:");
            banco.db.push({ num: message.from, historico: [] });


        }
        else {
            console.log("Usuário já cadastrado:");
        }

        console.log(banco.db)

        try {
            console.log("Recebida mensagem:", message.body);

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: message.body }] }]
                }
            );

            const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao obter resposta.";

            await client.sendText(message.from, reply);
            console.log("Resposta enviada:", reply);

        } catch (error) {
            console.error("Erro ao processar mensagem:", error.response?.data || error.message);
            await client.sendText(message.from, "Ocorreu um erro ao processar sua mensagem.");
        }
    });
};

venom.create({
    session: 'chat_BOT',
    multidevice: true,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new']
})
    .then(client => start(client))
    .catch(err => console.log("Erro ao iniciar bot:", err));
