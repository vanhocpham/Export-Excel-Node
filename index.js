
const os = require("os");
const cluster = require("cluster");
const fs = require("fs");
const path = require( "path" );
const exportExcel = require("./lib/export");


if (cluster.isMaster) {
  const n_cpus = os.cpus().length;
  console.log(`Forking ${n_cpus} CPUS`);
  for (let i = 0; i < n_cpus; i++) {
      cluster.fork();
  }
} else {
  const express = require("express");
  const app = express();
  const dotenv = require("dotenv");

  dotenv.config({ "path": ".env" });

  const port = process.env.PORT;
  const { spawn } = require("child_process");
  const pid = process.pid;
  const server = app.listen(port, () => {
      console.log(`Server: process ${pid} is running on port: ${port}`);
  });

  app.get("/", (req, res, next) => {
      for (var i = 0; i < 2e6; i++) { }
      res.send(`process ${pid} hello world`);
  });

  app.get( "/api/export", async ( req, res ) => {
    let exportDir = "Export",
    filename = "Export",
    today = `${( new Date() ).getDate() }-${ ( new Date() ).getMonth() + 1 }-${ ( new Date() ).getFullYear()}`;

    //The fs.promises API is experimenta
    const fileContents = await fs.promises.readFile("./data.json"),
      data = JSON.parse(fileContents);
      
    filename += `-${today}`;
    if ( !fs.existsSync( exportDir ) ) {
    fs.mkdir( "Export", ( e ) => {
      console.log( e );
    } );
    }

    fs.readdirSync( exportDir ).forEach( ( file ) => {
    if ( path.basename( file ) === filename ) {
        filename += `-${( new Date() ).getTime()}`;
    }
    } );
    filename = path.join( exportDir, filename );
    filename = exportExcel( JSON.parse( JSON.stringify( data ) ), req.query.type, { "filename": filename } );

    res.download( filename );
  } );

}