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
        this.editor$ = $("#edit-window");
        // connect a handler for the submit event on the form
        $( "input[name = 'action']" ).on("click", event => this.onSubmit( event ));
        $("#save-btn").on("click", event => this.onSave(event));
        $("#load-btn").on("click", event => this.onLevelLoad(event));
        $("#save-obj-btn").on("click", event => this.onSaveObj(event));
        $("#load-obj-btn").on("click", event => this.onLoadObj(event));

        this.initDraggables();
        this.initDropzone();
        this.getUserNames();
        
        $("#user-options").change(event => this.getLevelNames());
        
        
        $(document).on("dragstart", event => {
            this.draggedObject = {
                getClass: event.target.classList,
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
                    
                    console.log(xferData);
                    $("#" + this.draggedObject.getId).css("top",event.offsetY - this.draggedObject.y);
                    $("#" + this.draggedObject.getId).css("left",event.offsetX - this.draggedObject.x);

                    return;
                }
                
                const data = JSON.parse(xferData);
                
                let newBox = $(`#${data.targetId}`).clone(true);

                let classList = newBox.attr("class");
                let classesArr = classList.split(/\s+/);

                // Check if catapult already exist
                if($(`#edit-window`).has("#catapult-1").length && this.draggedObject.getClass.contains("catapult"))
                    return;
                

                newBox = $("<div draggable='true'></div>");
                $.each(classesArr, (index, value)=>{
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
                else if(classesArr[1] == "catapult"){
                    newBox[0].id = "catapult-1";
                }

                this.uniqueID++;
                $("#edit-window").append( newBox );
                
            });

        $("#del-window")
            .on("dragover", event => {
                //prevent the default ghosting issue
                event.preventDefault();
            })
            .on("drop", event=>{
                const delId = this.draggedObject.getId;

                if(!(delId == "bird" || delId == "catapult" || delId == "strong-box"))
                    $(`#${delId}`).remove();
                
                if(this.draggedObject.getClass.contains("catapult")){
                    if($(`#catList`).length == 0){
                        $(`#objectList`).append(`<li id = "catList"><div id="catapult" class="box catapult" draggable="true"></div></li>`);
                        $(`#catapult`).draggable('enable');
                    }
                }
            })
    }

    onSave(event) {
        //console.log(event);
        event.preventDefault();
        this.savingData(this.editor$);
    }

    // Saving objects
    onSaveObj(event){
        event.preventDefault();
        this.savingObject();

        const editedObj =  "." + ($( `#objOptions`).val()).toLowerCase();
        $(editedObj).css("height", $("input[name = 'obj-height']").val());
        $(editedObj).css("width", $("input[name = 'obj-width']").val());
        this.resetHeightWidth("#bird");
        this.resetHeightWidth("#box-1");
        this.resetHeightWidth("#catapult"); 
    }

    resetHeightWidth(id){
        $(id).css("height", 100);
        $(id).css("width", 100);
    }


    // Loading Objects
    onLoadObj(event){
        event.preventDefault();
        const getClass = ($( `#objOptions`).val()).toLowerCase();
        console.log(getClass);

        console.log($(".box").hasClass(getClass));

        let data = {
            name : $( `#objOptions`).val(),
            type: "object"
        }

        $.post("/api/loadObj", (data))
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

    getUserNames(){
        $.post("/api/userList").then(data => {  
            data = data.payload; 
            
            data.forEach((file) =>  {
                var option = document.createElement('option');
                option.value = file.name; 
                option.innerHTML = file.name;
                $("#user-options").append(option);
            });
        });
    }

    getLevelNames(){
        $("#options").find("option").remove();

        const username = $( `#user-options`).val();

        const usrData = {
            user : username,
        }
        $.post("/api/levelList",usrData).then(data => {  
            data = data.payload; 
            console.log("reached");
            data.forEach((file) => {
                var option = document.createElement('option');
                option.value = file.name; 
                option.innerHTML = file.name;
                $("#options").append(option);
            });
        }); 
        this.getObjectNames(usrData);
    }

    getObjectNames(usrData){
        $("#objOptions").find("option").remove();

        $.post("/api/objectList",usrData).then(data => {  
            data = data.payload; 
            data.forEach((file) => {
                var option = document.createElement('option');
                option.value = file.name; 
                option.innerHTML = file.name;
                $("#objOptions").append(option);
            });
        });    
    }


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

        let object = new ObjectController();
        console.log("saving")
        object.saveObject()
            .then( response => {
                alert(`Object saved`);
            })
            .catch( error => {
                alert(`Object not saved ${error}`);
            });
    }

    // Loading level on the load data button click
    onLevelLoad(event){
        event.preventDefault()
    
        let data = {
            user : $(`#user-options`).val(),
            name : $( `#options`).val(),
            type: "level"
        }

        $.post("/api/loadLevel", data).then(data => {
            const objects = data.payload;
            
            $( "input[name = 'projectiles']" ).val(objects.projectiles);
            $( "input[name = 'background']" ).val(objects.background);
            $( "input[name = 'score-star1']" ).val(objects.oneStar);
            $( "input[name = 'score-star2']" ).val(objects.twoStar);
            $( "input[name = 'score-star3']" ).val(objects.threeStar);

            this.editor$.empty();

            const collidables = objects.entities.collidables;
            const targets = objects.entities.targets;

            let newCatapult = $("<div draggable='true'></div>");
            newCatapult.attr("id", "catapult-1");
            newCatapult.css("top", objects.cannon.y);
            newCatapult.css("left", objects.cannon.x);

            newCatapult.addClass("box");
            newCatapult.addClass("catapult");
            newCatapult.addClass("placed");

            this.editor$.append(newCatapult);

            // Adding collidables to the editor
            $.each(collidables, (index, value)=>{

                let newCollidable = $("<div draggable='true'></div>");
                newCollidable.attr("id", value.id);
                newCollidable.css("height", value.height);
                newCollidable.css("width", value.width);
                newCollidable.css("top",value.y);
                newCollidable.css("left", value.x);

                newCollidable.addClass("box");
                newCollidable.addClass(value.texture);
                newCollidable.addClass("placed");

                this.editor$.append(newCollidable);
            });

            $.each(targets, (index, value)=>{

                let newCollidable = $("<div draggable='true'></div>");
                newCollidable.attr("id", value.id);
                newCollidable.css("height", value.height);
                newCollidable.css("width", value.width);
                newCollidable.css("top",value.wy);
                newCollidable.css("left", value.wx);

                newCollidable.addClass("box");
                newCollidable.addClass(value.texture);
                newCollidable.addClass("placed");

                this.editor$.append(newCollidable);
            });

        });
    }
}