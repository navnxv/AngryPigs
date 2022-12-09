/// Copyright (C) 2022 Navpreet Singh, All Rights Reserved

import Scene from "./Scene.js"

export default class LevelController {

    constructor( editor$ ) {

        //create new Scene( this.editor$ )
        this.scene = new Scene( editor$ );

        //Serialize the scene
        this.data = this.scene.serialize();
        
        //console.log(this.data);
        
    }

    save() {
        return new Promise((resolve, reject) => {
            console.log(this.data);
            
            $.ajax({
                type: "POST",
                url: "/api/save",
                data:this.data,
                contentType:"application/json"
            });


        });
               

    }
}