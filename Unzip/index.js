let file = document.getElementById("file");
let code = document.getElementById("code");
let list = document.getElementById("list");
file.addEventListener('change', function (event) {
    var filesInput = file.files[0];
    console.log(filesInput)
    zip.createReader(new zip.BlobReader(filesInput), function (reader) {
        let res = '';
        let i = 0;
        reader.getEntries(function (entries) {
            console.log((entries))
            if (entries.length) {
                entries.forEach((e) => {
                    console.log(e);
                    if (e.directory == false) {
                        res += `<li onclick="getData(${i})">${e.filename}</li>`;
                    }
                    i++;
                })
                list.innerHTML = res;
            }
        });
    }, function (error) {
        // onerror callback
    });
})

function getData(i) {
    var filesInput = file.files[0];
    zip.createReader(new zip.BlobReader(filesInput), function (reader) {
        reader.getEntries(function (entries) {
            entries[i].getData(new zip.TextWriter(), function (text) {
                code.innerText = '';
                CodeMirror(code, {
                    lineNumbers: true,
                    mode: 'text/x-java',
                    theme: 'icecoder',
                    readOnly: "nocursor",
                    value: text
                });
            });
        })
    })
}