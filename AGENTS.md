## Análise Completa do Projeto

Antes de propor ou implementar qualquer mudança, faça uma análise abrangente do estado atual da aplicação.

- **Stack Tecnológico Identificado:** Next.js 16 com App Router (`src/app`), React 19, TypeScript, Tailwind CSS 4, PNPM e shadcn/ui com Base UI. Redux Toolkit e RTK Query estão configurados em `src/state`; a API do RTK Query ainda não possui endpoints.
- **Ação Obrigatória:** Analise a estrutura de pastas, componentes, gerenciamento de estado (se houver Redux, Zustand ou Context API), comunicação com a API e tratamento de erros.
- **Compreensão Contextual:** Entenda como as partes do projeto se interligam. Nunca faça alterações isoladas sem verificar o impacto cascata nos componentes dependentes.

## Compatibilidade Estrita com o Backend (ASP.NET Core)

O backend deste projeto é desenvolvido em **ASP.NET Core**. A integração entre o frontend e o backend deve ser tratada com rigor.

- **Não presuma o comportamento do backend:** Sempre verifique (através de tipos, interfaces, chamadas `fetch`/axios ou documentação/Swagger, se disponível) como o backend responde.
- **Contratos e Tipagem:** Modele as interfaces TypeScript pelo contrato HTTP efetivamente exposto pelos Controllers, não apenas pelos DTOs internos da Application. A API atual usa `AddControllers()` sem customização do serializador, com JSON em `camelCase`. O `Result<T>` interno do backend não é um envelope público obrigatório.
- **Autenticação e Segurança:** Verifique como os tokens (JWT) ou cookies estão sendo armazenados e enviados nas requisições.
- **Tratamento de Erros:** Trate os formatos reais descritos abaixo, incluindo `ProblemDetails`, erros de negócio e respostas sem JSON. Registre claramente qualquer incompatibilidade encontrada.

### Fontes de verdade e escopo da API

- O backend está em `../real-estate-api`, usa ASP.NET Core/.NET 10, EF Core e PostgreSQL. Sua documentação atual está em [`AGENTS.md`](../real-estate-api/AGENTS.md).
- Para conferir uma integração, consulte `Homely.Api/Controllers`, `Homely.Application/UseCases`, os erros/enums em `Homely.Domain` e a autenticação em `Homely.Infrastructure`. A API traduz os resultados dos casos de uso em HTTP; entidades de persistência não definem automaticamente contratos públicos.
- Atualmente existe apenas `AuthController`, com login, refresh e logout. A existência de entidades de imóveis, locações e usuários não significa que seus endpoints estejam implementados. Não invente rotas de cadastro, perfil ou imóveis.
- Em Development, o backend disponibiliza OpenAPI e Scalar (`/openapi/v1.json` e `/scalar/v1`). Confirme contratos também no código, especialmente cookies e respostas construídas com objetos anônimos.

### Contratos HTTP de autenticação

| Operação                       | Entrada                                      | Sucesso                                               | Falha esperada                                                       |
| ------------------------------ | -------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `POST /api/auth/login`         | JSON `{ email, password }`                   | `200`, JSON `{ accessToken }` e cookie `refreshToken` | `401` para credenciais inválidas                                     |
| `POST /api/auth/refresh-token` | Cookie `refreshToken`, sem corpo obrigatório | `200`, JSON `{ accessToken }` e cookie rotacionado    | `401` para token ausente, inválido, expirado ou revogado             |
| `POST /api/auth/logout`        | Cookie `refreshToken`                        | `204`, sem corpo, com exclusão do cookie              | Falhas de persistência não devem ser tratadas como logout confirmado |

- Login e refresh **não** retornam `refreshToken` nem `user` no JSON público. O `LoginResponse` da Application contém o refresh token apenas para uso interno pelo Controller.
- Erros de negócio de login/refresh retornam `{ code, description }`. Exceções passam pelo `ExceptionHandler` e usam `ProblemDetails` (`status`, `title`, `detail`, `instance`); validações automáticas podem incluir `errors`. Refresh sem cookie chama `Unauthorized()` sem payload explícito: não dependa de um corpo JSON uniforme.
- Não execute `response.json()` incondicionalmente: logout retorna `204` e outras falhas podem não conter JSON. Não presuma a propriedade `message` como mensagem padrão.
- Login, refresh e logout compartilham o rate limit `auth`: 10 requisições por minuto por IP, sem fila, com rejeição `429`. Evite loops de refresh e não interprete `429` como sessão inválida.

