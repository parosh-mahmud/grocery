const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const list = document.querySelector(".grocery-list");
const container = document.querySelector(".grocery-container");
const clearItems = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editID="";
// submit form
form.addEventListener("submit", addItem);

//clear list
clearItems.addEventListener("click", clearItem);

// Dom content loaded
window.addEventListener("DomContentLoaded", setupItems);

function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if (value !== "" && !editFlag) {
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add("grocery-item");
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
        <button class="edit-btn" type="button">
        <i class="fas fa-edit"></i>
        </button>

        <button class="delete-btn" type="button">
        <i class="fas fa-trash"></i>
        </button>
        </div>
        `;
        
        //add event listener to edit and delete button
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);
        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);
        
        //appendChild
        list.appendChild(element);
        //display alert
        displayAlert("Item added to the list", "success");
        //show element
        container.classList.add("show-container")
        //set localStorage
        addToLocalStorage(id, value);
    
        //set back to default
        setBackToDefault();
    } else if (value !== "" && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        editLocalStorage(editID, value);
        setBackToDefault();

    } else {
        displayAlert("Please enter a value","danger");
    }
}


function setupItems() {
    
}



function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
        displayAlert("item removed", "danger");

        setBackToDefault();
        //remove from localStorage
        removeFromLocalStorage(id)
    }
}

function displayAlert(text,action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    //remove displayAlert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}

function addToLocalStorage(id,value) {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items))
}

function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent="submit";
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items))
}

//edit item
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent="edit";
    
    
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        });
        container.classList.add("show-container")
    }
}

//create list item
function createListItem(id, value) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
              <div class="btn-container">
                <!-- edit btn -->
                <button type="button" class="edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <!-- delete btn -->
                <button type="button" class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
  
    // append child
    list.appendChild(element);
}
  
//clear items
function clearItem() {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
      items.forEach(function (item) {
        list.removeChild(item);
      });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
  }