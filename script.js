document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const chatbox = document.querySelector(".chatbox");
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    let userMessage;
    const API_KEY = "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";

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        const chatParagraph = document.createElement("p");
        let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
        chatLi.innerHTML += chatContent;
        
        return chatLi;
    }

    //à remplacer par l'API de ton choix 
    const generateResponse = (incomingChatLi) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const messageElement = incomingChatLi.querySelector("p");
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${API_KEY}` 
            },
            body: JSON.stringify({
                model:"gpt-3.5-turbo",
                messages:[{"role": "user", "content": userMessage}],
            })
        }

        fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.textContent = "Veuillez vérifier votre connexion Internet ou bien de reformuler votre requete";
        }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    
    
    }

    //generateur automatique de bulle d'attente "veuillez patienter"
    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;
        chatInput.value = "";

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout (() => {
            const incomingChatLi = createChatLi("Veuillez patienter...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        },600)

        chatInput.value = "";
    }

    chatbotToggler.addEventListener("click", () =>document.body.classList.toggle("show-chatbot"));
    sendChatBtn.addEventListener("click", handleChat);
});
