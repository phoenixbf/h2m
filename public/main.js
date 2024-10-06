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

        form: [
            //"*",

            // GENERAL
            {
                type: "fieldset",
                title: "General",
                expandable: false,
                items: [
                    {
                        key: "general.title",
                        type: "text"
                    },
                    {
                        key: "general.summary",
                        type: "textarea"
                    },

                    {
                        key: "general.category",
                        type: "checkboxes"
                    },
                ]
            },

            // PROVIDER
            {
                type: "fieldset",
                title: "Provider",
                expandable: false,
                items: [
                    {
                        key: "provider.RI",
                        type: "radiobuttons"
                    },
                    {
                        key: "provider.contact",
                        type: "array"
                    },
                ]
            },

            // FLOWS
            {
                type: "fieldset",
                title: "Flows",
                expandable: false,
                items: [
                    {
                        key: "flows.list",
                        type: "array"
                    },
                ]
            },

            // ACCESS
            {
                type: "fieldset",
                title: "Access",
                expandable: false,
                items: [
                    {
                        key: "access.instances",
                        type: "array"
                    },
                    {
                        key: "access.oas",
                        type: "text"
                    },
                    {
                        key: "access.horizontal",
                        type: "checkbox"
                    },
                    {
                        key: "access.gui",
                        type: "checkbox"
                    },
                    {
                        key: "access.presentation",
                        type: "checkbox"
                    },
                ]
            }, 

            //===============================
            {
                type: "submit",
                title: "Generate Manifest"
            }
        ],

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