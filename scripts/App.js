// Copyright (C) Navpreet Singh, All Rights Reserved

import Scene from "./Scene.js"
import LevelController from "./LevelController.js";

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

        this.initDraggables();
        this.initDropzone();
        this.getLevelNames();
        
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

        $(".box").on("dragstart",event =>{
            //console.log(event);
        })

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
                //duplicate the element dropped if it doesn't have the 'isPlaced class
                const xferData = event.originalEvent.dataTransfer.getData("text");
                
                if(xferData == ""){
                    //console.log(event.currentTarget.lastChild.id);
                    
                    console.log(this.getId);
                    $("#"+this.draggedObject.getId).css("top",event.offsetY - this.draggedObject.y);
                    $("#"+this.draggedObject.getId).css("left",event.offsetX - this.draggedObject.x);
                    return;
                }

                const data = JSON.parse(xferData);
                //const gameObjectSrc = $(`#${data.targetId}`).clone(true);
                
                let newBox = $(`#${data.targetId}`).clone(true);

                let classList = newBox.attr("class");
                let classesArr = classList.split(/\s+/);

                newBox = $("<div draggable='true'></div>");
                $.each(classesArr, function(index, value){
                    newBox.addClass(value);
                })
                newBox.css("top",event.offsetY - data.y);
                newBox.css("left",event.offsetX - data.x);
                newBox.addClass("placed");
                newBox[0].id = "box-" + this.uniqueID;
                this.uniqueID++;
                
              

                $("#edit-window").append( newBox );
            });
    }

    onSave(event) {
        //console.log(event);
        event.preventDefault();

        this.editor$ = $("#edit-window");

        this.saveData(this.editor$);
    }
    
    onSubmit( event ) {
        event.preventDefault();

        this.editor$ = $("#edit-window");
        //console.log("serialized");
        const aScene = new Scene(this.editor$);

        //Serialize the scene
        const payload = aScene.serialize();

        this.saveData(this.editor$);

        
        // const my = this.#__private__;

        // let formData = $(event.target).serializeArray();
        // let formQuery = $(event.target).serialize();

        // let formJSON = JSON.stringify( formData );
        // $.post(`/api/save?${formQuery}`, formJSON )
        //     .then( result => {
        //         // called when the server returns
        //         let responseData = JSON.parse( result );

        //         my.output$.html('made it here');

        //         my.output$.append( result );
        //     });

    }

    saveData(data){
        $.post(`/api/save`, data)
            .then(response =>{
                //handle the response
                const respData = JSON.parse(response);
                if(respData.error)
                    console.log(`ERROR: ${respData} from the server`);
                    console.log(respData);
            });
    }

    getLevelNames(){
        $.post("/api/levelList").then(data => {  
            data = data.payload; 
            console.log("reached");
            data.forEach(function (file) {
                var option = document.createElement('option');
                option.value = file.name; 
                option.innerHTML = file.name;
                $("#options").append(option);
            });
        })
    }

    loadData(event){
        event.preventDefault();
        


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
             //location.reload(); 
    }


}