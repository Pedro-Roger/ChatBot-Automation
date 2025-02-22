const { default: axios } = require('axios');
const venom = require('venom-bot');

const header = {
    
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
}
const start = (client) => {
    client.onMessage((message) => {

        axios.post('https://api.openai.com/v1/chat/completions'), {
            "model": "gpt-4o",
            "messages": [ {"role": "user", "content": message.body} ],
        }
        
        
    },{
        headers: header
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });
};

venom.create(
    {
        session: 'chatGPT_BOT',
        multidevice: true,
        browserArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--headless=new'
        ]
    }
)
    .then((client) => start(client))
    .catch((err) => console.log(err));

