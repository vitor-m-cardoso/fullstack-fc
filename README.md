# Boas vindas ao repositório do projeto _Fullstack FC_

## Entidades

<details>
<summary><strong>Estrutura do projeto</strong></summary>

- O projeto é composto de 4 entidades:

1️⃣ **Banco de dados:**

- É um container docker MySQL configurado no docker-compose através de um serviço definido como `db`.
  - Tem o papel de fornecer dados para o serviço de _backend_.
  - Também é possível se conectar utilizando um Cliente MySQL (Workbench, Beekeeper, DBeaver e etc), colocando as credenciais configuradas no docker-compose no serviço `db`.

2️⃣ **Back-end:**

- Roda na porta `3001`, pois o front-end faz requisições para ele nessa porta, por padrão;
- A aplicação é inicializada a partir do arquivo `app/backend/src/server.ts`.

3️⃣ **Front-end:**

- O front-end se comunica com serviço de back-end pela url `http://localhost:3001` através dos endpoints que foram construidos no back.

4️⃣ **Docker:**

- O `docker-compose` possui a responsabilidade de unir todos os serviços conteinerizados (backend, frontend e db) e subir o projeto completo com o comando `npm run compose:up`;
- Foram desenvolvidas as configurações de todos os `Dockerfiles`, nas raízes do `front-end` e `back-end`, para conseguir inicializar a aplicação.

</details>

## Orientações

<details>
<summary><strong>Configuração Docker</strong></summary>

- Para executar a aplicação na sua máquina local, é necessário executar o comando `npm run compose:up` na raiz do projeto.

</details>

<details>
<summary><strong>Criptografia de senhas </strong></summary>

