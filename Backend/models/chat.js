const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: { type: String, index: true },
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const History = mongoose.model('History', chatSchema);

const saveMessage = async (user, message) => {
    const history = new History({ user, message, timestamp: new Date() });
    try {
        await history.save();
    } catch (err) {
        console.error(err);
    }
};

module.exports = { History, saveMessage };
