const https = require('https');
https.get('https://raw.githubusercontent.com/search?q=ru.a402d.rawbtprinter+html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
