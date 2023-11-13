console.log('Calling chat.js');

const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    let chatBox = document.getElementById("chatBox");
    const sessionUserElement = document.getElementById("sessionUser");
    const user = sessionUserElement.getAttribute("data-username");
    socket.emit("client:userLogged", user);
        socket.on("server:userLogged", (user) => {
            Swal.fire({
                text: `${user} se ha conectado`,
                toast: true,
                position: "bottom-right",
                timer: 5000,
                hideClass: {
                    popup: 'animated fadeOutUp faster',
                  }
            })
        });

        socket.on("server:messageLogs", data => {
            let log = document.getElementById("messageLogs");
            let messages = "";
            data.forEach(message => {
                messages = messages + `${message.user} dice: ${message.message}</br>`
            });
            log.innerHTML = messages;
        });
    // })

    chatBox.addEventListener("keyup", evt => {
        if(evt.key === "Enter") {
            if(chatBox.value.trim().length > 0) {
                socket.emit("client:message", {user:user, message:chatBox.value});
                chatBox.value = "";
            };
        };
    });
});