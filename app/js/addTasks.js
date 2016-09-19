(function () {
	var getItem = JSON.parse(localStorage.getItem('tasks')),
		tasks = getItem ? getItem : [],
		INITIAL_TASKS = tasks ? tasks : [],
		taskId = tasks.length ? tasks[tasks.length - 1].id : 0;


	if (tasks.length) {
		for (var i = 0; i < tasks.length; i++) {
			renderTasks(tasks[i].name, tasks[i].id, tasks[i].parentId, tasks[i].status);
		}
	}

	function createTask(taskName, taskStatus) {
		var status = '<div class="task-state '+ taskStatus +'">' + setStatusText(taskStatus) + '</div>',
			editTaskTemplate = '<div class="todo-item__task-edit">edit</div>';

		return status + '<span>' + taskName + '</span>' + editTaskTemplate;
	}


	function renderTasks(taskName, taskId, parentId, taskStatus) {
		var taskTemplate = document.createElement('div'),
			tasksList = document.querySelector('.todo-item[data-id="' + parentId + '"] .todo-item__tasks-list');
		taskTemplate.classList.add('todo-item__task');

		taskTemplate.dataset.id = taskId;

		taskTemplate.innerHTML = createTask(taskName, taskStatus);

		tasksList.appendChild(taskTemplate);

		taskTemplate.addEventListener('click', function(e) {
			taskManager.changeStatus(e, INITIAL_TASKS);
			taskManager.editTask(e, INITIAL_TASKS);
		});
	}

	function setStatusText(status) {
		return document.querySelector('#state-popup .' + status).textContent;
	}


	function addTask(e) {
		if (!e.target.classList.contains('todo-item__add')) return;
		var link = e.target,
			editing = link.parentNode.querySelector('.todo-item__adding-task'),
			cardId = link.parentNode.getAttribute('data-id'),
			textarea = editing.querySelector('.todo-item__new-task'),
			input = editing.querySelector('.controls input');

		link.classList.add('is-hidden');
		editing.classList.add('is-editing');
		textarea.focus();
		textarea.addEventListener('keydown', eventHandler);
		input.addEventListener('click', eventHandler);

		if (e.target.classList.contains('controls__close')) {
			textarea.classList.remove('is-editing');
			link.classList.remove('is-hidden');
		}

		function eventHandler(e) {

			textarea.focus();

			if (taskManager.enterIsPressed(e, this) && !textarea.value
				|| taskManager.enterIsPressed(e, this) && taskManager.isOnlyWhitespaces(textarea)) {
				textarea.value = '';
				e.preventDefault();
				return;
			}

			if (taskManager.enterIsPressed(e, this)) {
				e.preventDefault();

				taskId++;

				textarea.classList.remove('is-editing');

				renderTasks(textarea.value ,taskId, cardId, '-incoming');


				var data = {
					'id' : taskId,
					'name' : textarea.value,
					'parentId' : +cardId,
					'status' : '-incoming'
				};

				INITIAL_TASKS.push(data);
				localStorage.setItem('tasks', JSON.stringify(INITIAL_TASKS));

				textarea.value = '';
			}
		}


		taskManager.outsideClick('.todo-item__adding-task', link, function() {
			editing.classList.remove('is-editing');
			link.classList.remove('is-hidden');
			textarea.removeEventListener('keydown', eventHandler);
			input.removeEventListener('click', eventHandler);
		});
	}

	window.taskManager.addTask = addTask;
})();