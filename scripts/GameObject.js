/// Copyright (C) 2022 Navpreet Singh, All Rights Reserved
'use strict';

export default class GameObject {

    constructor(element$){

        this.model = {
            name: "Strong Box",
            value: "0",
            height: "70",
            width: "70",
            texture: "images/strong-box.jpg",
            mass: "90",
            restitution: "0",
            friction: "1",
            shape: "square"
        };
        if(!element$){
            //fancy JQ stuff to pull classnames, width, height
        }
        
        this.view$ = $(`<div class="box ${this.model.texture}"></div>`);
    }

    placeAt(x=0, y=0, parent$) {
        if (parent$ != undefined)
            parent$.append(this.view$);

        this.model.x = x;
        this.model.y = y;
        this.view$.css("top",`${x}px`).css("left",`${y}px`);
    }

    populate(jsonString = "") {
        const tempGameObject = JSON.parse(jsonString);
        this.model = {...this.model, ...tempGameObject};
        this.view$ = $(`<div class="box ${this.model.texture}"></div>`);

        return this
    }

    serialize (){
        return JSON.stringify(this.model)
    }

    update() {

    }

    render() {
        
    }
}