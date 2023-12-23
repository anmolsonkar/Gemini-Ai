const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require('dotenv').config();


const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const mongoose = require('mongoose');

app.set("view engine", "ejs");
app.use(express.static("public"));


(async () => {
    try {
        const result = await mongoose.connect("mongodb+srv://anmolsonkar:Anmolmongo2023@anmoldb.ta9zg8t.mongodb.net/Gemini-Ai");
        console.log("Connected")
    } catch (error) {
        console.log(error)

    }
})();

const chatSchema = new mongoose.Schema({
    user: { type: String, index: true },
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const History = mongoose.model('History', chatSchema);

async function saveMessage(user, message) {
    const history = new History({ user, message, timestamp: new Date() });
    try {
        await history.save();
    } catch (err) {
        console.error(err);
    }
}

io.on('connection', async (socket) => {

    try {
        const oldConversation = await History.find();
        socket.emit('getheader', oldConversation);
    } catch (error) {
        console.error(error);
    }

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
                        parts: "Hello, how can I help you?",
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 2048,
                },
            });

            await saveMessage('User', msg);
            const head = await History.find();
            socket.emit('getheader', head);

            const result = await chat.sendMessageStream(msg);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
            }

            await saveMessage('Ai', text);
            const updatedConversation = await History.find();
            socket.emit('receive', { conversation: updatedConversation });

        } catch (error) {
            console.error(error);
            socket.emit("receive", error.message);
        }
    });
});


app.get('/', async (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});