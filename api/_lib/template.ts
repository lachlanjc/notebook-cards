import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

function getCss(theme: string, fontSize: string) {
  let background = '#ffffff'
  let radial = '#dde1e4'

  if (theme === 'dark') {
    background = '#17171d'
    radial = '#3c4858'
  }

  return `
    body {
      background: ${background};
      background-image: radial-gradient(circle at 25px 25px, ${radial} 3%, transparent 0%),   
        radial-gradient(circle at 75px 75px, ${radial} 3%, transparent 0%);
      background-size: 100px 100px;
      height: 100vh;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-family: 'Gotham A', 'Gotham B', sans-serif;
      font-size: ${sanitizeHtml(fontSize)};
      font-style: normal;
      letter-spacing: -.01em;
    }

    code {
      font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;
      font-size: .875em;
      white-space: pre-wrap;
    }

    code:before, code:after {
      content: '\`';
    }

    .img-wrapper {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }

    .logo {
      width: 275px;
      height: 275px;
    }

    .plus {
      color: #7a8c97;
      font-size: 100px;
      padding: 0 50px;
    }

    .spacer {
      margin: 100px 150px 150px;
    }

    .brand {
      font-size: 90px;
      padding: 50px;
      text-align: center;
      position: absolute;
      top: 0;
      width: 100%;
      color: #7a8c97;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nyu {
      color: ${theme === 'dark' ? '#c975ff' : '#57068c'};
      font-weight: 700;
      font-size: 100px;
      padding-left: .25em;
    }
    
    .heading {
      ${
        theme === 'dark'
          ? 'background-image: linear-gradient(to bottom right, #c975ff, #8900e1);'
          : 'background-image: linear-gradient(to bottom right, #8900e1 12.5%, #57068c);'
      };
      background-repeat: no-repeat;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 100px 50px 25px;
      font-weight: 700;
      line-height: 0.875;
      letter-spacing: -.06em;
    }

    .heading * {
      margin: 0;
    }

    .caption {
      font-size: ${Number(sanitizeHtml(fontSize).match(/\d+/)) * 0.375}px;
      text-transform: uppercase;
      color: #7a8c97;
      font-weight: 400;
      letter-spacing: 0;
    }
    
    .avatar {
      width: 125px;
      border-radius: 125px;
      margin: 0 50px;
    }
    
    .emoji {
      height: 1em;
      width: 1em;
      margin: 0 .05em 0 .1em;
      vertical-align: -0.1em;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, caption } = parsedReq
  return `<!DOCTYPE html>
  <html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, fontSize)}
  </style>
  <link rel="stylesheet" href="http://assets.lachlanjc.me/bf566c6457ac/gotham.css" />
  <body>
    <div class="brand">
      <img class="avatar" src="https://github.com/lachlanjc.png">
      @lachlanjc @ <span class="nyu">IMA</span>
    </div>
    <div class="spacer">
      ${
        images.length > 0
          ? `<div class="img-wrapper">
          <img class="logo" src="${sanitizeHtml(images[0])}" />
          ${images.slice(1).map(img => {
            return `<div class="plus">+</div>
            <img class="logo" src="${sanitizeHtml(img)}" />`
          })}
        </div>`
          : ''
      }
      <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</div>
      ${
        caption
          ? `<div class="caption">${emojify(sanitizeHtml(caption))}</div>`
          : ''
      }
    </div>
  </body>
</html>`
}
