document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    
    // Replace with your actual Gemini API key
    const API_KEY = 'AIzaSyAzjc0OF_OlK2IG0OYtL0-J15EPaknyGIc';
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Process markdown-like syntax for code
        let processedContent = content;
        
        // Handle code blocks with ```
        processedContent = processedContent.replace(/```([\s\S]*?)```/g, function(match, code) {
            return `<pre>${code.trim()}</pre>`;
        });
        
        // Handle inline code with `
        processedContent = processedContent.replace(/`([^`]+)`/g, function(match, code) {
            return `<code>${code}</code>`;
        });
        
        messageContent.innerHTML = processedContent;
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingContent.appendChild(dot);
        }
        
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to get response from Gemini API
    async function getGeminiResponse(prompt) {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAzjc0OF_OlK2IG0OYtL0-J15EPaknyGIc';

        try {
            const response = await fetch(`${url}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful assistant that specializes in Git and GitHub. 
                            Provide accurate, concise answers about Git commands, GitHub features, 
                            workflows, best practices, and troubleshooting. 
                            Format code examples with proper markdown.
                            
                            User question: ${prompt}`
                        }]
                    }]
                })
            });
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                console.error('API Error:', data.error);
                return 'Sorry, I encountered an error. Please check your API key or try again later.';
            } else {
                return 'I couldn\'t generate a response. Please try asking in a different way.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, there was an error connecting to the service. Please check your internet connection and try again.';
        }
    }
    
    // Function to handle sending a message
    async function sendMessage() {
        const message = userInput.value.trim();
        
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input field
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get response from Gemini
        const response = await getGeminiResponse(message);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response to chat
        addMessage(response);
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Focus input field on load
    userInput.focus();
});