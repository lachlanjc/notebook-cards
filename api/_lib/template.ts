// import { readFileSync } from 'fs'
import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

// const rglr = readFileSync(
//   `${__dirname}/../../public/fonts/NittiGrotesk-Normal.woff2`
// ).toString('base64')
// const bold = readFileSync(
//   `${__dirname}/../../public/fonts/NittiGrotesk-Bold.woff2`
// ).toString('base64')

function getCss(theme: string, fontSize: string, text: string) {
  let background = '#ffffff'
  let radial = '#dde1e4'

  if (theme === 'dark') {
    background = '#17171d'
    radial = '#3c4858'
  }

  return `
    @font-face{font-family:Whyte;font-style:normal;font-weight:400;src:url(https://cdn.glitch.com/4d99d0f7-c364-44a5-b1b9-2c3c3f5cb333%2FWhyte-Regular-412d6af025a4cfe3d36ab0850f3b258f.woff2?v=1582525105493) format("woff2");font-display:swap;}
    @font-face{font-family:Whyte;font-style:normal;font-weight:700;src:url(https://cdn.glitch.com/4d99d0f7-c364-44a5-b1b9-2c3c3f5cb333%2FWhyte-Bold-259eea7f642aa1973e3688f57b803286.woff2?v=1582525121432) format("woff2");font-display:swap;}
    @font-face{font-family:WhyteInktrap;font-style:normal;font-weight:700;src:url(https://cdn.glitch.com/4d99d0f7-c364-44a5-b1b9-2c3c3f5cb333%2FWhyteInktrap-Bold-d5fda619e54a4948a42c0f133a4ad5ed.woff2?v=1582525136783) format("woff2");font-display:swap;}

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
      font-family: Whyte, system-ui, sans-serif;
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
      margin: 50px 0 -50px;
      padding-top: 125px;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }
    .img {
      width: 200px;
      height: 200px;
    }
    .img[src*="//github.com/"] {
      border-radius: 75px;
      width: 150px;
      height: 150px;
    }
    .plus {
      color: #8492a6;
      font-size: 75px;
      padding: 0 25px;
    }
    .container {
      margin: 125px 150px 150px;
    }
    .spacer {
      margin: 50px 0;
      width: 100%;
    }
    .brand {
      font-size: 105px;
      padding: 50px;
      text-align: center;
      font-weight: bold;
      position: absolute;
      top: 0;
      width: 100%;
      color: #0069ff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .brand span {
      color: #8492a6;
      font-weight: normal;
      margin-right: 0.1em;
    }
    .logo {
      border-radius: 75px;
      width: 125px;
      margin: 0 50px;
    }
    
    .heading {
      color: ${
        text.toLowerCase().includes('music')
          ? '#ff365d'
          : theme === 'dark'
          ? '#79ffe1'
          : '#0070f3'
      };
      font-family: WhyteInktrap, system-ui;
      font-weight: bold;
      margin: 75px 50px 0;
      padding-bottom: 25px;
      line-height: 0.875;
    }

    .heading * {
      margin: 0;
    }

    .caption {
      font-size: ${Number(sanitizeHtml(fontSize).match(/\d+/)) * 0.375}px;
      text-transform: uppercase;
      color: #7a8c97;
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
    ${getCss(theme, fontSize, text)}
  </style>
  <body>
    <div class="brand">
      <img class="logo" src="https://github.com/lachlanjc.png">
      <span>@lachlanjc/</span>notebook
    </div>
    <div class="container">
      ${
        images.length > 0
          ? `<div class="img-wrapper">
              <img class="img" src="${sanitizeHtml(images[0])}" />
              ${images.slice(1).map(img => {
                return `<div class="plus">+</div>
                <img class="img" src="${sanitizeHtml(img)}" />`
              })}
            </div>`
          : '<div class="spacer"></div>'
      }
      <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</div>
      ${
        caption && caption !== 'undefined'
          ? `<div class="caption">${emojify(sanitizeHtml(caption))}</div>`
          : ''
      }
    </div>
  </body>
</html>`
}
