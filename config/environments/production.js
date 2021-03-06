const path = require('path');
const express = require('express');

const indexPath = path.join(process.cwd(), 'dist/backoffice/index.html');

module.exports = (app) => {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.use(express.static(path.join(process.cwd(), 'dist/backoffice')));
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
};
