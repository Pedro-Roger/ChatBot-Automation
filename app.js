require('dotenv').config();
const axios = require('axios');
const venom = require('venom-bot');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${OPENAI_API_KEY}`
};

const start = (client) => {
    client.onMessage(async (message) => {
        try {
            console.log("Recebida mensagem:", message.body);

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    "model": "gpt-3.5-turbo" , 
                    "messages": [{ "role": "user", "content": message.body }]
                },
                { headers: header }
            );

            const reply = response.data.choices[0]?.message?.content || "Erro ao obter resposta.";

            await client.sendText(message.from, reply);
            console.log("Resposta enviada:", reply);

        } catch (error) {
            console.error("Erro ao processar mensagem:", error.response?.data || error.message);
            await client.sendText(message.from, "Ocorreu um erro ao processar sua mensagem.");
        }
    });
};

venom.create({
    session: 'chatGPT_BOT',
    multidevice: true,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new']
})
    .then(client => start(client))
    .catch(err => console.log("Erro ao iniciar bot:", err));
