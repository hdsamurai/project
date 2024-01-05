const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const taskList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

const editButton = document.querySelector('.edit')
const editPopup = document.querySelector('.edit-popup')
const saveEditButton = editPopup.querySelector('.button-save')
const textarea = editPopup.querySelector('.textarea')
const backgroundPopup = document.querySelector('.background-popup ')
const body = document.querySelector('.body')

let tasks = []

if(localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach((task) => renderTask(task)) //Рендерим задачу на странице
}

checkEmptyList()

form.addEventListener('submit', addTask)

taskList.addEventListener('click', deleteTask)

taskList.addEventListener('click', doneTask)

taskList.addEventListener('click', editTask)


//Функции
function addTask(event){
	//Отменяем отправку формы
	event.preventDefault()

	//Достаем текст задачи из поля ввода
	const taskText = taskInput.value

	//Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	}

	//Дoбавим задачу в массив с задачами
	tasks.push(newTask)

	//Сохранение задачи
	saveToLocalStorage()

	//Рендерим задачу на странице
	renderTask(newTask)

	//Очищаем поле ввода и аозвращаем фокус на него
	taskInput.value = ''
	taskInput.focus()

	checkEmptyList()
}

function deleteTask(event){
	//Проверяем если клик был НЕ по кнопке *Удалить задачу*
	if(event.target.dataset.action !== 'delete') return

	//Проверяем что клик был по кнопке *Удалить задачу*
	const parentNode = event.target.closest('li')

	//Определяем ID задачи
	const id = Number(parentNode.id)

	//Находим индекс задачи в массиве
	const index = tasks.findIndex((task) => task.id === id)

	tasks.splice(index, 1)

	saveToLocalStorage()

	const classArray = ['inactive-1', 'inactive-2', 'inactive-3']

	function arrayRandElement(classArray) {
    let rand = Math.floor(Math.random() * classArray.length);
    return classArray[rand];
	}

	//Удаляем из разметки задачу
	parentNode.classList.add(arrayRandElement(classArray))
	let timerToDelete = setTimeout(() => parentNode.remove(), 700);

	checkEmptyList()
}

function doneTask(event){
	if(event.target.dataset.action !== 'done') return

	const parentNode = event.target.closest('li')
	
	//Определяем ID задачи
	const id = Number(parentNode.id)
	const task = tasks.find((task) => task.id === id)
	task.done = !task.done

	saveToLocalStorage()

	const taskTitle = parentNode.querySelector('.task-text')
	taskTitle.classList.toggle('task-text--done')
}

function checkEmptyList(){
	if(tasks.length === 0){
		const emptyListHTML = `<li id="emptyList">Ваш список дел пуст!</li>`
		let timerToAdd = setTimeout(() => taskList.insertAdjacentHTML('afterbegin', emptyListHTML), 1000);
	}

	if(tasks.length > 0){
		const emptyListElement = document.querySelector('#emptyList')
		emptyListElement ? emptyListElement.remove() : null
	}
}

function saveToLocalStorage(){
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function editTask(event){
	if(event.target.dataset.action !== 'edit') return

	const parentNode = event.target.closest('li')

	const id = Number(parentNode.id)
	const task = tasks.find((task) => task.id === id)

	textarea.value = task.text

	backgroundPopup.classList.add('active')
	body.classList.add('disable-scrolling')
	textarea.focus()

	window.addEventListener('keydown', function(event){
		if(event.keyCode === 13){
			let editText = task.text.textContent = textarea.value
			task.text = editText
			
			saveToLocalStorage()
			location.reload()
		}
	})

	saveEditButton.addEventListener('click', function(){
		let editText = task.text.textContent = textarea.value
		task.text = editText
		
		saveToLocalStorage()
		location.reload()
	})
}

function renderTask(task){
	//Формируем CSS Класс
	const cssClass = task.done ? "task-text task-text--done" : "task-text"

	//формируем разметку для новой задачи
	const taskHTML = `
			<li class="task" id="${task.id}">
				<p class="${cssClass}">${task.text}</p>
				<div class="task-button__wrapper">
					<button class="task-button done" data-action="done">
						<img class="button-img" src="img/check-mark.png" alt="Done Button">
					</button>

					<button class="task-button edit" data-action="edit">
						<img class="button-img" src="img/edit.png" alt="Done Button">
					</button>

					<button class="task-button delete" data-action="delete">
						<img class="button-img" src="img/check-mark__delete.png" alt="Delete Button">
					</button>
				</div>
			</li>`

	//Добавляем задачу на страницу
	taskList.insertAdjacentHTML('beforeend', taskHTML)
}