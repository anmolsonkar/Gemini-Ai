const express = require('express');
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routes = require('./routes/routers');
const { History, saveMessage } = require('./models/chat.js');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',

    }
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const URI = process.env.MONGODB_URI;

(async () => {
    try {
        await mongoose.connect(URI);
    } catch (error) {
        console.log(error);
    }
})();

const history = [];
const MAX_CONVERSATION_HISTORY_SIZE = 50;

if (history.length > MAX_CONVERSATION_HISTORY_SIZE) {
    history.shift();
}

(async () => {
    const messages = await History.find();
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].user === 'User') {
            history.push({
                role: 'user',
                parts: messages[i].message
            });
        } else {
            history.push({
                role: 'model',
                parts: messages[i].message
            });
        }
    }
})();

io.on('connection', async (socket) => {
    try {
        const oldConversation = await History.find();
        socket.emit('conversation', oldConversation);
    } catch (error) {
        console.error(error);
    }

    socket.on('send', async (msg) => {
        try {
            const generationConfig = {
                "temperature": 0.9,
                "top_p": 1,
                "top_k": 1,
                "max_output_tokens": 2048,
            };

            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ];

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const chat = model.startChat({
                generationConfig,
                safetySettings,
                history: history,
            });

            await saveMessage('User', msg);
            const head = await History.find();
            socket.emit('conversation', head);
            socket.emit('loading', true);

            const result = await chat.sendMessageStream(msg);

            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                socket.emit('live', text);
                socket.emit('loading', false);
                text += chunkText;
            }

            await saveMessage('Ai', text);
            const updatedConversation = await History.find();
            socket.emit('finalconversation', updatedConversation);
        } catch (error) {
            console.error(error);
            await saveMessage('Ai', error.message);
            const updatedConversation = await History.find();
            socket.emit('finalconversation', updatedConversation);
        }
    });
});


app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", routes);

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
