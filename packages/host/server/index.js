const express = require('express');
const path = require('path');
const fs = require('fs');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { Provider } = require('react-redux');
const { StaticRouter } = require('react-router-dom');
const App = require('../src/App').default;
const { createStore } = require('../src/store');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve compiled client bundles
app.use(express.static(path.resolve(__dirname, '../client')));

app.get('*', (req, res) => {
  // New store per request — never share state across requests
  const store = createStore();

  // SSR renders the host shell only.
  // Remote MFE components (ProductList, Cart) are lazy-loaded on the client after hydration.
  const appHtml = renderToString(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        StaticRouter,
        { location: req.url },
        React.createElement(App)
      )
    )
  );

  const preloadedState = JSON.stringify(store.getState())
    .replace(/</g, '\\u003c'); // prevent XSS via </script>

  const template = fs.readFileSync(
    path.resolve(__dirname, '../client/index.html'),
    'utf-8'
  );

  const html = template
    .replace(/<div id=["']?root["']?>\s*<\/div>/, `<div id="root">${appHtml}</div>`)
    .replace(
      '</head>',
      `<script>window.__PRELOADED_STATE__ = ${preloadedState};</script></head>`
    );

  res.status(200).send(html);
});

app.listen(PORT, () => {
  console.log(`SSR server → http://localhost:${PORT}`);
});
