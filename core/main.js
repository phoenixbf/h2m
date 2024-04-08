const fs          = require('fs');
const http        = require('http');
const express     = require('express');
const path        = require('path');

const PORT = 8095;
const DIR_PUBLIC = path.join(__dirname,"../public/");
const DIR_JSONFORM = path.join(__dirname,"../node_modules/jsonform/");

// JSON schema
let jsonschema = JSON.parse(fs.readFileSync(path.join(__dirname,"schema.json"), 'utf8'));

let app = express();

app.use(express.json({ limit: '50mb' }));

app.use('/', express.static(DIR_PUBLIC));
app.use('/jsonform', express.static(DIR_JSONFORM));


// API
app.get("/api/schema", (req,res)=>{
	res.send(jsonschema);
});



http.createServer(app).listen(PORT, ()=>{
	console.log("Service up and running");
});