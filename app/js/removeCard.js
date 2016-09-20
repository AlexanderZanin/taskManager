(function () {

	var cardTasks;
	function removeCard(e, data) {
		if (!e.target.classList.contains('todo-item__remove')) return;

		e.target.closest('.todo-item').remove();

		if (!data.length) return;

		var parentId = e.target.closest('.todo-item').getAttribute('data-id');

		var activeIndex = data.findIndex(function(obj) {
			return obj.id === +parentId;
		});

		data.splice(activeIndex, 1);
		localStorage.setItem('cards', JSON.stringify(data));


		cardTasks = JSON.parse(localStorage.getItem('tasks'));

		if (!cardTasks) return;

		cardTasks = cardTasks.filter(function(obj) {
			return obj.parentId !== +parentId;
		});

		if (data.length) {
			localStorage.setItem('tasks', JSON.stringify(cardTasks));
		} else  {
			localStorage.setItem('tasks', JSON.stringify([]));
		}
	}


	window.taskManager.removeCard = removeCard;
})();