const express = require('express');

const app = express();
app.use(express.static('dist'));

app.listen(process.env.PORT||3000, () => console.log(`Json Creator App is available on port: ${process.env.PORT||3000}`));