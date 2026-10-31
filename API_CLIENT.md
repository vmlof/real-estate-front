# Cliente HTTP autenticado

`src/lib/api-client.ts` oferece `fetchWithAuth<T>(endpoint, options)` para futuras chamadas **no servidor** a rotas protegidas da API ASP.NET Core. Atualmente não há chamadas a essa função no projeto: o backend expõe apenas `AuthController` (login, refresh e logout), integrado por `auth-backend.ts`. O RTK Query no navegador consulta somente `/api/auth/session` na própria aplicação Next.js.

## Fluxo

1. `validateEndpoint` exige um caminho relativo à base da API, começando com `/`. Rejeita `//`, `/auth` e caracteres de barra invertida ou quebra de linha. A base `API_URL` vem de `auth-backend.ts` e deve terminar em `/api`, sem barra final, para formar uma URL como `${API_URL}/properties` quando existir uma rota real.
2. `getSession()` lê a sessão privada associada ao cookie `homely_session`. Se não existir, a função lança `AuthError(401)` antes de chamar o backend. O navegador nunca recebe o access token por este caminho.
3. `requestWithToken` copia os cabeçalhos recebidos, substitui `Authorization` pelo JWT da sessão e remove um eventual `Cookie` fornecido pelo chamador. Envia a requisição sem cache, sem seguir redirecionamentos e com limite de dez segundos quando o chamador não fornece um `signal`.
4. Somente se a **rota protegida** responder `401`, `fetchWithAuth` pede a `getSession` uma sessão atualizada, passando o token rejeitado. `session.ts` coordena a renovação sob um bloqueio por sessão e distingue `401` de falhas temporárias e `429`. O cliente repete a requisição original uma única vez. Uma resposta `403` não inicia renovação.
5. Uma resposta não bem sucedida passa por `responseError`, que entende erros de negócio (`description`), `ProblemDetails` (`detail`/`title`), validação (`errors`) e corpos vazios. `readBody` devolve `undefined` para corpo vazio ou JSON inválido; por isso o retorno é `Promise<T | undefined>`.

## Decisões e limites

- As funções pequenas separam validação, transporte e decisão de renovação; o fluxo principal fica linear sem criar uma camada HTTP genérica. A função compartilha `getSession` e `auth-http` em vez de duplicar suas regras.
- O tipo `T` descreve a expectativa de quem chama, mas **não valida** a resposta em tempo de execução. Quando houver uma rota concreta, confira o Controller e valide o corpo se os dados exigirem garantia adicional.
- O retry preserva método, corpo e opções. Antes de usar com um corpo de fluxo (`ReadableStream`) ou operação que possa causar efeito antes de retornar `401`, confirme que repetir essa requisição é seguro. Não existe ainda um endpoint protegido no backend para verificar esse caso.
- A construção `${API_URL}${endpoint}` preserva a correção local já presente no arquivo. A configuração `API_URL` precisa ser validada no ambiente de execução; `AGENTS.md` ainda cita `API_BASE_URL`, uma divergência registrada em `IMPROVEMENTS.md`.
- Testes simulados não demonstram integração real com a API, o certificado HTTPS e a configuração do ambiente.

## Fontes no projeto

- `src/lib/session.ts` e `src/lib/session-store.ts`: sessão, renovação, concorrência e persistência.
- `src/lib/auth-http.ts`: leitura de corpos e tradução de erros HTTP.
- `src/lib/auth-backend.ts`: URL da API e chamadas de login, refresh e logout.
- `../real-estate-api/Homely.Api/Controllers/AuthController.cs` e `../real-estate-api/Homely.Api/Exceptions/ExceptionHandler.cs`: contratos HTTP atualmente implementados.
