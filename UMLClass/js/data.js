/**
 * handle events
 *
 */
var diagramUML = document.getElementById("diagramUML");
var chooseBtn = document.getElementById("chooseBtn");
var noteBtn = document.getElementById('noteBtn');
var screenCodeBtn = document.getElementById("screenCodeBtn");
var explainContainer = document.getElementById("explain-container");
var closeExplainContainer = document.getElementById("close-explain-container");
var defineCodeContent = document.getElementById('define-code-content');
var javaCodeContainer = document.getElementById("java-code-container");
var haveCodeMirror = false;
chooseBtn.onclick = function () {
    defineCodeContent.style.display = 'flex';
    javaCodeContainer.style.display = 'none';
}

screenCodeBtn.onclick = function () {
    javaCodeContainer.style.display = 'block';
    defineCodeContent.style.display = 'none';
    if (!haveCodeMirror) {
        CodeMirror.fromTextArea(document.getElementById("java-code-2"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: 'text/x-java',
            theme: 'icecoder'
        });
        haveCodeMirror = true;
    }
}

noteBtn.onclick = function () {
    explainContainer.style.display = 'block';
}

closeExplainContainer.onclick = function () {
    explainContainer.style.display = 'none';
}

/**
 * get rq, nodedata, linkdata
 * 
 * **/
var myDiagram = document.getElementById('myDiagramDiv');
var loadDiagram = document.getElementById('loadDiagram');