### Cookies, JWT e renovação

- O cookie da API se chama `refreshToken` e usa `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/api/auth` e validade configurada em `Jwt:RefreshTokenDays`. Não exponha seu valor em JavaScript do navegador, JSON público ou logs.
- Chamadas diretas do navegador à API precisam de `credentials: "include"`. O CORS usa `Frontend:Origin` com credenciais habilitadas; a origem de desenvolvimento configurada é `http://localhost:3000`.
- Chamadas nas Server Actions são servidor-servidor: cookies do navegador e `Set-Cookie` da API não são encaminhados automaticamente. Se o Next.js intermediar a sessão, implemente explicitamente o encaminhamento de `Cookie` e o processamento de `Set-Cookie`, incluindo rotação e exclusão. `credentials: "include"` sozinho não resolve esse fluxo. O `Path=/api/auth` também precisa ser considerado ao definir onde o navegador enviará cookies.
- Os perfis locais da API usam `http://localhost:5149` e `https://localhost:7261`; há redirecionamento HTTPS. Valide no navegador a combinação de esquema, certificado, `Secure` e `SameSite` antes de mudar atributos. CORS não substitui proteção contra CSRF.
- `API_BASE_URL` é usado no servidor e `NEXT_PUBLIC_API_BASE_URL` na configuração do RTK Query. As chamadas atuais acrescentam `/auth/...`, portanto a base deve incluir `/api`. Nunca coloque segredos JWT ou credenciais do banco em variáveis `NEXT_PUBLIC_*`.
- O access token é JWT e deve ser enviado como `Authorization: Bearer <token>` para endpoints protegidos. A configuração versionada define 15 minutos para access token e 7 dias para refresh; confira overrides do ambiente. A API valida expiração com `ClockSkew=0`. A duração do cookie frontend não estende a validade do JWT.
- As claims incluem `sub`, `email`, `role` e `jti`; os papéis são `Manager` e `Tenant`, com políticas `ManagerOnly` e `TenantOnly`. Preserve esses valores e não confunda ocultação de UI ou presença de cookie com autorização validada pela API.
- Cada login cria uma sessão própria. O refresh rotaciona o token, e o anterior deixa de ser utilizável. Coordene renovações simultâneas, inclusive entre abas, e limite a repetição da chamada original após refresh; `403` não deve disparar renovação.
- Logout é idempotente e revoga somente a sessão associada ao cookie, incluindo tokens sucessores. Descarte o access token local: um JWT já emitido continua válido até expirar. O backend não apaga o cookie em falhas de refresh, para evitar que respostas atrasadas removam um token recém-renovado.

### Incompatibilidades verificadas e pendências

Esta lista registra o estado observado em 22/10/2026; não representa funcionalidades já corrigidas. Atualize-a quando a integração mudar.

- **Erro atual — contrato:** `src/types/index.d.ts` exige `refreshToken` e `user` em `LoginResponse`, mas a API retorna apenas `accessToken`. `src/app/actions/auth.ts` e `src/middleware.ts` esperam o refresh token no JSON e o enviam no corpo, enquanto a API o lê de cookie. Não há processamento do `Set-Cookie` recebido da API nesses fluxos.
- **Erro atual — sessão:** `src/lib/session.ts` cria cookies `homely_access_token` e `homely_refresh_token`, distintos do cookie da API, e dá 1 hora ao cookie do access token, embora o JWT tenha validade configurada de 15 minutos. A presença desses cookies no middleware não comprova uma sessão válida.
- **Erro atual — respostas:** o login procura `errorData.message` em vez de considerar `description`/`ProblemDetails`; `src/lib/api-client.ts` sempre tenta ler JSON em respostas de sucesso. O logout não verifica `response.ok`, portanto pode encerrar a sessão local sem confirmar a revogação no backend.
- **Melhoria necessária — concorrência:** o cliente autenticado e o middleware tentam renovar tokens sem coordenação compartilhada. A configuração de RTK Query ainda não envia credenciais nem implementa renovação.
- **Decisão de integração pendente:** definir e implementar consistentemente se a autenticação será intermediada pelo Next.js ou chamada diretamente pelo navegador, respeitando os contratos acima. O frontend atual usa Server Actions, mas o transporte dos cookies ainda está incompleto.
- **Validação pendente:** a documentação do backend registra testes de API/Postman e concorrência; isso não comprova o fluxo no navegador. Validar login, expiração, refresh, logout, chamadas simultâneas e `429` após corrigir a integração. Não registrar essas verificações como executadas sem evidência.

