/// Copyright (C) 2022 Navpreet Singh, All Rights Reserved




'use strict';

import { fileURLToPath } from 'url'
import Path from "path"
import FileSystem from 'fs-extra'  // supports promses

const __filename = fileURLToPath( import.meta.url );
const __dirname = Path.resolve();

import Express from 'express'
import HTTP from 'http'
import CORS from 'cors'

//import Payload from '../server/Result'
//import LevelAPI from 'api'

const PORT = 4000;

class Server {
    #__dirname;
    
    #__filename;

    constructor( api, port = PORT ) {
        

        // this.api = (this.api === undefined ? api : Express());
        this.#__filename = fileURLToPath( import.meta.url );
        this.#__dirname = Path.dirname( this.#__filename ); 

        this.api = Express();
        this.router = Express.Router();
        this.port = port;
        this.title = "Angry Pigs";

        let corsOptions = {
            'allowedHeaders':['Content-Type'],
            'allowedMethods':['GET, POST, OPTIONS, PUT, DELETE'],
            'origin':'*',
            'preflightContinue': true,
        }

        this.api
            .use( Express.json() )
            .use( Express.urlencoded({ extended: false }))
            .use( Express.static( Path.join( this.#__dirname, './')))
            .use( Express.static( Path.join( this.#__dirname, './server/api')));            


        // GET index page
        this.api.get('/', ( request, response ) => {
            response.sendFile(`${Path.join(__dirname, './')}/index.html`, { title: this.title });
        });

        // GET the editor page
        this.api.get('/editor', ( request, response ) => {
            response.sendFile(`${Path.join(__dirname, './')}/editor/editor.html`, { title: this.title });
        });

        this.api.post("/api/save", ( request, response ) => {
            // Pull apart the request, do something here...
            const params = request.params;
            const body = request.body;
            const query = request.query;
            const filename = body["name"];
            const data = JSON.stringify(request.body);

            console.log("./" + body["type"] + "s/" + filename + ".json");
            FileSystem.writeFile("./" + body["type"] + "s/" + filename + ".json", data , function(err){
                if(err){
                    return err;
                }
            })

            console.log("Recieved some data");
            response.send( JSON.stringify( data ));
        });


        this.api.post('/api/levelList' , (req,res) => {
            var payload = [];
            FileSystem.readdir("./levels", (err, files) => {  
                files.forEach(file => {
                  payload.push({"name":file.slice(0,-5), "filename":file})     
                });
                let data = { 
                    "payload" : payload,
                    "error": 0
                }
                res.send(data);     
              });   
        
               
        });  

        this.api.set("port", PORT );
        this.listener = HTTP.createServer( this.api );
        this.listener.listen( PORT );

        this.listener.on("listening", () => { this._handleListenerListening() })
       


        
    }

    corsHandler( request, response ) {
        // CORS Requests send and options request first, this is the response
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        response.sendStatus( 200 );
    }

    _dataPath( userid ) {
        return `${Path.dirname( FileSystem.realpathSync(__filename))}/data/${userid}`
    }

    _handleListenerError( error ) {
        /**
         * Listen on provided port, on all network interfaces.
        */
        if (error.syscall !== 'listen')
            throw error;

        // handle specific listen errors with friendly messages
        let bind = typeof this.port === `string`?`Pipe ${this.port}`:`Port ${this.port}`;
        switch (error.code) {

            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit (1 );
                break;

            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;

            default:
                throw error;
        }
    }

    _handleListenerListening() {

        let addr = this.listener.address();
        let bind = typeof addr === `string`?`pipe ${addr}`:`port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    }

    run() {
        // Create HTTP server.
        this.api.set('port', this.port );

        this.listener = HTTP.createServer( this.api );
        this.listener.listen( PORT );

        this.listener.on('error', error => { this._handleListenerError( error ) });
        this.listener.on('listening', () => { this._handleListenerListening() });
    }
}

const server = new Server();