- A biblioteca utilizada para criptografar as senhas no banco de dados é a [bcryptjs](https://github.com/dcodeIO/bcrypt.js).

</details>

## Sobre os fluxos

- Esse projeto é composto de 4 fluxos principais:

  1. _Teams_;
  2. _Users_ e _Login_;
  3. _Matches_;
  4. _Leaderboards_.

## Teams

<details>
  <summary><strong>O que foi desenvolvido</strong></summary>

### Em `/app/backend/src/database` nos diretórios correspondentes, foi criado uma migration e model para a tabela de times

### Foram desenvolvidos testes de integração que cobrem a maior parte das classes e métodos da rota /teams

### Endpoint `GET /teams`

- Retorna um status `200` e um `json`, o retorno possui o seguinte formato:

```json
[
  {
    "id": 1,
    "teamName": "Avaí/Kindermann"
  },
  {
    "id": 2,
    "teamName": "Bahia"
  },
  {
    "id": 3,
    "teamName": "Botafogo"
  },
  // ...
]
```

### Endpoint `GET /teams/:id`

- Rota do tipo `GET` que responde com um status `200` e um `json`, o retorno possui o seguinte formato:

```json
{
  "id": 5,
  "teamName": "Cruzeiro"
}
```

</details>

## Users e Login

<details>
  <summary><strong>O que foi desenvolvido</strong></summary>

### Em `/app/backend/src/database` nos diretórios correspondentes, foi criado uma migration e model para a tabela de  usuários

### Foram desenvolvidos testes de integração que cobrem a maior parte das classes e métodos da rota de login

### Endpoint `POST /login`

- Se o login foi feito com sucesso, o resultado retornado do back-end é similar ao exibido abaixo, com um status http `200`:

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc" // token gerado pelo backend com JWT.
  }
  ```

- Caso o login não tenha o campo "email" ou o campo "password", retorna uma mensagem de erro, com um status http `400`:

  ```json
  { "message": "All fields must be filled" }
  ```

- Caso o login tenha o "email" ou "password" **inválidos**, retorna uma mensagem de erro, com um status http `401`:

  ```json
  { "message": "Invalid email or password" }
  ```

- Retorna um erro quando passado email com:
  - formato inválido: `@exemplo.com`, `exemplo@exemplo`, `exemplo@.com`, `exemplo.exemplo.com`;
  - formato válido, mas não cadastrados no banco;
- Retorna um erro quando passado senha com:
  - formato inválido: com um tamanho **menor** do que `6 caracteres`;
  - formato válido, mas não corresponde ao email cadastrado no banco;

### Endpoint `GET /login/role`

- Rota recebe um `header` com o parâmetro `authorization`, no parâmetro ficará armazenado o token gerado no login;
- Na API que não é possível retornar um objeto com o _role_ do usuário, sem um token;
- Caso o token não seja informado, retorna um status `401` com a seguinte mensagem:

  ```json
  { "message": "Token not found" }
  ```

- Na API que não é possível retornar um objeto com o tipo de usuário com um token inválido;
- Caso o token não seja válido, retorna um status `401` com a seguinte mensagem:

  ```json
  { "message": "Token must be a valid token" }
  ```

- Ao realizar uma requisição para a rota `/login/role` com um token válido retornará o tipo de usuário.
- A resposta é um status `200` com um `objeto` contendo a `role` do usuário:

  ```json
  { "role": "admin" }
  ```

</details>

## Matches

<details>
  <summary><strong>O que foi desenvolvido</strong></summary>

### Em `/app/backend/src/database` nos diretórios correspondentes, foi criado uma migration e model para a tabela de partidas

### Foram desenvolvidos testes de integração que cobrem a maior parte das classes e métodos da rota de partidas

### Endpoint `GET /matches`

- Retorna uma lista de partidas;
  - Exemplo de retorno:

  ```json
  [
    {
      "id": 1,
      "homeTeamId": 16,
      "homeTeamGoals": 1,
      "awayTeamId": 8,
      "awayTeamGoals": 1,
      "inProgress": false,
      "homeTeam": {
        "teamName": "São Paulo"
      },
      "awayTeam": {
        "teamName": "Grêmio"
      }
    },
    // ...
    {
      "id": 41,
      "homeTeamId": 16,
      "homeTeamGoals": 2,
      "awayTeamId": 9,
      "awayTeamGoals": 0,
      "inProgress": true,
      "homeTeam": {
        "teamName": "São Paulo"
      },
      "awayTeam": {
        "teamName": "Internacional"
      }
    }
  ]
  ```

### Endpoint `GET /matches?inProgress=boolean`

- Retorna uma lista de partidas filtradas;
- Essa requisição usa `query strings` para definir o parâmetro:
  - Ex.: `/matches?inProgress=true`
  - Exemplo de retorno da requisição:

  ```json
  [
    {
      "id": 41,
      "homeTeamId": 16,
      "homeTeamGoals": 2,
      "awayTeamId": 9,
      "awayTeamGoals": 0,
      "inProgress": true,
      "homeTeam": {
        "teamName": "São Paulo"
      },
      "awayTeam": {
        "teamName": "Internacional"
      }
    },
    {
      "id": 42,
      "homeTeamId": 6,
      "homeTeamGoals": 1,
      "awayTeamId": 1,
      "awayTeamGoals": 0,
      "inProgress": true,
      "homeTeam": {
        "teamName": "Ferroviária"
      },
      "awayTeam": {
        "teamName": "Avaí/Kindermann"
      }
    }
  ]
  ```

### Endpoint `PATCH /matches/:id/finish`

- O `id` é recebido pelo parâmetro da URL;
- Não é possível alterar uma partida sem um token;
- Retorna um status `200` com a seguinte mensagem:

  ```json
  { "message": "Finished" }
  ```

### Endpoint `PATCH /matches/:id`

- O `id` é recebido pelo parâmetro da URL;
- Não é possível alterar uma partida sem um token;
- O corpo da requisição possui o seguinte formato:

  ```json
  {
    "homeTeamGoals": 3,
    "awayTeamGoals": 1
  }
  ```

### Endpoint `POST /matches`

- Retorna a partida inserida no banco de dados;
- Não é possível inserir uma partida sem um token;
- O corpo da requisição possui o seguinte formato:

  ```json
  {
    "homeTeamId": 16,
    "awayTeamId": 8,
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
  }
  ```

- Não é possível inserir uma partida com os valors `homeTeam` e `awayTeam` iguais;
  - Caso os valores estejam iguais, retorna um status `422` com a seguinte mensagem:

  ```json
  { "message": "It is not possible to create a match with two equal teams" }
  ```

- Não é possível inserir uma partida com um time que não existe na tabela `teams`;
  - Caso algum dos times não esteja cadastrado no banco de dados, retorna um status `404` com a seguinte mensagem:

  ```json
  { "message": "There is no team with such id!" }
  ```

- Quando a partida é inserida com sucesso, retorna os dados da partida, com status `201`:

  ```json
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 8,
    "awayTeamGoals": 2,
    "inProgress": true
  }
  ```

</details>

## Leaderboards

<details>
  <summary><strong>O que foi desenvolvido</strong></summary>

### Foram desenvolvidos testes de integração que cobrem a maior parte das classes e métodos da rota leaderboard

### Endpoint `GET /leaderboard/home`

- Nesta rota é possível filtrar as classificações dos times da casa.

<details>
<summary><strong>Exemplo de retorno:</strong></summary>

  ```json
  [
    {
      "name": "Santos",
      "totalPoints": 9,
      "totalGames": 3,
      "totalVictories": 3,
      "totalDraws": 0,
      "totalLosses": 0,
      "goalsFavor": 9,
      "goalsOwn": 3,
      "goalsBalance": 6,
      "efficiency": "100.00"
    },
    {
      "name": "Palmeiras",
      "totalPoints": 7,
      "totalGames": 3,
      "totalVictories": 2,
      "totalDraws": 1,
      "totalLosses": 0,
      "goalsFavor": 10,
      "goalsOwn": 5,
      "goalsBalance": 5,
      "efficiency": "77.78"
    },
    {
      "name": "Corinthians",
      "totalPoints": 6,
      "totalGames": 2,
      "totalVictories": 2,
      "totalDraws": 0,
      "totalLosses": 0,
      "goalsFavor": 6,
      "goalsOwn": 1,
      "goalsBalance": 5,
      "efficiency": "100.00"
    },
    {
      "name": "Grêmio",
      "totalPoints": 6,
      "totalGames": 2,
      "totalVictories": 2,
      "totalDraws": 0,
      "totalLosses": 0,
      "goalsFavor": 4,
      "goalsOwn": 1,
      "goalsBalance": 3,
      "efficiency": "100.00"
    },
    {
      "name": "Real Brasília",
      "totalPoints": 6,
      "totalGames": 2,
      "totalVictories": 2,
      "totalDraws": 0,
      "totalLosses": 0,
      "goalsFavor": 2,
      "goalsOwn": 0,
      "goalsBalance": 2,
      "efficiency": "100.00"
    },
    {
      "name": "São Paulo",
      "totalPoints": 4,
      "totalGames": 2,
      "totalVictories": 1,
      "totalDraws": 1,
      "totalLosses": 0,
      "goalsFavor": 4,
      "goalsOwn": 1,
      "goalsBalance": 3,
      "efficiency": "66.67"
    },
    {
      "name": "Internacional",
      "totalPoints": 4,
      "totalGames": 3,
      "totalVictories": 1,
      "totalDraws": 1,
      "totalLosses": 1,
      "goalsFavor": 4,
      "goalsOwn": 6,
      "goalsBalance": -2,
      "efficiency": "44.44"
    },
    {
      "name": "Botafogo",
      "totalPoints": 4,
      "totalGames": 3,
      "totalVictories": 1,
      "totalDraws": 1,
      "totalLosses": 1,
      "goalsFavor": 2,
      "goalsOwn": 4,
      "goalsBalance": -2,
      "efficiency": "44.44"
    },
    {
      "name": "Ferroviária",
      "totalPoints": 3,
      "totalGames": 2,
      "totalVictories": 1,
      "totalDraws": 0,
      "totalLosses": 1,
      "goalsFavor": 3,
      "goalsOwn": 2,
      "goalsBalance": 1,
      "efficiency": "50.00"
    },
    {
      "name": "Napoli-SC",
      "totalPoints": 2,
      "totalGames": 2,
      "totalVictories": 0,
      "totalDraws": 2,
      "totalLosses": 0,
      "goalsFavor": 2,
      "goalsOwn": 2,
      "goalsBalance": 0,
      "efficiency": "33.33"
    },
    {
      "name": "Cruzeiro",
      "totalPoints": 1,
      "totalGames": 2,
      "totalVictories": 0,
      "totalDraws": 1,
      "totalLosses": 1,
      "goalsFavor": 2,
      "goalsOwn": 3,
      "goalsBalance": -1,
      "efficiency": "16.67"
    },
    {
      "name": "Flamengo",
      "totalPoints": 1,
      "totalGames": 2,
      "totalVictories": 0,
      "totalDraws": 1,
      "totalLosses": 1,
      "goalsFavor": 1,
      "goalsOwn": 2,
      "goalsBalance": -1,
      "efficiency": "16.67"
    },
    {
      "name": "Minas Brasília",
      "totalPoints": 1,
      "totalGames": 3,
      "totalVictories": 0,
      "totalDraws": 1,
      "totalLosses": 2,
      "goalsFavor": 3,
      "goalsOwn": 6,
      "goalsBalance": -3,
      "efficiency": "11.11"
    },
    {
      "name": "Avaí/Kindermann",
      "totalPoints": 1,
      "totalGames": 3,
      "totalVictories": 0,
      "totalDraws": 1,
      "totalLosses": 2,
      "goalsFavor": 3,
      "goalsOwn": 7,
      "goalsBalance": -4,
      "efficiency": "11.11"
    },
    {
      "name": "São José-SP",
      "totalPoints": 0,
      "totalGames": 3,
      "totalVictories": 0,
      "totalDraws": 0,
      "totalLosses": 3,
      "goalsFavor": 2,
      "goalsOwn": 5,
      "goalsBalance": -3,
      "efficiency": "0.00"
    },
    {
      "name": "Bahia",
      "totalPoints": 0,
      "totalGames": 3,
      "totalVictories": 0,
      "totalDraws": 0,
      "totalLosses": 3,
      "goalsFavor": 0,
      "goalsOwn": 4,
      "goalsBalance": -4,
      "efficiency": "0.00"
    }
  ]
  ```

</details>

### Endpoint `GET /leaderboard/away`

- Nesta rota é possível filtrar as classificações dos times de fora.

<details>
<summary><strong>Exemplo de retorno:</strong></summary>

```json
[
  {
    "name": "Palmeiras",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 7,
    "goalsOwn": 0,
    "goalsBalance": 7,
    "efficiency": "100.00"
  },
  {
    "name": "Corinthians",
    "totalPoints": 6,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 1,
    "goalsFavor": 6,
    "goalsOwn": 2,
    "goalsBalance": 4,
    "efficiency": "66.67"
  },
  {
    "name": "Internacional",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 3,
    "goalsOwn": 0,
    "goalsBalance": 3,
    "efficiency": "100.00"
  },
  {
    "name": "São José-SP",
    "totalPoints": 6,
    "totalGames": 2,
    "totalVictories": 2,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 3,
    "goalsOwn": 1,
    "goalsBalance": 2,
    "efficiency": "100.00"
  },
  {
    "name": "São Paulo",
    "totalPoints": 4,
    "totalGames": 3,
    "totalVictories": 1,
    "totalDraws": 1,
    "totalLosses": 1,
    "goalsFavor": 5,
    "goalsOwn": 5,
    "goalsBalance": 0,
    "efficiency": "44.44"
  },
  {
    "name": "Ferroviária",
    "totalPoints": 4,
    "totalGames": 3,
    "totalVictories": 1,
    "totalDraws": 1,
    "totalLosses": 1,
    "goalsFavor": 4,
    "goalsOwn": 5,
    "goalsBalance": -1,
    "efficiency": "44.44"
  },
  {
    "name": "Real Brasília",
    "totalPoints": 4,
    "totalGames": 3,
    "totalVictories": 1,
    "totalDraws": 1,
    "totalLosses": 1,
    "goalsFavor": 3,
    "goalsOwn": 4,
    "goalsBalance": -1,
    "efficiency": "44.44"
  },
  {
    "name": "Grêmio",
    "totalPoints": 4,
    "totalGames": 3,
    "totalVictories": 1,
    "totalDraws": 1,
    "totalLosses": 1,
    "goalsFavor": 5,
    "goalsOwn": 7,
    "goalsBalance": -2,
    "efficiency": "44.44"
  },
  {
    "name": "Flamengo",
    "totalPoints": 4,
    "totalGames": 3,
    "totalVictories": 1,
    "totalDraws": 1,
    "totalLosses": 1,
    "goalsFavor": 1,
    "goalsOwn": 3,
    "goalsBalance": -2,
    "efficiency": "44.44"
  },
  {
    "name": "Avaí/Kindermann",
    "totalPoints": 3,
    "totalGames": 2,
    "totalVictories": 1,
    "totalDraws": 0,
    "totalLosses": 1,
    "goalsFavor": 1,
    "goalsOwn": 1,
    "goalsBalance": 0,
    "efficiency": "50.00"
  },
  {
    "name": "Cruzeiro",
    "totalPoints": 3,
    "totalGames": 3,
    "totalVictories": 1,
    "totalDraws": 0,
    "totalLosses": 2,
    "goalsFavor": 6,
    "goalsOwn": 7,
    "goalsBalance": -1,
    "efficiency": "33.33"
  },
  {
    "name": "Santos",
    "totalPoints": 2,
    "totalGames": 2,
    "totalVictories": 0,
    "totalDraws": 2,
    "totalLosses": 0,
    "goalsFavor": 3,
    "goalsOwn": 3,
    "goalsBalance": 0,
    "efficiency": "33.33"
  },
  {
    "name": "Bahia",
    "totalPoints": 2,
    "totalGames": 2,
    "totalVictories": 0,
    "totalDraws": 2,
    "totalLosses": 0,
    "goalsFavor": 2,
    "goalsOwn": 2,
    "goalsBalance": 0,
    "efficiency": "33.33"
  },
  {
    "name": "Minas Brasília",
    "totalPoints": 1,
    "totalGames": 2,
    "totalVictories": 0,
    "totalDraws": 1,
    "totalLosses": 1,
    "goalsFavor": 1,
    "goalsOwn": 3,
    "goalsBalance": -2,
    "efficiency": "16.67"
  },
  {
    "name": "Botafogo",
    "totalPoints": 0,
    "totalGames": 2,
    "totalVictories": 0,
    "totalDraws": 0,
    "totalLosses": 2,
    "goalsFavor": 1,
    "goalsOwn": 4,
    "goalsBalance": -3,
    "efficiency": "0.00"
  },
  {
    "name": "Napoli-SC",
    "totalPoints": 0,
    "totalGames": 3,
    "totalVictories": 0,
    "totalDraws": 0,
    "totalLosses": 3,
    "goalsFavor": 1,
    "goalsOwn": 10,
    "goalsBalance": -9,
    "efficiency": "0.00"
  }
]
```

</details>

### Endpoint `GET /leaderboard` de forma que seja possível filtrar a classificação geral dos times na tela de classificação do front-end com os dados iniciais do banco de dados

- Nesta rota é possível filtrar as classificações de todos os times.

<details>
<summary><strong> Retorno esperado: </strong></summary>

  ```json
  [
    {
      "name": "Palmeiras",
      "totalPoints": 13,
      "totalGames": 5,
      "totalVictories": 4,
      "totalDraws": 1,
      "totalLosses": 0,
      "goalsFavor": 17,
      "goalsOwn": 5,
      "goalsBalance": 12,
      "efficiency": "86.67"
    },
    {
      "name": "Corinthians",
      "totalPoints": 12,
      "totalGames": 5,
      "totalVictories": 4,
      "totalDraws": 0,
      "totalLosses": 1,
      "goalsFavor": 12,
      "goalsOwn": 3,
      "goalsBalance": 9,
      "efficiency": "80.00"
    },
    {
      "name": "Santos",
      "totalPoints": 11,
      "totalGames": 5,
      "totalVictories": 3,
      "totalDraws": 2,
      "totalLosses": 0,
      "goalsFavor": 12,
      "goalsOwn": 6,
      "goalsBalance": 6,
      "efficiency": "73.33"
    },
    {
      "name": "Grêmio",
      "totalPoints": 10,
      "totalGames": 5,
      "totalVictories": 3,
      "totalDraws": 1,
      "totalLosses": 1,
      "goalsFavor": 9,
      "goalsOwn": 8,
      "goalsBalance": 1,
      "efficiency": "66.67"
    },
    {
      "name": "Internacional",
      "totalPoints": 10,
      "totalGames": 5,
      "totalVictories": 3,
      "totalDraws": 1,
      "totalLosses": 1,
      "goalsFavor": 7,
      "goalsOwn": 6,
      "goalsBalance": 1,
      "efficiency": "66.67"
    },
    {
      "name": "Real Brasília",
      "totalPoints": 10,
      "totalGames": 5,
      "totalVictories": 3,
      "totalDraws": 1,
      "totalLosses": 1,
      "goalsFavor": 5,
      "goalsOwn": 4,
      "goalsBalance": 1,
      "efficiency": "66.67"
    },
    {
      "name": "São Paulo",
      "totalPoints": 8,
      "totalGames": 5,
      "totalVictories": 2,
      "totalDraws": 2,
      "totalLosses": 1,
      "goalsFavor": 9,
      "goalsOwn": 6,
      "goalsBalance": 3,
      "efficiency": "53.33"
    },
    {
      "name": "Ferroviária",
      "totalPoints": 7,
      "totalGames": 5,
      "totalVictories": 2,
      "totalDraws": 1,
      "totalLosses": 2,
      "goalsFavor": 7,
      "goalsOwn": 7,
      "goalsBalance": 0,
      "efficiency": "46.67"
    },
    {
      "name": "São José-SP",
      "totalPoints": 6,
      "totalGames": 5,
      "totalVictories": 2,
      "totalDraws": 0,
      "totalLosses": 3,
      "goalsFavor": 5,
      "goalsOwn": 6,
      "goalsBalance": -1,
      "efficiency": "40.00"
    },
    {
      "name": "Flamengo",
      "totalPoints": 5,
      "totalGames": 5,
      "totalVictories": 1,
      "totalDraws": 2,
      "totalLosses": 2,
      "goalsFavor": 2,
      "goalsOwn": 5,
      "goalsBalance": -3,
      "efficiency": "33.33"
    },
    {
      "name": "Cruzeiro",
      "totalPoints": 4,
      "totalGames": 5,
      "totalVictories": 1,
      "totalDraws": 1,
      "totalLosses": 3,
      "goalsFavor": 8,
      "goalsOwn": 10,
      "goalsBalance": -2,
      "efficiency": "26.67"
    },
    {
      "name": "Avaí/Kindermann",
      "totalPoints": 4,
      "totalGames": 5,
      "totalVictories": 1,
      "totalDraws": 1,
      "totalLosses": 3,
      "goalsFavor": 4,
      "goalsOwn": 8,
      "goalsBalance": -4,
      "efficiency": "26.67"
    },
    {
      "name": "Botafogo",
      "totalPoints": 4,
      "totalGames": 5,
      "totalVictories": 1,
      "totalDraws": 1,
      "totalLosses": 3,
      "goalsFavor": 3,
      "goalsOwn": 8,
      "goalsBalance": -5,
      "efficiency": "26.67"
    },
    {
      "name": "Bahia",
      "totalPoints": 2,
      "totalGames": 5,
      "totalVictories": 0,
      "totalDraws": 2,
      "totalLosses": 3,
      "goalsFavor": 2,
      "goalsOwn": 6,
      "goalsBalance": -4,
      "efficiency": "13.33"
    },
    {
      "name": "Minas Brasília",
      "totalPoints": 2,
      "totalGames": 5,
      "totalVictories": 0,
      "totalDraws": 2,
      "totalLosses": 3,
      "goalsFavor": 4,
      "goalsOwn": 9,
      "goalsBalance": -5,
      "efficiency": "13.33"
    },
    {
      "name": "Napoli-SC",
      "totalPoints": 2,
      "totalGames": 5,
      "totalVictories": 0,
      "totalDraws": 2,
      "totalLosses": 3,
      "goalsFavor": 3,
      "goalsOwn": 12,
      "goalsBalance": -9,
      "efficiency": "13.33"
    }
  ]
  ```

</details>
