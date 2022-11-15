// Copyright (C) 2022 Navpreet Singh, All Rights Reserved

export default class Scene{
    constructor(editor$){
        
        this.edit = editor$;
        this.scene = {
            "name" : $( "input[name = 'name']" ).val(),
            "obstacles" : $( "input[name = 'obstacles']" ).val(),
            "cannons" : $( "input[name = 'cannons']" ).val(),
            "maxShots" : $( "input[name = 'shots']" ).val(),
            "background" : $( "input[name = 'background']" ).val(),
            "oneStar" : $( "input[name = 'score-star1']" ).val(),
            "twoStar" : $( "input[name = 'score-star2']" ).val(),
            "threeStar" : $( "input[name = 'score-star3']" ).val(),
            "enitities" : {
                "collidables" : [{

                }]
            }
        }

    }

    serialize(){
        return JSON.stringify(this.scene);
    }
}