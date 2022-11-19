

export default class ObjectController{
    constructor(){

        this.data = {
            type : "object",
            name : $( `#objOptions`).val(),
            value : $( "input[name = 'obj-value']" ).val(),
            height : $( "input[name = 'obj-height']" ).val(),
            width : $( "input[name = 'obj-width']" ).val(),
            texture : $( "input[name = 'obj-texture']" ).val(),
            mass : $( "input[name = 'obj-mass']" ).val(),
            restitution : $( "input[name = 'obj-rest']" ).val(),
            friction : $( "input[name = 'obj-friction']" ).val(),
            shape : $( "input[name = 'obj-shape']" ).val(),
            
        }

       
        
    }

    saveObject(){
        return new Promise((resolve, reject) => {
            //console.log(this.data);
            $.post(`/api/saveObj`, this.data)
            .then(response =>{
                //handle the response
                const respData = response;
                //console.log(respData);
                if(response.error)
                    console.log(`ERROR: ${respData} from the server`);
                resolve(respData);
            })
            .catch( error => reject( error ));
            


        });
    }

    serialize(){
        return JSON.stringify(this.data);
    }

}

