'use strict';
(function () {

	var VIEW = document.getElementById('board'),
		getItem = JSON.parse(localStorage.getItem('cards')),
		cards = getItem ? getItem : [],
		INITIAL_CARDS = cards ? cards : [],
		cardId = cards.length ? cards[cards.length - 1].id : 0;


	if (cards) {
		for (var i = 0; i < cards.length; i++) {
			renderCards(cards[i].name, cards[i].id);
		}
	}

	function cardTemplate(cardName) {
		return '<div class="todo-item__head"> \
					<span class="todo-item__title">' + cardName + '</span> \
					<textarea class="todo-item__edit-name">' + cardName + '</textarea> \
					<span class="todo-item__remove">✕</span> \
				</div> \
				<div class="todo-item__tasks-list"> </div> \
				<div class="todo-item__adding-task"> \
					<textarea class="todo-item__new-task"></textarea> \
					<div class="controls"> \
						<input class="controls__save" type="submit" value="Save"> \
						<span class="controls__close">✕</span> \
					</div> \
				</div> \
				<a href="#" class="todo-item__add">Add card...</a>';
	}

	function renderCards(cardName, cardId) {
		var toDoItem = document.createElement('div');
		toDoItem.classList.add('todo-item');
		toDoItem.dataset.id = cardId;

		toDoItem.addEventListener('click', function(e) {
			taskManager.editTitle(e, INITIAL_CARDS);
			taskManager.addTask(e);
			taskManager.closeAddingTask(e);
			taskManager.removeCard(e, INITIAL_CARDS);
		});

		VIEW.insertBefore(toDoItem, document.querySelector('.add-item'));

		toDoItem.innerHTML = cardTemplate(cardName);
	}

	function createCard() {
		var submit = document.querySelector('.add-item__submit');

		submit.addEventListener('click', function(e) {
			var textInput = document.querySelector('.add-item__name'),
				cardName = textInput.value,
				data;

			cardId++;
			textInput.value = '';
			renderCards(cardName, cardId);

			data = {
				'id' : cardId,
				'name' : cardName
			};
			INITIAL_CARDS.push(data);
			localStorage.setItem('cards', JSON.stringify(INITIAL_CARDS));

			e.preventDefault();
		});
	}


	window.taskManager.createCard = createCard;
})();