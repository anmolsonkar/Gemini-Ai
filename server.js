const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.set("view engine", "ejs");
app.use(express.static("public"));

io.on('connection', (socket) => {
    socket.on('send', async (msg) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: "Hi",
                    },
                    {
                        role: "model",
                        parts: "Hello, how can i help you?",
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 2048,
                },
            });

            socket.emit('getheader', msg);
            const result = await chat.sendMessageStream(msg);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
            }
            socket.emit("receive", text);
        } catch (error) {
            socket.emit("receive", error.message);
        }
    });
});

app.get('/', (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});