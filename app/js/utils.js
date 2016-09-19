(function () {

	function outsideClick(elemClass, clickedLink, callback) {

		function listener(e) {
			var target = e.target;

			// while loop for all browser support

			/*while (target !== document) {
			 if (target.classList.contains(elemClass) || target === clickedLink) {
			 return;
			 }
			 target = target.parentNode;
			 }*/

			// IE not supported .closest method
			if (target === clickedLink || target.closest(elemClass)) return;

			window.removeEventListener('click', listener);

			if (callback) { callback(); }
		}


		window.addEventListener('click', listener);
	}

	function enterIsPressed(e, textarea) {
		return textarea.tagName == 'TEXTAREA' ? e.keyCode == KEY_ENTER : true;
	}

	function isOnlyWhitespaces(elem) {
		var whitespace = /^\s+$/;
		return whitespace.test(elem.value);
	}

	function closePopup(e, popup, callback) {
		if (e.keyCode === KEY_ESC || e.target.classList.contains('popup__close')) {
			popup.classList.remove('is-active');
			callback();
		}
	}

	function closeAddingTask(e) {
		if (!e.target.classList.contains('controls__close')) return;
		var taskField = e.target.closest('.todo-item__adding-task');

		taskField.classList.remove('is-editing');
		taskField.nextElementSibling.classList.remove('is-hidden');
	}

	function updateProperties(params) {
		if (!params.data.length) return;
		var parendId = params.target.closest(params.parentSelector).getAttribute('data-id');

		var activeObj = params.data.find(function(obj) {
			return obj.id === +parendId;
		});
		activeObj.name = params.newValue;

		localStorage.setItem(params.storageItem, JSON.stringify(params.data));
	}

	window.taskManager.outsideClick = outsideClick;
	window.taskManager.enterIsPressed = enterIsPressed;
	window.taskManager.isOnlyWhitespaces = isOnlyWhitespaces;
	window.taskManager.closePopup = closePopup;
	window.taskManager.closeAddingTask = closeAddingTask;
	window.taskManager.updateProperties = updateProperties;


})();