const form = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const apiKey = document.getElementById('api-key');
const modelSelect = document.getElementById('model-select');

let messages = [];

function enterMessage(content, sender) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'user-msg' : 'bot-msg';
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function streaming(model, apikey, messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apikey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';
  const botDiv = document.createElement('div');
  botDiv.className = 'bot-msg';
  chatBox.appendChild(botDiv);

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data:')) {
        try {
          const json = JSON.parse(line.slice(5));
          const token = json.choices[0]?.delta?.content || '';
          result += token;
          botDiv.textContent = result;
          chatBox.scrollTop = chatBox.scrollHeight;
        } catch (e) {
          console.warn('Invalid chunk:', line);
        }
      }
    }
  }

  messages.push({ role: 'assistant', content: result });
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value;
  const key = apiKey.value;
  const model = modelSelect.value;

  messages.push({ role: 'user', content: text });
  enterMessage(text, 'user');
  userInput.value = '';

  await streaming(model, key, messages);
});
