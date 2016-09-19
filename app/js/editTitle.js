(function () {

	function editTitle(e, data) {
		if (!e.target.classList.contains('todo-item__title')) return;

		var title = e.target,
			textarea = title.parentNode.querySelector('.todo-item__edit-name');

		title.classList.add('is-hidden');
		textarea.classList.add('is-editing');
		textarea.select();

		function listener(e) {
			title.textContent = this.value;
			if (e.keyCode == KEY_ENTER) {
				e.preventDefault();
				this.classList.remove('is-editing');
				title.classList.remove('is-hidden');

				updateProp();
			}
		}

		textarea.addEventListener('keydown', listener);
		taskManager.outsideClick('.todo-item__edit-name', title, function() {
			title.textContent = textarea.value;
			textarea.classList.remove('is-editing');
			title.classList.remove('is-hidden');
			textarea.removeEventListener('keydown', listener);

			updateProp();
		});


		function updateProp() {
			taskManager.updateProperties({
				target : title,
				data : data,
				parentSelector : '.todo-item',
				newValue : textarea.value,
				storageItem : 'cards'
			});
		}
	}

	window.taskManager.editTitle = editTitle;
})();