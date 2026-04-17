# Shopee Coupon Bot

Automação para aplicar cupons na Shopee assim que são postados em um grupo do Telegram. O bot monitora o grupo em tempo real e, ao detectar uma mensagem contendo apenas uma palavra (o cupom), aciona o Puppeteer para preencher e submeter o cupom na página de checkout automaticamente.

## Como funciona

1. O bot se conecta a uma conta do Telegram via MTProto (biblioteca `telegram`) e fica escutando mensagens de um grupo específico.
2. Ao receber uma mensagem de **uma única palavra**, ela é tratada como um cupom.
3. O Puppeteer se conecta a uma instância do Google Chrome já aberta com remote debugging e localiza a aba do checkout da Shopee.
4. O cupom é preenchido, aplicado e, se válido, o pedido é finalizado automaticamente.

A lógica de aceitar apenas mensagens de uma palavra é intencional: grupos de promoções no Telegram costumam postar somente o código do cupom, sem texto adicional.

## Pré-requisitos

- Node.js 18+
- Google Chrome instalado
- Conta do Telegram com acesso à API (API ID e API Hash obtidos em [my.telegram.org](https://my.telegram.org))
- Conta da Shopee já logada no perfil do Chrome utilizado

## Configuração do Chrome

É necessário abrir o Chrome com um perfil dedicado e com a porta de remote debugging habilitada. Exemplo no Windows:

```
chrome.exe --user-data-dir="C:\GoogleChromeDefaultProfile" --remote-debugging-port=9223
```

Antes de rodar o bot, deixe o Chrome nesse estado:
- Logado na Shopee
- Com a página de checkout aberta (`shopee.com.br/checkout`)
- Forma de pagamento já selecionada
- Modal de seleção de cupom aberta

Isso garante que o bot consiga agir o mais rápido possível ao receber o cupom.

## Instalação

```bash
git clone https://github.com/GabrielMeruzzi/shopee-telegram-automation.git
cd shopee-telegram-automation
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
API_ID=seu_api_id
API_HASH=seu_api_hash
STRING_SESSION=sua_string_session
```

A `STRING_SESSION` é gerada na primeira execução do bot: ele pedirá seu número de telefone, senha (se houver) e o código de verificação recebido pelo Telegram. Após autenticar, copie a string exibida e coloque nessa variável para não precisar autenticar novamente.

## Uso

```bash
node index.js
```

Na primeira execução, siga o prompt para autenticar no Telegram. Nas execuções seguintes, a sessão é reutilizada via `STRING_SESSION`.

## Dependências

| Pacote | Descrição |
|---|---|
| `telegram` | Cliente MTProto para conectar e monitorar mensagens do Telegram |
| `dotenv` | Carrega variáveis de ambiente do arquivo `.env` |
| `input` | Leitura de input no terminal (usado na autenticação inicial) |
| `puppeteer-extra` | Wrapper do Puppeteer com suporte a plugins |
| `puppeteer-extra-plugin-stealth` | Plugin que ofusca sinais de automação para evitar detecção por sites |

## Estrutura do projeto

```
.
├── index.js           # Ponto de entrada: conexão com o Telegram e listener de mensagens
├── web_automation.js  # Lógica de automação do checkout com Puppeteer
├── package.json
└── .env               # Variáveis de ambiente (não versionar)
```

## Observações

- O `CHAT_ID` do grupo monitorado está definido diretamente em `index.js` e deve ser ajustado para o ID do grupo desejado.
- A porta de remote debugging (`9223`) também está configurada em `index.js` e deve corresponder à porta usada ao iniciar o Chrome.
