/// Copyright (C) 2022 Navpreet Singh, All Rights Reserved


export default class LevelController {

    constructor( editor$ ) {

        // create new Scene( this.editor$ )
        //this.scene = new Scene( editor$ );

        // Serialize the scene
        //this.payload = this.scene.serialize();
        this.options = {
            userid: "pg23navpreet", 
            name: $( "input[name = 'name']" ).val(),   
            type: "level",      
            payload: {
                "name" : $( "input[name = 'name']" ).val(),
                "obstacles" : $( "input[name = 'obstacles']" ).val(),
                "cannons" : $( "input[name = 'cannons']" ).val(),
                "maxShots" : $( "input[name = 'shots']" ).val(),
                "background" : $( "input[name = 'background']" ).val(),
                "oneStar" : $( "input[name = 'score-star1']" ).val(),
                "twoStar" : $( "input[name = 'score-star2']" ).val(),
                "threeStar" : $( "input[name = 'score-star3']" ).val()   
            }
        };
    }

    save() {
        return new Promise((resolve, reject) => {

            $.post(`/api/save`, this.options)
            .then(response =>{
                //handle the response
                const respData = JSON.parse(response);
                console.log(response);
                if(respData.error)
                    console.log(`ERROR: ${respData} from the server`);
                resolve(respData);
            })
            .catch( error => reject( error ));
            

        });
               

    }
}