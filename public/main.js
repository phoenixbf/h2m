let jschema = undefined;
let dlink = undefined;

let submit = (errors, values)=>{
    if (errors){
        console.log(errors);
        return;
    }
    let ri = "";
    let title = "";

    if (!values.provider || !values.provider.RI) return;
    if (!values.general || !values.general.title) return;

    ri = values.provider.RI.toLowerCase();
    ri = ri.replace(/[^a-zA-Z ]/g, "");

    title = values.general.title.toLowerCase();;
    title = title.replace(/[^a-zA-Z ]/g, "");
    title = title.replace(/\s+/g, '');

    let srvid = ri + "-" + title;
    console.log(srvid);

    let strdata = JSON.stringify(values);

    $('#res').html("<pre>"+strdata+"</pre>");

    //downloadAsJSON(srvid+".h2iosc.service.json", strdata);

    if (title.length < 2) return;
    if (ri.length < 2) return;

    publishManifest(srvid, values, ()=>{
        window.open("/api/manifests/"+srvid, '_blank');
    });
};

let downloadAsJSON = (filename, data)=>{
    dlink.href = URL.createObjectURL( new Blob( [ data ], { type: 'text/plain' } ) );
    dlink.download = filename;
    dlink.click();
};

let publishManifest = (manifestid, data, onSuccess)=>{
    let O = {};
    O.data = data;
    O.mid  = manifestid;

    fetch("/api/manifests", {
        method: "POST",
        body: JSON.stringify(O),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(r => {
        if (r) onSuccess();
        else console.log("Manifest publication failed!");
    });
};

/*
    FORM
==============================*/
let formGeneral = {
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

        {
            key: "general.domain",
            type: "array",
            items:{
                key: "general.domain[]",
                title: "Research domain {{idx}}"
            }
        },

        {
            key: "general.keywords",
            type: "array",
            type: "checkboxes",
/*
            items:{
                key: "general.keywords[]",
                title: "Keyword {{idx}}"
            }
*/
        },

        {
            key: "general.website",
            type: "text"
        },
    ]
};

let formProvider = {
    type: "fieldset",
    title: "Provider",
    expandable: true,
    items: [
        {
            key: "provider.RI",
            type: "radiobuttons",
            id: "serviceRI",
            activeClass: "btn-success",
            onChange: (evt)=>{
                let value = $(evt.target).val();

                $("#imgRI").remove();
                $("#serviceRI").append("<div id='imgRI' style='display:block'><img src='res/"+value+".png'></div>");
            }

/*
            type: "imageselect",
            imageWidth: 300,
            imageHeight: 100,
            imageButtonClass: "btn-inverse",
            imagePrefix: "res/",
            imageSuffix: ".png",
            //imageSelectorColumns: 4,
            imageSelectorTitle: "RI"
*/
        },
/*
        {
            key: "provider.OU",
            type: "radios"
        },
*/
        {
            key: "provider.contact",
            type: "array",
            items:{
                key: "provider.contact[]",
                title: "Mail contact {{idx}}"
            }
        },
    ]
};

let formFlows = {
    type: "fieldset",
    title: "I/O Flows",
    expandable: true,
    items: [
        {
            key: "flows.list",
            type: "array",
            items: {
                key: "flows.list[]",
                title: "Flow #{{idx}}",
                //htmlClass: "flowbox"
/*
                items: {
                    key: "flows.list[].input[]",
                    type: "checkboxes"
                }
*/
            }
        },
    ]
};

let formAccess = {
    type: "fieldset",
    title: "Access",
    expandable: true,
    items: [
        {
            key: "access.instances",
            type: "array",
            //htmlClass: "...",
            items:{
                key: "access.instances[]",
                title: "Access point {{idx}}"
            }
        },
        {
            key: "access.oad",
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
};

let formTech = {
    type: "fieldset",
    title: "Technology",
    expandable: true,
    items: [
        {
            key: "technology.trl",
            type: "range",
            step: 1,
            indicator: true
        },
        {
            key: "technology.srl",
            type: "range",
            step: 1,
            indicator: true
        },
        {
            key: "technology.orl",
            type: "range",
            step: 1,
            indicator: true
        },
        {
            key: "technology.lrl",
            type: "range",
            step: 1,
            indicator: true
        },

        {
            key: "technology.repositories",
            type: "array",
            //htmlClass: "...",
            items:{
                key: "technology.repositories[]",
                title: "Repository {{idx}}"
            }
        },
    ]
};

let generateForm = (dvalues)=>{
    let val = {};
    if (dvalues) val = dvalues;

    $('#idForm').jsonForm({
        schema: jschema.properties,

        value: val,

        form: [
            //"*",
/*
            {
                type:"fieldset",
                title:"Example of Tabs",
                items:[
                    {
                        type:"tabs",
                        id:"navtabs",
                        items: [
                            formGeneral,
                            formProvider
                        ]
                    }
                ]
            },
*/

            // GENERAL
            formGeneral,

            // PROVIDER
            formProvider,

            // FLOWS
            formFlows,

            // ACCESS
            formAccess,

            formTech,

            //===============================
            {
                type: "actions",
                items: [
                    {
                        type: "help",
                        helpvalue: "<strong>Click on <em>Generate Manifest</em></strong> when you're done"
                    },
                    {
                        type: "submit",
                        title: "Generate Service Manifest"
                    },
    /*
                    {
                        type: "button",
                        title: "Publish Service Manifest",
                        onClick: publishManifest
                    }
    */
                ]
            }
        ],

        onSubmit: submit
      });
};


window.addEventListener("load",()=>{

    dlink = document.createElement('a');
    dlink.style.display = 'none';
    document.body.appendChild( dlink ); // Firefox workaround, see #6594

    let params = new URLSearchParams( window.location.search );

    $.get("api/schema", (data)=>{
        jschema = data;
        console.log(jschema);

        if (params.get("m")){
            let M = String(params.get("m"));

            fetch("/api/manifests/"+M, {
                method: "GET"
            })
            .then(response => response.json()) 
            .then(r => {
                generateForm(r);
            });
        }
        else generateForm();
    });


});