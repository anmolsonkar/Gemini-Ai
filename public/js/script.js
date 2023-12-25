const socket = io("http://localhost:3000/");

const input = document.getElementById("input");
const button = document.getElementById("send");
const menu = document.getElementById("menu");
const sidebar = document.querySelector(".sidebar");
const loadingElement = document.querySelector('#loading');

button.disabled = true;

menu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});


document.addEventListener('DOMContentLoaded', function () {

    const toggleButton = document.getElementById('settings');
    toggleButton.addEventListener('click', toggleDarkMode);

    function toggleDarkMode() {
        const body = document.body;
        const aside = document.querySelector("aside");
        const main = document.querySelector("main");
        const header = document.querySelector("header");
        const menu = document.querySelector("#menu");

        body.classList.toggle('dark-mode');
        aside.classList.toggle('dark-mode');
        main.classList.toggle('dark-mode');
        header.classList.toggle('dark-mode');


        menu.src = "img/menu-light.png"

        const isDarkMode = body.classList.contains('dark-mode');

        localStorage.setItem('darkMode', isDarkMode);
    }

    const isDarkModeStored = localStorage.getItem('darkMode');

    if (isDarkModeStored === 'true') {
        toggleDarkMode();
    }


    function autoExpand() {
        const element = document.getElementById('input');
        element.style.height = 'auto';
        element.style.height = (element.scrollHeight) + 'px';
    }

    input.addEventListener('input', autoExpand);


});



function updateInputStatus() {
    if (input.value.trim() !== "") {
        button.disabled = false;
        button.style.backgroundColor = "green";
    } else {
        button.disabled = true;
        button.style.backgroundColor = "grey";
        button.style.border = "1px solid grey";

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
    if (e.key === "Enter" && !e.shiftKey) {
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
        const isUser = item.user === 'User';
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'box1' : 'box2';

        const imgSrc = isUser ? 'img/profile.jpg' : 'img/shine.gif';
        const altText = isUser ? 'profile' : 'gemini';

        const messageContent = isUser
            ? `<img src="${imgSrc}" alt="${altText}">
               <div><pre>${item.message}</pre></div>`
            : `<img src="${imgSrc}" alt="${altText}">
               <div id="show">${marked.parse(item.message)}</div>`;

        messageDiv.innerHTML = messageContent;
        main.appendChild(messageDiv);

    });
    main.scrollTop = main.scrollHeight;
}



socket.on('loading', (isLoading) => {
    loadingElement.classList.toggle('loading', isLoading);
    if (isLoading) {
        input.style.height = "auto"
        input.setAttribute('placeholder', 'Generating...');
        input.disabled = true;
    }
    else {
        input.setAttribute('placeholder', 'Ask me anything...');
        input.disabled = false;
        input.focus();
    }
});




