let data = [
    {      
        "type": "file",
        "fileType": "pdf",     
        "name": "Employee Handbook",     
        "added": "2017-01-06"
    },
    {     
        "type": "file",
        "fileType": "pdf",     
        "name": "Public Holiday policy",     
        "added": "2016-12-06"
    },
    {     
        "type": "folder",     
        "name": "Expenses",     
        "files": 
        [
            {         
                "type": "file",
                "fileType": "doc",         
                "name": "Expenses claim form",
                "added": "2017-05-02"
            },
            {         
                "type": "file",
                "fileType": "doc",
                "name": "Fuel allowances",
                "added": "2017-05-03"
            }
        ]
    },
    {     
        "type": "file",
        "fileType": "csv",
        "name": "Cost centres",     
        "added": "2016-08-12"
    },
    {     
        "type": "folder",     
        "name": "Misc",     
        "files": 
        [
            {         
                "type": "file",
                "fileType": "doc",         
                "name": "Christmas party",         
                "added": "2017-12-01"
            },
            {         
                "type": "file",
                "fileType": "mov",         
                "name": "Welcome to the company!",         
                "added": "2015-04-24"
            },
            {     
                "type": "folder",     
                "name": "Expenses sub",     
                "files": 
                [
                    {         
                        "type": "file",
                        "fileType": "doc",         
                        "name": "Expenses claim form sub",
                        "added": "2019-05-02"
                    },
                    {         
                        "type": "file",
                        "fileType": "doc",
                        "name": "Fuel allowances sub",
                        "added": "2016-05-03"
                    }
                ]
            },
        ]
    }
];

// TO DO:
// - add back button for folders content
// - back to default sorting 
// - add search button
// - add "no results" message (search)
// - finish comments 

let currentFolderContent;
files();

function files() {
    const containerMain = document.getElementById("files-list-container");

    const files = document.createElement("div");
    files.classList.add("folder-files", "active");
    files.id = "main-folder";

    currentFolderContent = data;

    files.append(displayFiles(data))

    const folderFilesList = document.createElement("div");
    folderFilesList.classList.add("folder-files");
    folderFilesList.id = "folder-files";

    containerMain.append(files, folderFilesList);
}

// render all files and folders
function displayFiles(data) {
    const filesWrap = document.createElement("div");
    filesWrap.className = "container";

    const filesList = document.createElement("div");
    filesList.className = "files-list";

    const foldersList = document.createElement("div");
    foldersList.className = "folders-list";

    currentFolderContent.forEach((e) => {
        e.type == "folder" ? foldersList.append(displayFolder(e)) : filesList.append(displayFile(e))
    });

    filesWrap.append(foldersList, filesList)
    return filesWrap;
}

//render file item
function displayFile(file) {
    let fileWrap = document.createElement("div");
    fileWrap.className = "file-item";
    let fileName = document.createElement("p");
    
    fileName.className = "file-name";
    fileName.innerText = file.name  + "." + file.fileType;
    fileName.prepend(displayIcon(file.fileType));

    let fileDate = document.createElement("p");
    fileDate.className = "file-date";
    fileDate.innerText = file.added;
    fileWrap.append(fileName, fileDate);

    return fileWrap;
}
//render folder item
function displayFolder(folder) {
    let folderItem = document.createElement("div");
    folderItem.classList.add( "folder-item");
    folderItem.setAttribute("data-folder", folder.name)

    let folderName = document.createElement("p");
    folderName.className = "folder-name file-name";
    folderName.innerText = folder.name;
    folderName.prepend(displayIcon("folder"));

    folderItem.addEventListener("click", displayFolderFiles)
    folderItem.append(folderName);

    return folderItem
}

function displayIcon(type) {
    let icon = document.createElement("span");
    icon.classList.add("icon", "material-symbols-outlined");
    switch(type) {
        case 'doc':
            icon.innerText = "article";
            icon.classList.add("doc-icon");
            break;
        case 'pdf':
            icon.innerText = "picture_as_pdf";
            icon.classList.add("pdf-icon");
            break;
        case 'folder':
            icon.innerText = "folder";
            icon.classList.add("folder-icon");
            break;
        case 'folder_open':
            icon.innerText = "folder_open";
            icon.classList.add("folder-icon");
            break;
        default:
            icon.innerText = "file_present"
    }

    return icon;
}

function displayFolderFiles(event) {
    const container = document.getElementById("folder-files");
    container.innerHTML = ""; 

    // get folder name
    const folderName = event.target.closest(".folder-item").getAttribute("data-folder");

    // get folder files list and store
    const folderContent = currentFolderContent.filter(element => {
        return element.name == folderName;
    });
    
    currentFolderContent = folderContent[0].files;

    // display current folder name and icons
    const folderTitle = document.createElement("h3");
    folderTitle.className = "folder-title";
    folderTitle.innerText = folderName;
    folderTitle.prepend(displayIcon("folder_open"));

    // render files list
    container.append(folderTitle, displayFiles(currentFolderContent));

    document.getElementById("main-folder").classList.remove("active");
    container.classList.add("active");
}

const sortBtns = document.querySelectorAll(".sort-button");
sortBtns.forEach( button =>  button.addEventListener("click", sortFiles) );

function sortFiles(event) {
    const sortBtnActive = document.querySelector(".sort-button.active");
    if(sortBtnActive) {
        sortBtnActive.classList.remove("active");
    }
    
    event.target.classList.add("active");
    const sortBy = event.target.getAttribute("data-sort");

    const currentFilesList = currentFolderContent.filter(element => {
        return element.type != "folder";
    });
    const container = document.querySelector(".folder-files.active .files-list");
    container.innerHTML = ""; 
    
    let  sortable = currentFilesList;

    switch(sortBy) {
        case 'name':
            sortable = currentFilesList.sort( (a, b) => {
                const nameA = a.name.toUpperCase(); 
                const nameB = b.name.toUpperCase(); 
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            break;
        case 'added':
            sortable = currentFilesList.sort(function (a, b) {
                const dateA = a.added.replaceAll('-', '');
                const dateB = b.added.replaceAll('-', '');
                return dateA - dateB;
            });
            break;
        default:
            sortable = currentFilesList;
    }
    sortable.forEach((e) => {
        container.append(displayFile(e));
    });
    sortable = currentFolderContent;
}

const searchInput = document.querySelector('#files-search');


searchInput.addEventListener('change', updateValue);

function updateValue(event) {
    const container = document.querySelector(".folder-files.active");
    container.innerHTML = ""; 
    const filesList = document.createElement("div");
    filesList.className = "files-list";
    container.append(filesList)
    
    let value = event.target.value.toUpperCase();
    if(value.length > 0) {
        currentFolderContent = []
        filterFolderFiles(data)
    } else {
        currentFolderContent = data;
        container.innerHTML = ""; 
        container.append(displayFiles(data))
    }

    function filterFolderFiles(data) {
        data.forEach( e => {
            if(e.type == "folder") {
                filterFolderFiles(e.files);
            } else {
                if(e.name.toUpperCase().indexOf(value) > -1) {
                    filesList.append(displayFile(e));
                    currentFolderContent.push(e);
                }
            }
        });
    }
}



