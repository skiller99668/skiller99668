// Chatbot mockup
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Function to append messages
function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // scroll to bottom
}

// Mock chatbot response
function getChatbotResponse(userMessage) {
    // For now, just echo the message
    return "Chatbot says: " + userMessage;
}

sendBtn.addEventListener('click', () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    chatInput.value = '';

    const botReply = getChatbotResponse(userMessage);
    setTimeout(() => appendMessage('bot', botReply), 500); // simulate delay
});

// Optional: allow Enter key to send
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});
