# Protótipos da landing Homely

Conceitos visuais gerados com a ferramenta integrada ImageGen em 24/10/2026. Não são páginas implementadas. Cada prancha inclui desktop e mobile. As fotografias e o desenho do símbolo são conceituais; na implementação, preservar o logo existente em public/logo.svg.

## Direções
- **01 — Essencial:** composição dividida inspirada nas referências, hierarquia tipográfica forte, branco, carvão e coral. Indicada para aproximar Homely das referências com uma estrutura simples.
- **02 — Acolher:** fotografia ampla de abertura, tons quentes e seleção editorial de ambientes. Preserva a ideia de abertura fotográfica da landing original, com mais organização e proximidade.

As duas primeiras pranchas usam português e permanecem como histórico. O usuário posteriormente definiu inglês para todo o conteúdo e escolheu prototipo_2.webp como referência principal. A direção atual e as alternativas de conteúdo do slider estão em [SLIDER-VARIATIONS.md](SLIDER-VARIATIONS.md).

## Estado verificado e decisões
A landing em src/app/(nondashboard)/landing compõe HeroSection, FeaturesSection, DiscoverSection, CallToActionSection e FooterSection. O layout compartilha NavBar e lê sessão no servidor. O projeto utiliza Next.js, React, Tailwind, componentes Base UI/shadcn e Redux/RTK Query; src/state/api.ts consulta somente a sessão pública. src/lib/auth-backend.ts faz chamadas de autenticação no servidor; src/lib/auth-http.ts trata erros de negócio, ProblemDetails, validação e corpos vazios. O único controller encontrado em ../real-estate-api/Homely.Api/Controllers é AuthController.

A busca atual tem valor fixo e handlers vazios. As seções atuais citam avaliações, anúncios verificados e reservas sem endpoints correspondentes. Por isso, os protótipos não usam esses argumentos comerciais nem inventam catálogo real. Entrar corresponde à rota existente /login. Os links de navegação propostos seriam âncoras locais. A busca permanece uma demonstração marcada Em breve, dependente de funcionalidades futuras.

Reutilizar os componentes existentes numa futura implementação reduz dependências e mantém consistência. Não foram criadas novas abstrações nem alterados autenticação, estado ou código da aplicação. Mockups estáticos permitem comparar direção visual antes de investir em interações; não validam acessibilidade, contraste, responsividade real ou integração.

## Pendências identificadas, fora do escopo
- **Erro atual:** busca não interativa e links para rotas não presentes na árvore de páginas, como /search, /explore e /discover.
- **Melhoria sugerida:** substituir texto repetitivo e promessas não implementadas; revisar idioma, metadados e textos alternativos herdados.
- **Dependência externa:** catálogo e busca precisam de contratos de backend ainda inexistentes.
- **Decisão a validar:** alternativa final de conteúdo do slider e exposição da busca futura versus sua remoção no lançamento. Inglês já foi definido pelo usuário.
- **Divergência documental:** as instruções fornecidas citam API_BASE_URL, mas src/lib/auth-backend.ts atualmente lê API_URL e SECRET_KEY. Não foi alterado por estar fora do escopo visual.

## Fontes e validação
Referências: quatro imagens fornecidas pelo usuário, incluindo landing page original.png e os três arquivos WebP em Downloads/prototipos. Fontes de implementação consultadas: componentes da landing, NavBar, layouts, globals.css, providers, state, session.ts, auth-backend.ts, auth-http.ts, configurações do projeto e AuthController.cs.

Pranchas revisadas visualmente. Nenhum teste de execução foi realizado: a entrega contém apenas imagens e documentação, sem mudanças no código. A alteração preexistente em src/app/(auth)/login/page.tsx foi preservada.

## Prompts finais
### 01 — Essencial
Use case: ui-mockup. Create a polished high-fidelity HOMELY rental housing landing page design concept, Portuguese Brazil. Reference the supplied conversation images: original Homely supplies brand and coral accent; three Realco references supply generous whitespace, architectural photos, large elegant sans serif, rounded corners and split editorial layout. Do not copy Realco branding. Produce ONE large portrait design presentation board with a complete desktop landing page on left 75% width and matching mobile top-of-page on right 25%, clean warm light gray surrounding canvas. Title above board "01 / HOMELY — Essencial". Desktop page white, charcoal typography, muted coral #E88789 primary buttons. Header small geometric home logo and HOMELY; navigation "A proposta", "Como funciona", black "Entrar" button. Hero split with tall beautiful realistic contemporary Brazilian apartment-building / landscaped townhouse architectural photo on left and oversized black headline on right "Um novo lugar. Uma nova fase." Supporting text "Seu próximo lar começa com uma boa escolha." Coral button "Conheça a Homely". Small black editorial card below headline with interior photo inset and text "Mais espaço para viver do seu jeito." Below hero a wide understated filter panel titled "Imagine sua próxima busca" with small badge "Em breve", fields "Cidade ou bairro", "Tipo de imóvel", "Faixa de aluguel", disabled-looking button "Buscar imóveis". No fake actual listings or reviews. Below a balanced editorial section titled "O que faz um lugar ser seu?" with three concise icon columns "Localização", "Conforto", "Seu orçamento" and one line per column. Then horizontal rounded charcoal CTA panel "Sua próxima fase começa aqui." and white "Entrar" button, small coral highlight. Footer HOMELY and "Um lugar para chamar de lar." Mobile shows header, headline, photo and compact future search stacked with readable sizes. Show real beautiful photography, fine 1px gray lines, controlled whitespace, refined 20px corners, clear hierarchy. No browser chrome, no statistics, no testimonials, no signup, no investment/sales language. This is a visual concept only, not implemented website. All text clean, readable Portuguese.

### 02 — Acolher
O prompt integral da segunda prancha não foi registrado corretamente na geração inicial. A imagem final está preservada em 02-acolher.png.

