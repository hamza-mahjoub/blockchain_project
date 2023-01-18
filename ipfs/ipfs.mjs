import { create } from "ipfs-http-client";
import express from "express";
import fs from 'fs';
import cors from "cors";
import { randomUUID } from "crypto";

var node = null;

async function ipfsCLient() {
  node = await create({
    host:"localhost",
    port: 5001,
    protocol:"http"
  });
  const version = await node.version();

  console.log("Version:", version.version);
}


var app = express();
app.use(express.urlencoded({ extended:false }))
app.use(express.json());
app.use(cors({origin:'*'}))

app.get('/add/file',async (req,res) => {
  let data = fs.readFileSync("./package.json")
  let options = {
      warpWithDirectory: false,
      progress: (prog) => console.log(`Saved :${prog}`)
  }
  let result = await node.add(data, options);
  res.send({...result, cid:`${result.cid}`})
})

app.post("/add/image", async (req, res) => {
  console.log(req.body);
  const fileAdded = await node.add(req.body.buf.data);
  console.log("Added file:", fileAdded.path, fileAdded.cid);

  res.send({path: fileAdded.path, hash:  `${fileAdded.cid}`})
 });

app.get('/add/:text', async (req, res) => {
  const fileAdded = await node.add({
    path: `${req.params.text.substring(0,3)}.txt`,
    content: req.params.text,
  });
  console.log("Added file:", fileAdded.path, fileAdded.cid);

  res.send({path: fileAdded.path, cid:  `cid: ${fileAdded.cid}`})
})

app.get('/get/:cid', async (req, res) => {
  const cid = req.params.cid;

  const decoder = new TextDecoder()
  let text = ''
  for await (const chunk of node.cat(cid)) {
      text += decoder.decode(chunk, {
      stream: true
    })
  }
  
  console.log("Added file contents:", text);
  res.send({contents: text})
})

app.listen(3001,async ()=>{
    await ipfsCLient()
    console.log('\x1b[32m'," WEBAPP STARTED AT http://localhost:3001");
});
