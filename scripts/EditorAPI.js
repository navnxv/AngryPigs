/// Copyright (C) 2022 Navpreet Singh, All Rights Reserved
'use strict';

import Express from 'express'
import Result from './Result.js';
import FileSystem from 'fs-extra';

const Router = Express.Router();

Router.post('/get_level_list', ( request, response ) => {
    // usage: post('/api/level/get_level_list, payload )...
});

Router.post('/get_object_list/:userid?', ( request, response ) => {
    // usage: post('/api/level/get_level_list/shenshaw, payload )...
    let result = new Result( 201, `Error: missing list or params`);
    let params = {
        ...request.params,      // data from the client in the uri like userid
        ...request.query,       // data from the client query ?a=b&c=d&...
        ...request.body         // JSON data from the client
    }
    // get list of files in folder using userid
    let fileList = FileSystem.readDirSync(`./data/${params.userid}/objects`);
    if (fileList.length < 1) {
        result.msg = "No files found";
        result.error = 202;
        response.send( result.serialize() )
        return;
    }

    // prune list to just json files
    let jsonFileList = [];
    // add files to result,
    for (let entry of fileList) {
        if (entry.endsWith(".json")) {
            jsonFileList.push( entry.replace(".json",""))
        }
    }
    result.payload = jsonFileList;

    // reset result error code to no error
    result.msg = "No error";
    result.error = 0;

    // send result back to client
    response.send( result.serialize() )
});


Router.post('/load', ( request, response ) => {
    // usage: post('/api/level/get_level_list, payload )...
});

Router.post('/save', ( request, response ) => {
    // usage: post('/node_modulesapi/level/get_level_list, payload )...
});

export default Router;