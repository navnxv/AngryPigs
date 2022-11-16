/// Copyright (C) 2022 Navpreet Singh, All Rights Reserved

import Scene from "./Scene.js"

export default class LevelController {

    constructor( editor$ ) {

        //create new Scene( this.editor$ )
        this.scene = new Scene( editor$ );

        //Serialize the scene
        this.data = JSON.stringify(this.scene);
        this.save();
    }

    save() {
        return new Promise((resolve, reject) => {
            //console.log(this.data);
            $.post(`/api/save`, this.data)
            .then(response =>{
                //handle the response
                const respData = this.data;
                console.log(this.data);
                if(response.error)
                    console.log(`ERROR: ${respData} from the server`);
                resolve(JSON.stringify(respData));
            })
            .catch( error => reject( error ));
            

        });
               

    }
}