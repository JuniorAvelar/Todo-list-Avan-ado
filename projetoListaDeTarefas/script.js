
// seleção de elementos 
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const filterBtn = document.querySelector("#filtrar-select")

let oldInputValue

// funções
const saveTodo = (text , done = 0 , save = 1) => {

    const todo = document.createElement("div") // criando elemento div
    todo.classList.add("todo")  // add class "todo" na div 

    const todoTitle = document.createElement("h3") // creando um h3 title do todo 
    todoTitle.innerText = text // add texto no title do todo, que e passado como parâmetro 
    todo.appendChild(todoTitle) // inserinod o title na div que foi criada 
    console.log(todo)

    // botão de finalizar tarefa
    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    // botão de editar tarefa 
    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")    
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    // botão de excluir tarefa
    const deletBtn = document.createElement("button")
    deletBtn.classList.add("remove-todo")
    deletBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deletBtn)

    //utilizando dados localStorage
    if(done) {
        todo.classList.add("done")
    }

    if(save) {
        saveTodoLocalStorage({text , done})
    }


    todoList.appendChild(todo) // add a lista na tela do user
    
    todoInput.value = "" // limpa o input de add tarefa 
    todoInput.focus() // foca no input 

}

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const upDataTodo = (text) => {
    const todos = document.querySelectorAll(".todo") // selecionando todos os "todos"

    todos.forEach((todo)=> {
        let todoTitle = todo.querySelector('h3') // pegando o element para poder usar o title na verificação
    
        if(todoTitle.innerHTML === oldInputValue) { 
            todoTitle.innerText = text

            updateTodoLocalStorage(oldInputValue , text)
        }
    })
}

// search todo
const getSearchTodo = (search) => {
    const todos = document.querySelectorAll(".todo")
    // const normalizedSearch = search.toLowerCase()

    todos.forEach((todo) => {
        // seleciona o title dos todos, e passa pra lowerCase
        let todoTitle = todo.querySelector("h3").innerHTML.toLowerCase()
        const normalizedSearch = search.toLowerCase()

        todo.style.display = "flex" // mostro todos 
        // includes() ferifica se existe a palavra dentro da string
        if(!todoTitle.includes(normalizedSearch)){  // as que não tiver, ele esconde 
            todo.style.display = "none"
        }
    })
}

// filtro
const filterTodo = (filterValue) => {
    const todos = document.querySelectorAll(".todo")

    switch(filterValue){
        case "all":
            todos.forEach((todo) => {
                todo.style.display = "flex"
            })
            break

            case "done":
            todos.forEach((todo) => {
                if(!todo.classList.contains("done")) {
                    todo.style.display = "none"
                }
            })
            break

            case "todo":
                todos.forEach((todo) => {
                    if(todo.classList.contains("done")) {
                        todo.style.display = "none"
                    }
                })
                break

            default:
                break
    }
}

//Eventos  
todoForm.addEventListener("submit" , (e) => {
    e.preventDefault()

    const inputValue = todoInput.value

    if(inputValue){
        // save todo
        saveTodo(inputValue)
    }

})

// evento na página toda 
document.addEventListener("click" , (e) => {
    const targetEl = e.target // elemento que foi clicado
    const parentEl = targetEl.closest("div") // selecionando o elemento pai div do elemento que foi clicado, mais próximo

    let todoTitle

    if(parentEl && parentEl.querySelector("h3")){// verifico se o paret element existe e se ele contêm um h3
        todoTitle = parentEl.querySelector("h3").innerText // pegadno o title 
    }

    // COMPLETE TASK
    // verificação se o elemento que foi clicado contém  a clss "finish-todo"
    if(targetEl.classList.contains("finish-todo")) { 
        parentEl.classList.toggle("done") // add and remove class done from elemet 

        updateTodoStatusLocalStorage(todoTitle)
    }

    // REMOVE TODO
    // verificação se o elemento que foi clicado contém a clss "remove-todo"
    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove() // remove o elemento 

        removeTodoLocalStorage(todoTitle)
    }

    // EDIT TODO
    if(targetEl.classList.contains("edit-todo")){
        toggleForms()
        editInput.value = todoTitle
        oldInputValue = todoTitle // salvando o antigo title para usar depois 
    }
})

cancelEditBtn.addEventListener("click" , (e) => {
    e.preventDefault()
    toggleForms()
})

editForm.addEventListener("submit" ,  (e) => {
    e.preventDefault()
    const editInputValue = editInput.value // pegando o novo valor 

    if(editInputValue) {
        // atualizar
        upDataTodo(editInputValue)
    }

    toggleForms()
})

searchInput.addEventListener("keyup" , (e) => {
    const search =  e.target.value

    console.log(search)

    getSearchTodo(search)
})

eraseBtn.addEventListener("click" , (e) => {
    e.preventDefault()
    searchInput.value = ""
    
    // disperta um evento no input para ativar outro evento 
    searchInput.dispatchEvent(new Event("keyup"))

    // const todos = document.querySelectorAll(".todo")
    // todos.forEach((todo) => {
    //     todo.style.display = "flex"
    // })
})

filterBtn.addEventListener("change" , (e) => {
    const filterValue = e.target.value // pega o valor do filter    
    console.log(filterValue)

    filterTodo(filterValue)
})

// LocalStorage

const getTodoLocalStorage = () => {
    // pegando os todos do ls, e transfomando em obj e se não tiver nada ele retorna um arr vazio 
    const todos =  JSON.parse(localStorage.getItem("todos")) || []

    return todos 
}

// carregar todos do Ls
const loadTodos = () => {
    const todos = getTodoLocalStorage()

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done , 0)
    })

}

const saveTodoLocalStorage = (todo) => {
    // todos os "todos" do local storage 
    const todos = getTodoLocalStorage()
    console.log(todos)

    // add o novo todo ao arr
    todos.push(todo)

    // salvar tudo no local storage 
    localStorage.setItem("todos" , JSON.stringify(todos))
}

const removeTodoLocalStorage = (todoText) => {
   const todos = getTodoLocalStorage()

   // fica so os todos que vão ficar no localStorage
  // filter retorna dados
    const filterTodos = todos.filter((todo)=> todo.text !== todoText)//filtra os todos que não são os que o user quer remover 
   
    localStorage.setItem("todos" , JSON.stringify(filterTodos))
}
const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodoLocalStorage()

    // map modifica os dados originais 
    // todos.map((todo) => 
    //     todo.text === todoText ? todo.done = !todo.done : null
    // )

    todos.forEach((todo) => {
        if(todo.text === todoText) {
            todo.done = !todo.done // inverte o valor que estar em todo.none
        }
        else {
            null
        }
    })

    localStorage.setItem("todos" , JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText , todoNewText) => { 
    const todos =  getTodoLocalStorage()

    todos.forEach((todo) => {
        todo.text === todoOldText ? todo.text = todoNewText : null
    })

    localStorage.setItem("todos" , JSON.stringify(todos))

}
loadTodos();