const mineflayer = require('mineflayer');
const axios = require('axios');

// Minecraft bot settings
const minecraftHost = 'your_minecraft_server_ip';
const minecraftPort = 25565;
const minecraftUsername = 'your_bot_username';
const minecraftVersion = '1.16.4';

// ChatGPT API settings
const chatGPTAPIKey = 'your_openai_api_key';

// Create Minecraft bot instance
const bot = mineflayer.createBot({
  host: minecraftHost,
  port: minecraftPort,
  username: minecraftUsername,
  version: minecraftVersion
});

// Add event listeners for Minecraft bot
bot.on('login', () => {
  console.log('Bot has logged in to the Minecraft server!');
});

bot.on('message', async message => {
  if (message.username === bot.username) return;

  // Check if message is a request
  if (message.message.startsWith('/request ')) {
    const request = message.message.substring(8);

    // Send request to ChatGPT API
    const response = await axios.post(`https://api.openai.com/v1/chat/completions`, {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: request }],
      temperature: 0.5,
      max_tokens: 256
    }, {
      headers: {
        'Authorization': `Bearer ${chatGPTAPIKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Get response from ChatGPT API
    const chatGPTResponse = response.data.choices[0].message.content;

    // Execute response in Minecraft server
    try {
      // Try to execute the response as a command
      bot.chat(`/execute ${chatGPTResponse}`);
    } catch (error) {
      // If the response is not a valid command, try to execute it as a action
      bot.chat(chatGPTResponse);
    }
  }
});
