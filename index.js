import 'dotenv/config'
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/index.js";
import input from "input";
import { WebAutomation } from "./web_automation.js";

const API_ID = parseInt(process.env.API_ID);
const API_HASH = process.env.API_HASH; 
const STRING_SESSION = process.env.STRING_SESSION;
const CHAT_ID = -1002821211121n;
const BROWSER_PORT = "9223";

const client = new TelegramClient(
  new StringSession(STRING_SESSION),
  API_ID,
  API_HASH,
  { connectionRetries: 5 }
);

(async () => {
  await client.start({
    phoneNumber: async () => await input.text("Digite seu número: "),
    password: async () => await input.text("Digite sua senha (se houver): "),
    phoneCode: async () => await input.text("Código recebido: "),
    onError: (err) => console.log(err),
  });
  console.log("Conectado com sucesso!");

  client.addEventHandler(async (event) => {
    const message = event.message.message;
    if (!message) return;
    if (isOneWordMessage(message)) {
      console.log(`\nMensagem recebida: ${message}`);
      console.log(new Date().toLocaleString())
      WebAutomation(message, BROWSER_PORT);
    }
  }, new NewMessage({ chats: [CHAT_ID] }));

  function isOneWordMessage(message) {
    try {
      const msgSplit = message.trim().split(" ");
      return msgSplit.length === 1;
    } catch (e) {
      console.error("Erro ao verificar mensagem", e);
    }
  }

  console.log("Monitorando mensagens...");
})();
