const fs          = require('fs');
const http        = require('http');
const express     = require('express');
const path        = require('path');

const PORT = 8095;
const DIR_PUBLIC    = path.join(__dirname,"../public/");
const DIR_MANIFESTS = path.join(DIR_PUBLIC,"manifests/");
const DIR_JSONFORM  = path.join(__dirname,"../node_modules/jsonform/");

// JSON schema
let jsonschema = JSON.parse(fs.readFileSync(path.join(__dirname,"schema.json"), 'utf8'));


// Touch manifests folder
if (!fs.existsSync(DIR_MANIFESTS)){
	fs.mkdirSync(DIR_MANIFESTS);
	console.log("Created Manifests folder");
}

let getManifestPath = (mid)=>{
	return DIR_MANIFESTS + mid + ".h2iosc.service.json";
}


let app = express();
app.use(express.json({ limit: '50mb' }));

app.use('/', express.static(DIR_PUBLIC));
app.use('/jsonform', express.static(DIR_JSONFORM));


// API
app.get("/api/schema", (req,res)=>{
	res.send(jsonschema);
});

app.post("/api/manifests", (req,res)=>{
	let mid  = req.body.mid;
	let data = req.body.data;

	if (!mid || !data){
		res.send(false);
		return;
	}

	let jmpath = getManifestPath(mid);

	fs.writeFile(jmpath, JSON.stringify(data /*, null, 4*/), (err) => {
		if (err) console.log(err);
		else {
			console.log("Manifest "+mid+" written successfully");
			res.send(true);
		}
	});
});

app.get("/api/manifests/:mid", (req,res)=>{
	let mid = req.params.mid;

	let jmpath = getManifestPath(mid);

	if (fs.existsSync(jmpath)){
		res.sendFile(jmpath);
	}
	else res.send(false);
});



http.createServer(app).listen(PORT, ()=>{
	console.log("Service up and running on PORT "+PORT);
});