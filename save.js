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
    user: String,
    message: String,
    timestamp: Date
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

    let userOld = await History.find({
        user: 'User'
    });

    let aiOld = await History.find({
        user: 'Ai'
    });

  
    socket.emit('getheader', userOld);
    socket.emit('receive', aiOld);

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
                    maxOutputTokens: 100,
                },
            });

            await saveMessage('User', msg);

            let updatedUser = await History.find({
                user: 'User'
            });

            let latestUser = updatedUser.filter(a => !userOld.find(b => b.id === a.id));

            socket.emit('getheader', latestUser);

            userOld = updatedUser;


            const result = await chat.sendMessageStream(msg);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
            }

            await saveMessage('Ai', text);

            let updatedAi = await History.find({
                user: 'Ai'
            });

            let latestAi = updatedAi.filter(a => !aiOld.find(b => b.id === a.id));

            socket.emit('receive', latestAi);

            aiOld = updatedAi;


        } catch (error) {
            console.log(error)
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