loadDiagram.addEventListener('click', async function () {
    // init value when loading diagram again
    myDiagram.div = null;
    var rq = '';
    var nodedata = '';
    var linkdata = '';
    var problemId = document.getElementById('problem_id').value;
    var url1 = 'http://192.168.1.79:5559/requirements/problems/' + problemId;
    var url2 = 'http://192.168.1.79:5559/requirements/getDiagram/' + problemId;
    try {
        var response1 = await fetch(url1, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZFwiOjMsXCJyb2xlc1wiOltcIkFETUlOXCJdfSIsImlhdCI6MTU2NTg1NzQwOCwiZXhwIjoxNTY2NDYyMjA4fQ.Dy0z0ojMNxlk38rxGu8gS4KDviM2B8NCsOxuYhewEGbN5qo-sxugp7Ay6nVW5LHcwOduX7HR3k83fKxCPDAiVQ'
            }
        });
        rq = await response1.json();

        var response2 = await fetch(url2, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZFwiOjMsXCJyb2xlc1wiOltcIkFETUlOXCJdfSIsImlhdCI6MTU2NTg1NzQwOCwiZXhwIjoxNTY2NDYyMjA4fQ.Dy0z0ojMNxlk38rxGu8gS4KDviM2B8NCsOxuYhewEGbN5qo-sxugp7Ay6nVW5LHcwOduX7HR3k83fKxCPDAiVQ'
            }
        });
        var data = await response2.json();

        nodedata = data.classes;
        linkdata = data.relationships;

        diagramUML.style.display = "block";
    }
    catch (err) {
        console.log(err)
    }

    /**
     * node
     **/
    var classId;
    var rqId;
    var typeSel;
    var inputs = document.querySelector("#select");
    var listRqField = ["final", "modifier", "static", "type"];
    var listRqMethod = ["abstract", "modifier", "static", "type"];
    var listRqClass = ["interface", "abstract", "final", "static"];

    var mergeList = listRqField.concat(listRqMethod.filter(function (item) {
        return listRqField.indexOf(item) < 0;
    }));

    for (let i = 0; i < mergeList.length; i++) {
        inputs.querySelector("#r-" + mergeList[i]).addEventListener("change", function () {
            changeVal(mergeList[i]);
        })
    }

    function changeVal(rq) {
        var item = findNode(classId, rqId);
        if (item) {
            console.log(item[rq]);
            if (item[rq] == 1) {
                item[rq] = 0;
            } else {
                item[rq] = 1;
            }
        }
        // console.log("Changed: ", item);
    }

    function findNode(id1, id2) {
        var node;
        rq.forEach(element => {
            if (element.node_id == id1) {
                node = element;
            }
        });
        node[typeSel + "_requirements"].forEach(elm => {
            if (elm.node_id == id2) {
                node = elm;
            }
        });
        return node;
    }

    function displaySelect(node) {
        if (typeSel != "method") {
            for (let i = 0; i < listRqMethod.length; i++) {
                document.querySelector("label[for='r-" + listRqMethod[i] + "']").style.display = "none";
            }
            for (let i = 0; i < listRqField.length; i++) {
                document.querySelector("label[for='r-" + listRqField[i] + "']").style.display = "block";
                document.querySelector("#r-" + listRqField[i]).checked = parseInt(node[listRqField[i]]);
            }
        } else {
            for (let i = 0; i < listRqField.length; i++) {
                document.querySelector("label[for='r-" + listRqField[i] + "']").style.display = "none";
            }
            for (let i = 0; i < listRqMethod.length; i++) {
                document.querySelector("label[for='r-" + listRqMethod[i] + "']").style.display = "block";
                document.querySelector("#r-" + listRqMethod[i]).checked = parseInt(node[listRqMethod[i]]);
            }
        }

    }

    function selectItem(method, ele, name) {
        typeSel = method ? "method" : "field";
        let title = "<b>" + name + "</b>";
        document.querySelector("#select-header").innerHTML = title;
        rqId = ele.id;
        node = findNode(classId, rqId);
        // console.log("Node:", node);
        displaySelect(node);
        // console.log(typeSel);
    }
    function loadClass() {
        var node;
        rq.forEach(element => {
            if (element.node_id == classId) {
                node = element;
            }
        });
        for (let i = 0; i < listRqClass.length; i++) {
            document.querySelector("#r-" + listRqClass[i] + "-class").checked = parseInt(node[listRqClass[i]]);
        }

    }
    changeClass();
    function changeClass() {
        for (let i = 0; i < listRqClass.length; i++) {
            document.querySelector("#r-" + listRqClass[i] + "-class").addEventListener("change", function () {
                var node;
                rq.forEach(element => {
                    if (element.node_id == classId) {
                        node = element;
                    }
                });
                if (node[listRqClass[i]] == 1) {
                    node[listRqClass[i]] = 0;
                } else {
                    node[listRqClass[i]] = 1;
                }
                document.querySelector("#r-" + listRqClass[i] + "-class").checked = node[listRqClass[i]];
            });
        }
    }

    init();
    function init() {
        if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make;

        myDiagram =
            $(go.Diagram, "myDiagramDiv",
                {
                    "undoManager.isEnabled": true,
                    layout: $(go.TreeLayout,
                        { // this only lays out in trees nodes connected by "generalization" links
                            angle: 90,
                            path: go.TreeLayout.PathSource,  // links go from child to parent
                            setsPortSpot: false,  // keep Spot.AllSides for link connection spot
                            setsChildPortSpot: false,  // keep Spot.AllSides
                            // nodes not connected by "generalization" links are laid out horizontally
                            arrangement: go.TreeLayout.ArrangementHorizontal
                        })
                });

        // show visibility or access as a single character at the beginning of each property or method
        function convertVisibility(v) {
            switch (v) {
                case "public": return "+";
                case "private": return "-";
                case "protected": return "#";
                case "package": return "~";
                case "default": return " ";
                default: return v;
            }
        }

        // the item template for properties
        var propertyTemplate =
            $(go.Panel, "Horizontal",
                // property visibility/access
                $(go.TextBlock,
                    { isMultiline: false, editable: false, width: 12 },
                    new go.Binding("text", "visibility", convertVisibility)),
                // property name, underlined if scope=="class" to indicate static property
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "name").makeTwoWay(),
                    new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
                // property type, if known
                $(go.TextBlock, "",
                    new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "type").makeTwoWay()),
                // property default value, if any
                $(go.TextBlock,
                    { isMultiline: false, editable: false },
                    new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; }))
            );

        // the item template for methods
        var methodTemplate =
            $(go.Panel, "Horizontal",
                // method visibility/access
                $(go.TextBlock,
                    { isMultiline: false, editable: false, width: 12 },
                    new go.Binding("text", "visibility", convertVisibility)),
                // method name, underlined if scope=="class" to indicate static method
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "name").makeTwoWay(),
                    new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
                // method parameters
                $(go.TextBlock, "()",
                    // this does not permit adding/editing/removing of parameters via inplace edits
                    new go.Binding("text", "parameters", function (parr) {
                        var s = "(";
                        for (var i = 0; i < parr.length; i++) {
                            var param = parr[i];
                            if (i > 0) s += ", ";
                            s += param;
                        }
                        return s + ")";
                    })),
                // method return type, if any
                $(go.TextBlock, "",
                    new go.Binding("text", "return_type", function (t) { return (t ? ": " : ""); })),
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding("text", "return_type").makeTwoWay())
            );

        // this simple template does not have any buttons to permit adding or
        // removing properties or methods, but it could!
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                {
                    locationSpot: go.Spot.Center,
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides
                },
                $(go.Shape, { fill: "lightyellow" }),
                $(go.Panel, "Table",
                    { defaultRowSeparatorStroke: "black" },
                    // header
                    $(go.TextBlock,
                        {
                            row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
                            font: "bold 12pt sans-serif",
                            isMultiline: false, editable: true
                        },
                        new go.Binding("text", "name").makeTwoWay()),
                    // properties
                    $(go.TextBlock, "Properties",
                        { row: 1, font: "italic 10pt sans-serif" },
                        new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
                    $(go.Panel, "Vertical", { name: "PROPERTIES" },
                        new go.Binding("itemArray", "fields"),
                        new go.Binding("fill", "color"),
                        {
                            row: 1, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: "lightyellow",
                            itemTemplate: propertyTemplate
                        }
                    ),
                    $("PanelExpanderButton", "PROPERTIES",
                        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })),
                    // methods
                    $(go.TextBlock, "Methods",
                        { row: 2, font: "italic 10pt sans-serif" },
                        new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
                    $(go.Panel, "Vertical", { name: "METHODS" },
                        new go.Binding("itemArray", "methods"),
                        {
                            row: 2, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: "lightyellow",
                            itemTemplate: methodTemplate
                        }
                    ),
                    $("PanelExpanderButton", "METHODS",
                        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
                )
            );

        //event 
        /**
         * Author: Cuong Tran
        **/
        myDiagram.addDiagramListener("ObjectSingleClicked",
            function (e) {
                var part = e.subject.part;
                classId = part.data.key;
                loadClass();
                if (!(part instanceof go.Link)) {
                    console.log(part.data);
                    document.querySelector("#obj-header").innerHTML = "<b> Object: " + part.data.name + "</b>";
                    document.querySelector("#obj-properties").innerHTML = "";
                    part.data.fields.forEach(e => {
                        let node = document.createElement("span");
                        node.className = "obj-item";
                        node.innerHTML = e.name + ': ' + e.type;
                        document.querySelector("#obj-properties").appendChild(node);
                        node.addEventListener("click", function () {
                            selectItem(false, e, node.innerHTML);
                        });

                    });
                    document.querySelector("#obj-method").innerHTML = "";
                    part.data.methods.forEach(e => {
                        let par = "(";
                        if (e.parameters.length > 0) par += e.parameters[0];
                        for (let index = 0; index < e.parameters.length; index++) {
                            par += ", " + e.parameters[index];

                        }
                        par += ")";

                        let node = document.createElement("span");
                        node.className = "obj-item";
                        node.innerHTML = e.name + par + ': ' + (e.return_type.length > 0 ? e.return_type : "void");
                        document.querySelector("#obj-method").appendChild(node);
                        node.addEventListener("click", function () {
                            selectItem(true, e, node.innerHTML);
                        });

                    });
                }
            });

        function convertIsTreeLink(r) {
            return r === "generalization";
        }

        function convertFromArrow(r) {
            switch (r) {
                case "generalization": return "";
                default: return "";
            }
        }

        function convertToArrow(r) {
            switch (r) {
                case "extends": return "Triangle";
                case "aggregation": return "StretchedDiamond";
                default: return "";
            }
        }

        myDiagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.Orthogonal },
                new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
                $(go.Shape),
                $(go.Shape, { scale: 1.3, fill: "white" },
                    new go.Binding("fromArrow", "relationship", convertFromArrow)),
                $(go.Shape, { scale: 1.3, fill: "white" },
                    new go.Binding("toArrow", "relationship", convertToArrow))
            );
        // setup a few example class nodes and relationships

        //data
        myDiagram.model = $(go.GraphLinksModel,
            {
                copiesArrays: true,
                copiesArrayObjects: true,
                nodeDataArray: nodedata,
                linkDataArray: linkdata
            });
    }
})
