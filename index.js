const showList = document.getElementById('view-list')
const list = localStorage.linkList ? memorySave() :  Array()

const objEdit = {newObj: true, numObj: -1}
let typeRender = 0
renderList(list)

const inputTitle = document.querySelector('input[name=ent_name]') 
const inputUrl = document.querySelector('input[name=ent_url]')
const inputPriority = document.querySelector('select')

function colocarNaLista(){
    event.preventDefault()

    const { title, url, priority } = callInput()
    if ( title == '' || url == '' ) return  

    if ( objEdit.newObj ) {
        createObjectModel(title, url, priority)

    } else {
        if ( list[objEdit.numObj] ){
            list[objEdit.numObj].title = title
            list[objEdit.numObj].utl = url
            list[objEdit.numObj].priority = priority
        }
        
        renderList(list)

        objEdit.newObj = true
        objEdit.numObj = -1
    }

    clearInput()
}

function callInput(){
    const title = inputTitle.value  
    const url = inputUrl.value    
    const priority = inputPriority.value 

    return { title, url, priority }
}

function clearInput(){
    inputTitle.value = ''
    inputUrl.value = ''
    inputPriority.value = 1
}

function createObjectModel(title, url, priority) {
    const info = {title, url, priority, condition: false}

    list.push(info)
    createObjectView(info)
    saveList()
}

function createObjectView(object){
    const index = list.indexOf(object)

    let component = `<table class="view-list-object">` 
    component += `<td class='td-area'><input type="checkbox" onclick="changeCodition(${index})" ${object.condition ? 'checked' : ''}>  </td>`
    component += `<td><a href='${object.url}' target="_blank"><h2 title='${object.title}'>${object.title}</h2></a></td>`
    component += `<td class='td-area'><p>${object.priority}</p></td>`
    component += `<td class='td-area'><button onclick="editObjectList(${index})">editar</button></td>`
    component += `<td class='td-area'><button onclick="deleteOneObjectList(${index})">excluir</button></td></table> `
    showList.innerHTML += component
}

function changeListView(){
    const typeListView = document.querySelector('select[name=type_view_list]')
    console.log(typeListView.value)

    if ( typeListView.value == 'latest' ){
        renderList(list)
    } else if ( typeListView.value == 'earliest' ){
        renderList([...list].reverse())
    } else {
        const newArray = list.sort( (a , b) => a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0)
        renderList(newArray)
    }
}

function deleteAllMarked(){
    const confirmDelete = confirm('You wish delete links marked? ')
    if ( !confirmDelete ) return 
    
    list.filter( (obj,index) => obj.condition == true ? delete list[index] : '')  
    renderList(list)
}

function renderController(){

    setTimeout( () => {
        if ( typeRender == 0 ) {
            showList.innerHTML = ''
        } else if ( typeRender == 1 ){
            renderList(list)
        } else if ( typeRender == 2 ){
            renderList(list.filter( obj => obj.condition == false ))
        } else {
            renderList(list.filter( obj => obj.condition == true ))
        }
    }, 100)

    typeRender++
    if ( typeRender > 3 ) typeRender = 0
}

function renderList(array){
    showList.innerHTML = ''
    for ( let i in array ){
        createObjectView(array[i])
    }
    saveList()
}

function changeCodition(index){
    list[index].condition = !list[index].condition 
    saveList()
}

function deleteOneObjectList(index){
    const confirmDelete = confirm('You wish delete link marked? ')
    if ( !confirmDelete ) return 

    list.splice(index, 1)
    renderList(list)
}

function editObjectList(index){
    
    const obj = list[index]

    inputTitle.value = obj.title
    inputUrl.value = obj.url
    inputPriority.value = obj.priority

    objEdit.newObj = false
    objEdit.numObj = index
}

function saveList(){
    localStorage.setItem('linkList', JSON.stringify(list.filter( i => i )))
}

function memorySave(){
    return JSON.parse(localStorage.linkList)
}