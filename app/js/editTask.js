function editTask(e, data) {
	if (!e.target.classList.contains('todo-item__task-edit')) return;
	var popup = document.getElementById('edit-popup'),
		submit = popup.querySelector('.edit-popup__submit'),
		textarea = popup.querySelector('.edit-popup__edit'),
		editButton = e.target,
		taskItem = editButton.parentNode,
		taskDescription = editButton.previousElementSibling,
		initialText = taskDescription.textContent; // variable for returning initial text of task if editing was canceled

	textarea.value = initialText;
	setTimeout(function() {
		textarea.focus();
		textarea.select();
	}, 200); // popup animation duration

	popup.classList.add('is-active');

	taskItem.classList.add('is-highlighted');

	function submitHandler(e) {

		if (taskManager.enterIsPressed(e, this) && !textarea.value
			|| taskManager.enterIsPressed(e, this) && taskManager.isOnlyWhitespaces(textarea)) {
			textarea.value = '';
			e.preventDefault();
			return;
		}

		if (taskManager.enterIsPressed(e, this)) {
			e.preventDefault();
			taskDescription.textContent = textarea.value;
			popup.classList.remove('is-active');
			taskItem.classList.remove('is-highlighted');
			submit.removeEventListener('click', submitHandler);
			textarea.removeEventListener('keydown', submitHandler);
			popup.removeEventListener('click', clickAndKeyDownHandler);
			window.removeEventListener('keydown', clickAndKeyDownHandler);

			taskManager.updateProperties({
				target : editButton,
				data : data,
				parentSelector : '.todo-item__task',
				newValue : textarea.value,
				storageItem : 'tasks'
			});
		}

		setTimeout(function() {
			taskDescription.textContent = textarea.value;
		}, 0);

	}


	function clickAndKeyDownHandler(e) {
		taskManager.closePopup(e, popup, function() {
			taskItem.classList.remove('is-highlighted');
			setTimeout(function() {
				taskDescription.textContent = initialText;
			}, 0);
			submit.removeEventListener('click', submitHandler);
			textarea.removeEventListener('keydown', submitHandler);
			popup.removeEventListener('click', clickAndKeyDownHandler);
			window.removeEventListener('keydown', clickAndKeyDownHandler);
		});
	}

	submit.addEventListener('click', submitHandler);
	textarea.addEventListener('keydown', submitHandler);
	popup.addEventListener('click', clickAndKeyDownHandler);
	window.addEventListener('keydown', clickAndKeyDownHandler);
}

window.taskManager.editTask = editTask;