# KaKaK-Sneakers

Site estatico de catalogo para publicar no GitHub Pages. O projeto foi feito apenas com HTML, CSS, JavaScript e um arquivo JSON externo para facilitar a atualizacao dos produtos e das paginas individuais.

## Estrutura do projeto

```text
.
|-- assets/
|   `-- images/
|       |-- sneaker-carbon.svg
|       |-- sneaker-classic.svg
|       |-- sneaker-desert.svg
|       |-- sneaker-flare.svg
|       |-- sneaker-urban.svg
|       `-- sneaker-velocity.svg
|-- index.html
|-- product.html
|-- product.js
|-- products/
|   |-- kktw-carbon-pulse.html
|   |-- kktw-classic-mono.html
|   |-- kktw-desert-flow.html
|   |-- kktw-flare-orange.html
|   |-- kktw-soft-sand.html
|   |-- kktw-street-foam.html
|   |-- kktw-urban-match.html
|   `-- kktw-velocity-beige.html
|-- products.json
|-- script.js
`-- style.css
```

## Como publicar no GitHub

1. Crie um repositorio no GitHub.
2. Envie estes arquivos para a branch principal do repositorio.
3. No GitHub, abra `Settings`.
4. Entre em `Pages`.
5. Em `Build and deployment`, escolha `Deploy from a branch`.
6. Selecione a branch principal, normalmente `main`, e a pasta `/ (root)`.
7. Salve. O GitHub Pages vai gerar a URL publica do site em alguns instantes.

## Como ativar o GitHub Pages

1. Garanta que o arquivo `index.html` esteja na raiz do repositorio.
2. Confirme que todos os arquivos estaticos tambem estao no repositorio.
3. Depois de ativar em `Settings > Pages`, aguarde a publicacao.
4. Ao atualizar os arquivos e enviar um novo commit, o site sera republicado automaticamente.

## Como atualizar os produtos

Todos os produtos sao carregados pelo arquivo `products.json`.

1. Abra `products.json`.
2. Duplique um objeto dentro da lista `products`.
4. Altere os campos:
	 `id`: identificador unico.
	 `name`: nome do produto.
	 `price`: preco numerico, sem simbolo de moeda.
	 `sizes`: lista de tamanhos disponiveis entre 34 e 43.
	 `image`: caminho da imagem.
	 `tag`: destaque opcional.
	`page`: caminho da pagina individual do produto.
	`description`: texto curto para a home e pagina do item.
	`story`: descricao complementar.
	`styleTips`: lista com ideias de looks que combinam com o tenis.
	`highlights`: lista curta de destaques do modelo.
4. Salve o arquivo e envie a alteracao para o GitHub.

Exemplo:

```json
{
	"id": "kktw-runner-07",
	"name": "KKTW Runner 07",
	"price": 349.9,
	"sizes": [38, 39, 40, 41],
	"image": "assets/images/sneaker-velocity.svg",
	"tag": "Novo drop",
	"page": "products/kktw-runner-07.html",
	"description": "Descricao curta do produto.",
	"story": "Texto complementar para a pagina do produto.",
	"styleTips": ["Look 1", "Look 2"],
	"highlights": ["Destaque 1", "Destaque 2"]
}
```

## Como funcionam as paginas individuais

Cada item do catalogo aponta para um arquivo HTML proprio dentro da pasta `products/`. Esses arquivos redirecionam para `product.html`, que carrega o conteudo do item no `products.json` usando o `id` do produto.

Para criar um novo produto:

1. Adicione o produto no `products.json`.
2. Crie um novo arquivo em `products/` seguindo o mesmo padrao dos existentes.
3. Ajuste o `id` no redirecionamento e o campo `page` do JSON.

## Ajuste do WhatsApp

O numero do WhatsApp fica no atributo `data-whatsapp-number` dentro de `index.html`.

Exemplo:

```html
<body data-whatsapp-number="5511999999999">
```

Use o numero no formato internacional, sem espacos, parenteses ou hifens.

## Desenvolvimento local

Por ser um projeto 100% estatico, basta abrir a pasta no VS Code e publicar os arquivos no GitHub Pages. Para testes locais com carregamento do JSON, prefira usar uma extensao de servidor estatico do editor ou qualquer servidor HTTP simples.