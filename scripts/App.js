// Copyright (C) Navpreet Singh, All Rights Reserved

import Scene from "./Scene.js"
import LevelController from "./LevelController.js";
import ObjectController from "./ObjectController.js";



export default class App{

    #__private__;
    uniqueID = 2;
    constructor(){

        const my = this.#__private__ = {
            output$: $("#output")
        };
        my.output$ = $("#output");

        // connect a handler for the submit event on the form
        $( "input[name = 'action']" ).on("click", event => this.onSubmit( event ));
        $("#save-btn").on("click", event => this.onSave(event));
        $("#load-btn").on("click", event => this.loadData(event));
        $("#save-obj-btn").on("click", event => this.onSaveObj(event));
        $("#load-obj-btn").on("click", event => this.onLoadObj(event));

        this.initDraggables();
        this.initDropzone();
        this.getLevelNames();
        this.getObjectNames();

        
        $(document).on("dragstart", event => {
            this.draggedObject = {
                getId : event.target.id,
                x : event.offsetX,
                y : event.offsetY,
            }
        });


    }

    initDraggables() {

        $(".box")
            .on("dragstart", event => {
                //attach my id here to element and transfer it
                const data = {
                    targetId: event.target.id,
                    x : event.offsetX,
                    y : event.offsetY,
                };
                const xferData = JSON.stringify(data);

                event.originalEvent.dataTransfer.setData("text", xferData);
                event.originalEvent.dataTransfer.effectAllowed = "move";
            })
            .on("dropover", event => {
                event.preventDefault();
            } );
            

            
    }

    initDropzone() {

        $("#edit-window")
            .on("dragover", event => {
                //prevent the default ghosting issue
                event.preventDefault();
            })
            .on("drop", event => {
                event.preventDefault();

                if(event.originalEvent.toElement.id != "edit-window"){
                    return;
                }
                const xferData = event.originalEvent.dataTransfer.getData("text");
                
                if(xferData == ""){
                    //console.log(event.currentTarget.lastChild.id);
                    
                    console.log(this.getId);
                    $("#" + this.draggedObject.getId).css("top",event.offsetY - this.draggedObject.y);
                    $("#" + this.draggedObject.getId).css("left",event.offsetX - this.draggedObject.x);
                    return;
                }

                const data = JSON.parse(xferData);
                //const gameObjectSrc = $(`#${data.targetId}`).clone(true);
                
                let newBox = $(`#${data.targetId}`).clone(true);

                //console.log(newBox);
                let classList = newBox.attr("class");
                let classesArr = classList.split(/\s+/);

                newBox = $("<div draggable='true'></div>");
                $.each(classesArr, function(index, value){
                    newBox.addClass(value);
                })
                newBox.css("top",event.offsetY - data.y);
                newBox.css("left",event.offsetX - data.x);
                newBox.css("height", $("input[name = 'obj-height']").val());
                newBox.css("width", $("input[name = 'obj-width']").val());

                newBox.addClass("placed");
                if(classesArr[1] == "bird"){
                    newBox[0].id = "bird-" + this.uniqueID;
                }
                else if(classesArr[1] == "strong-box"){
                    newBox[0].id = "box-" + this.uniqueID;

                }
                this.uniqueID++;
                $("#edit-window").append( newBox );
            });
    }

    onSave(event) {
        //console.log(event);
        event.preventDefault();

        this.editor$ = $("#edit-window");
        this.savingData(this.editor$);
    }

    // Saving objects
    onSaveObj(event){
        event.preventDefault();
        this.savingObject();

        const editedObj =  "." + ($( `#objOptions`).val()).toLowerCase();
        $(editedObj).css("height", $("input[name = 'obj-height']").val());
        $(editedObj).css("width", $("input[name = 'obj-width']").val());

        console.log("here");
        this.resetHeightWidth("#bird");
        this.resetHeightWidth("#box-1");
        this.resetHeightWidth("#catapult"); 
    }

    resetHeightWidth(id){
        $(id).css("height", 100);
        $(id).css("width", 100);
    }


    onLoadObj(event){
        event.preventDefault();
        const getClass = ($( `#objOptions`).val()).toLowerCase();
        console.log(getClass);

        console.log($(".box").hasClass(getClass));

        let data = {
            name : $( `#objOptions`).val(),
            type: "object"
        }

        $.post("/api/load", (data))
        .then(data =>{
            const newData = data.payload; 
            
            $( "input[name = 'obj-value']" ).val(newData.value);
            $( "input[name = 'obj-height']" ).val(newData.height);
            $( "input[name = 'obj-width']" ).val(newData.width);
            $( "input[name = 'obj-texture']" ).val(newData.texture);
            $( "input[name = 'obj-mass']" ).val(newData.mass);
            $( "input[name = 'obj-rest']" ).val(newData.restitution);
            $( "input[name = 'obj-friction']" ).val(newData.friction);
            $( "input[name = 'obj-shape']" ).val(newData.shape);

            


            
                
            });
     
    }


    onSubmit( event ) {
        event.preventDefault();

        this.editor$ = $("#edit-window");
        //console.log("serialized");
        const aScene = new Scene(this.editor$);

        //Serialize the scene
        const payload = aScene.serialize();

        //this.saveData(this.editor$);

    }

    getLevelNames(){
        $.post("/api/levelList").then(data => {  
            data = data.payload; 
            
            data.forEach((file) =>  {
                var option = document.createElement('option');
                option.value = file.name; 
                option.innerHTML = file.name;
                $("#options").append(option);
            });
        });
    }

    getObjectNames(){
        $.post("/api/objectList").then(data => {  
            data = data.payload; 
            console.log("reached");
            data.forEach((file) => {
                var option = document.createElement('option');
                option.value = file.name; 
                option.innerHTML = file.name;
                $("#objOptions").append(option);
            });
        });    }


    savingData(data){
        let level = new LevelController( data );
        level.save()
            .then( response => {
                alert(`Level saved`);
            })
            .catch( error => {
                alert(`Level not saved ${error}`);
            });
            
    }
    
    savingObject(){

        let object = new ObjectController( );

        
        


        object.saveObject()
            .then( response => {
                alert(`Object saved`);
            })
            .catch( error => {
                alert(`Object not saved ${error}`);
            });
    }


}