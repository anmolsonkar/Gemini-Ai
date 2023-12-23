const socket = io("http://localhost:3000/");

const input = document.getElementById("input");
const button = document.getElementById("send");
const menu = document.getElementById("menu");
const sidebar = document.querySelector(".sidebar");


button.disabled = true;

menu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});


function updateInputstatus() {
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
        input.value = ""
        updateInputstatus()
    }
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
        updateInputstatus();
    }
});

input.addEventListener("input", () => {
    updateInputstatus();
});

updateInputstatus();

const main = document.querySelector("main")

socket.on("getheader", (msg) => {

    const div = document.createElement('div');
    div.className = 'box1';
    div.innerHTML = `
      <img src="img/profile.jpg" alt="profile">
      <section id="msgheader">${msg}</section>
    `;
    main.appendChild(div);
    main.scrollTop = main.scrollHeight;
});

socket.on("receive", (htmlData) => {
    const div = document.createElement('div');
    div.className = 'box2';
    div.innerHTML = `
    <img id="shine" src="img/shine.gif" alt="gemini">
    <div id="show">${marked.parse(htmlData)}</div>
    `;
    main.appendChild(div);
    main.scrollTop = main.scrollHeight;

});