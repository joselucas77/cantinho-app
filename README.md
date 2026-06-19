# 🦐 Cantinho App — Comandas Digitais (Frontend)

O projeto Cantinho é um app de comandas para garçons um restaurante. O objetivo é substituir as anotações em bloquinho de papel por um aplicativo onde o garçom usa no celular para abrir uma comanda por mesa, adicionar itens do cardápio, e fechar a conta com o total calculado.

Este repositório contém exclusivamente o código do aplicativo mobile desenvolvido em **React Native com Expo**.

## 👥 Equipe e Responsabilidades (Frontend)

A divisão abaixo foca nas entregas visuais e de interação dentro do aplicativo:

- **Lucas:** Desenvolvimento da tela de listagem de mesas e integração inicial da navegação (`react-navigation`).
- **Roberta (QA & Revisão):** Responsável por testar o app em dispositivo físico via _Expo Go_, focar na validação da usabilidade e aprovar todos os Pull Requests de interface.
- **Bruno S.:** Criação da tela principal da comanda (interface de adicionar/remover itens e enviar observações).
- **Cauan:** Criação da interface de fechamento da conta, exibição do resumo do pedido e tratamento visual de _Loading_ e _Erros_.
- **Bruno C.:** Desenvolvimento da tela de listagem do cardápio e integração do feedback tátil (`expo-haptics`) nas interações críticas do app.

## 📁 Estrutura de Pastas

```text
cantinho-app/
├── src/
│   ├── components/    # Componentes reutilizáveis (Botões, Cards, Inputs)
│   ├── screens/       # Telas do aplicativo (Mesas, Cardapio, Comanda)
│   ├── routes/        # Configuração do React Navigation
│   ├── services/      # Comunicação com a API (Axios/Fetch)
│   ├── store/         # Gerenciamento de estado global (Zustand/Context)
│   └── utils/         # Funções auxiliares e constantes de formatação
├── App.js             # Ponto de entrada do Expo
└── package.json
```

## 🚀 Comandos Iniciais (Setup)

Siga os passos abaixo para rodar o projeto localmente na sua máquina:

1. **Clone o repositório:**

```bash
git clone https://github.com/joselucas77/cantinho-app
```

2.  **Acesse a pasta do projeto e instale as dependências:**

```bash
    cd cantinho-app
    npm install
```

3.  **Inicie o servidor de desenvolvimento do Expo:**

```bash
    npx expo start
```

4.  **Para testar no celular:**
    Baixe o aplicativo **Expo Go** no seu smartphone Android, certifique-se de estar na mesma rede Wi-Fi do computador e escaneie o QR Code gerado no terminal.

## 📝 Convenção de Commits (Conventional Commits)

Para mantermos o histórico do GitHub organizado, rastreável e facilitar o processo de aprovação de Pull Requests, é **obrigatório** que todo commit siga o padrão estruturado: `<tipo>: <descrição em minúsculas>`.

- **`feat:`** Para o desenvolvimento de novas funcionalidades.
  - _Exemplo:_ `feat: adiciona tela de listagem de mesas`
- **`fix:`** Para a correção de bugs ou falhas visuais.
  - _Exemplo:_ `fix: corrige crash do app ao apertar o botão de haptics rapidamente`
- **`chore:`** Para manutenção, ajustes de ferramentas ou instalação de pacotes que não alteram o código de produção.
  - _Exemplo:_ `chore: instala pacote do react-navigation`
- **`docs:`** Para alterações exclusivas no arquivo README ou comentários de documentação no código.
  - _Exemplo:_ `docs: atualiza lista de responsabilidades no readme`
- **`style:`** Para mudanças exclusivas de estilização e CSS que não afetam a lógica.
  - _Exemplo:_ `style: ajusta o padding do card de produtos`
- **`BREAKING CHANGE:`** Deve ser adicionado no corpo da mensagem do commit (após a descrição) caso a alteração quebre alguma funcionalidade existente ou mude drasticamente o uso de um componente.
