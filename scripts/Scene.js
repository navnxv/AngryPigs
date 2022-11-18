// Copyright (C) 2022 Navpreet Singh, All Rights Reserved

export default class Scene{
    constructor(editor$){

        this.scene = {
            userid:"pg23navpreet",
            name:"nav",
            type:"level",
            payload:{
                name : $( "input[name = 'name']" ).val(),
                obstacles : $( "input[name = 'obstacles']" ).val(),
                cannons : $( "input[name = 'cannons']" ).val(),
                maxShots : $( "input[name = 'shots']" ).val(),
                background : $( "input[name = 'background']" ).val(),
                oneStar : $( "input[name = 'score-star1']" ).val(),
                twoStar : $( "input[name = 'score-star2']" ).val(),
                threeStar : $( "input[name = 'score-star3']" ).val(),
                //entities : this.getEditorElements(editor$),
            }
        }
        console.log($( "input[name = 'name']" ).val());
        //console.log(this.scene);
    }

    getEditorElements(editor$){
        
        const children = editor$[0].children ;
        let collidables = [];
        let targets = [];

        for(let i = 0; i< children.length; i++){
            if(children[i].classList.contains("strong-box")){
                collidables.push({
                    id : children[i].id,
                    x: children[i].offsetLeft,
                    y : children[i].offsetTop,
                    height: children[i].offsetHeight,
                    width: children[i].offsetWidth,
                    texture: "stone-box",
                    bounce: 0,
                    mass: 50,
                    friction: 1,
                    shape: "square"
                });
            }

            else if(children[i].classList.contains("bird")){
                targets.push({
                    id : children[i].id,
                    wx: children[i].offsetLeft,
                    wy : children[i].offsetTop,
                    height: children[i].offsetHeight,
                    width: children[i].offsetWidth,
                    value: 100,
                })
            }
        }

        const entities = {
            collidables: collidables,
            targets: targets,
        }

        return entities;

    }


    serialize(){
        return JSON.stringify(this.scene);
    }
}