let jschema = undefined;

let submit = (errors, values)=>{
    if (errors){
        console.log(errors);
        return;
    }

    $('#res').html("<pre>"+JSON.stringify(values)+"</pre>");
};

let generateForm = ()=>{
    $('#idForm').jsonForm({
        schema: jschema.properties,
/*
        form: [
            "*",
            {
                "key": "description",
                "type": "textarea"
            },
            {
                "type": "submit",
                "title": "Generate Manifest"
            }
        ],
*/
        onSubmit: submit
      });
};


window.addEventListener("load",()=>{

    $.get("api/schema", (data)=>{
        jschema = data;
        console.log(jschema);

        generateForm();
    });


});