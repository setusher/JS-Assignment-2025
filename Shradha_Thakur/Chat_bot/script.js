function parseMarkdown(markdown) {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h1>$1</h1>')
    .replace(/^### (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/\n/g, '<br>');

}

const form = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const apiKey = document.getElementById('api-key');
const modelSelect = document.getElementById('model-select');
let messages = [];
let chatSessions = JSON.parse(localStorage.getItem('chatSessions')) || [];

const toggleHistoryBtn = document.getElementById('toggle-history');
const sidebar = document.getElementById('sidebar');
const historyList = document.getElementById('history-list');
 


function enterMessage(content, sender) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'user-msg' : 'bot-msg';
  chatBox.appendChild(msg);
  msg.innerHTML = parseMarkdown(content);
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
          botDiv.innerHTML = parseMarkdown(result);
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


toggleHistoryBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  loadHistoryList();
});

window.addEventListener('beforeunload', () => {
  if (messages.length > 0) {
    chatSessions.push([...messages]); 
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }
});

function loadHistoryList() {
  historyList.innerHTML = '';
  const sessions = JSON.parse(localStorage.getItem('chatSessions')) || [];

  sessions.forEach((session, idx) => {
    const li = document.createElement('li');
    li.textContent = `Chat #${idx + 1} `;
    li.addEventListener('click', () => {
      chatBox.innerHTML = '';
      session.forEach(msg => enterMessage(msg.content, msg.role));
    });
    historyList.appendChild(li);
  });
}

  saved.forEach((msg, index) => {
    if (msg.role === 'user') {
      const li = document.createElement('li');
      li.textContent = msg.content;
      li.addEventListener('click', () => {
        alert(`Message at index ${index}: ${msg.content}`);
      });
      historyList.appendChild(li);
    }
  });


