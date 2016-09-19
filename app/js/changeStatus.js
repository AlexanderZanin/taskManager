(function () {

	function changeStatus(e, data) {
		if (!e.target.classList.contains('task-state')) return;
		if (!e.target.parentNode.classList.contains('todo-item__task')) return;

		var statePopup = document.getElementById('state-popup'),
			state = e.target;

		statePopup.classList.add('is-active');

		function clickHandler(e) {
			var target = e.target;

			taskManager.closePopup(e, this, function() {
				statePopup.removeEventListener('click', clickHandler);
			});

			if (target.classList.contains('task-state')) {
				this.classList.remove('is-active');
				state.innerHTML = target.innerHTML;
				state.setAttribute('class', target.classList);
				statePopup.removeEventListener('click', clickHandler);

				updateStatus();
			}
		}

		window.addEventListener('keydown', function keyDownHandler(e) {
			taskManager.closePopup(e, statePopup, function() {
				window.removeEventListener('keydown', keyDownHandler);
				statePopup.removeEventListener('click', clickHandler);
			});
		});

		statePopup.addEventListener('click', clickHandler);

		function updateStatus() {
			if (!data.length) return;

			var parendId = e.target.closest('.todo-item__task').getAttribute('data-id');

			var activeObj = data.find(function(obj) {
				return obj.id === +parendId;
			});
			activeObj.status = state.classList[1];

			localStorage.setItem('tasks', JSON.stringify(data));
		}
	}

	window.taskManager.changeStatus = changeStatus;

})();