## Simplicidade, Robustez e Aprendizado (Sem Overengineering)

O projeto tem forte foco educacional. Cada decisão deve maximizar a compreensão das ferramentas utilizadas, mantendo a qualidade. Como o foco é educacional, é interesante criar um arquivo que explique como cada uma das decissões, padrões, etc, são tomados, os motivos, befícios e as fontes para poder estudar corretamente.

- **Evite complexidade desnecessária:** Não introduza padrões arquiteturais, abstrações prematuras ou dependências externas se o problema atual puder ser resolvido de forma clara com os recursos nativos do React/Next.js.
- **Explicação Didática:** Toda solução técnica proposta deve ser explicada. O agente deve detalhar o **motivo** da mudança, as **vantagens**, as **limitações** e por que eventuais alternativas foram descartadas.
- **Qualidade não é sofisticação:** Uma solução simples e legível é sempre preferível a uma solução complexa e de difícil manutenção, desde que atenda aos requisitos de escalabilidade, segurança e performance atuais.

## Análise Antes de Qualquer Alteração

A regra de ouro é **Lêr antes de Escrever**.

- Consulte as configurações existentes (`eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`) para manter o padrão do projeto.
- Verifique se já existe um componente de UI, hook ou utilitário que resolve o problema (reutilização de código).
- Evite refatorações não solicitadas que possam introduzir regressões (inconsistências). Avalie ativamente as ramificações de uma mudança nas páginas afetadas.

## Planejamento e Registro de Melhorias Futuras

Problemas arquiteturais ou melhorias que não são estritamente necessárias para a tarefa atual **não devem ser implementados impulsivamente**.

- **Registro de Débito Técnico:** Crie ou atualize um documento Markdown apropriado (ex: `TODO.md` ou `IMPROVEMENTS.md`) para registrar observações, bugs não críticos e refatorações recomendadas.
- **Categorização:** Diferencie claramente o que é um erro atual, uma melhoria sugerida, uma dependência externa bloqueante ou uma suposição/decisão que precisa de validação humana (confirmação do desenvolvedor).

## Explicação e Resumo das Alterações

Ao concluir a implementação de uma tarefa, o agente deve fornecer um relatório claro:

1.  **O que foi alterado** (resumo dos arquivos modificados).
2.  **Por que foi alterado** (justificativa pautada nas regras deste arquivo).
3.  **Como funciona** (explicação didática da solução).
4.  **Impactos** (integração com o backend, impactos visuais, etc).
5.  **Pendências ou Limitações** (o que faltou fazer, riscos assumidos, testes faltantes).
    _Distinguir sempre fatos concretos (verificados no código) de suposições._

## Manutenção Contínua da Documentação

Este arquivo (`AGENTS.md`) e outros documentos de arquitetura devem refletir a **realidade** do projeto, e não apenas o planejamento utópico.

- Atualize este arquivo ou documentos correlatos sempre que um novo padrão for adotado (ex: troca de biblioteca de estado, mudança no fluxo de autenticação).
- Evite duplicação de informações entre arquivos Markdown.

## Validação Obrigatória das Alterações

O agente deve encorajar e respeitar as etapas de validação.

- Para alterações de código, execute as verificações existentes: `pnpm lint`, `pnpm exec tsc --noEmit` e `pnpm build`. Atualmente não há script de testes automatizados em `package.json`; não presuma que `pnpm test` existe. Para alterações exclusivamente documentais, confira os caminhos e contratos citados e revise o diff; informe que testes de execução não foram realizados.
- **Transparência:** Nunca afirme que o código foi testado ou validado se você (agente) apenas gerou o código. Peça o feedback dos logs de erro do terminal do usuário caso o build ou lint falhem. Avalie cautelosamente como as alterações do frontend se comportarão ao consumir a API em ASP.NET Core real.
