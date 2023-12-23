const socket = io("http://localhost:3000/");

const input = document.getElementById("input");
const button = document.getElementById("send");
const menu = document.getElementById("menu");
const sidebar = document.querySelector(".sidebar");

button.disabled = true;

menu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

function updateInputStatus() {
    if (input.value.trim() !== "") {
        button.disabled = false;
        button.style.backgroundColor = "green";
    } else {
        button.disabled = true;
        button.style.backgroundColor = "grey";
    }
}

button.addEventListener("click", sendMessage);

function sendMessage() {
    const inputValue = input.value.trim();
    if (inputValue !== "") {
        socket.emit('send', inputValue);
        input.value = "";
        updateInputStatus();
    }
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
        updateInputStatus();
    }
});

input.addEventListener("input", () => {
    updateInputStatus();
});

updateInputStatus();

const main = document.querySelector("main");

socket.on("getheader", (history) => {

    displayMessages(history);
});

socket.on("receive", (data) => {
    displayMessages(data.conversation);

});

function displayMessages(messages) {
    main.innerHTML = '';
    messages.forEach((item) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = item.user === 'User' ? 'box1' : 'box2';

        if (item.user === 'User') {
            messageDiv.innerHTML = `
                <img src="img/profile.jpg" alt="profile">
                <section id="msgheader">${item.message}</section>
            `;
        }

        if (item.user === 'Ai') {
            messageDiv.innerHTML = `
                <img id="shine" src="img/shine.gif" alt="gemini">
                <div id="show">${marked.parse(item.message)}</div>
            `;
        }

        main.appendChild(messageDiv);
    });

    main.scrollTop = main.scrollHeight;
}
