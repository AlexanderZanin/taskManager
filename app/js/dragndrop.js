(function () {
	function getCoords(elem) {
		var coords = elem.getBoundingClientRect();

		return {
			top: coords.top + pageYOffset,
			left: coords.left + pageXOffset
		};
	}

	var DragManager = new function() {
		var dragObject = {};
		var self = this;

		document.onmousedown = function(e) {

			if(e.which != 1) return;

			var elem = e.target.closest('.todo-item__task');

			if(!elem) return;

			dragObject.elem = elem;

			dragObject.coordX = e.pageX;
			dragObject.coordY = e.pageY;
			return false;
		};

		document.onmousemove = function(e) {
			var dropElem;

			if (dragObject.avatar) {
				dropElem = findDroppable(e);
				if (!dropElem) {
					self.onDragLeave();
				} else {
					self.onDragEnter(dropElem);
				}
			}

			if (!dragObject.elem) return;

			if(!dragObject.avatar) {

				var moveX = e.pageX - dragObject.coordX;
				var moveY = e.pageY - dragObject.coordY;

				if(Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;

				dragObject.avatar = createAvatar(e);
				if(!dragObject.avatar) {
					dragObject = {};
					return;
				}

				var coords = getCoords(dragObject.avatar);
				dragObject.shiftX = dragObject.coordX - coords.left;
				dragObject.shiftY = dragObject.coordY - coords.top;

				startDrag(e);
			}
			dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
			dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
			return false;
		};

		document.onmouseup = function(e) {
			if(dragObject.avatar) {
				finishDrag(e);
			}
			dragObject = {};
		};

		function finishDrag(e) {
			var dropElem = findDroppable(e);

			if(!dropElem) {
				self.onDragCancel(dragObject);
			} else {
				self.onDragEnd(dragObject, dropElem);
			}
		}

		function createAvatar() {
			var avatar = dragObject.elem;
			var old = {
				parent: avatar.parentNode,
				nextSibling: avatar.nextSibling,
				position: avatar.position || '',
				left: avatar.left || '',
				top: avatar.top || '',
				zIndex: avatar.zIndex || ''
			};

			avatar.rollback = function() {
				old.parent.insertBefore(avatar, old.nextSibling);
				avatar.style.position = old.position;
				avatar.style.left = old.left;
				avatar.style.top = old.top;
				avatar.style.zIndex = old.zIndex;
				avatar.classList.remove('is-dragging');
			};

			return avatar;
		}

		function startDrag() {
			var avatar = dragObject.avatar;

			document.body.appendChild(avatar);
			avatar.style.position = 'absolute';
			avatar.style.zIndex = '9999';
			avatar.classList.add('is-dragging');
		}
		function findDroppable(e) {
			dragObject.avatar.hidden = true;

			var elem = document.elementFromPoint(e.clientX, e.clientY);
			dragObject.avatar.hidden = false;

			if(elem === null) {
				return null;
			}
			return elem.closest('.todo-item');
		}
		this.onDragEnd = function(dragObject, dropElem) {};
		this.onDragCancel = function(dragObject) {};
		this.onDragEnter = function(dropElem) {};
		this.onDragLeave = function(dropElem) {};
	};
	DragManager.onDragCancel = function(dragObject) {
		dragObject.avatar.rollback();
	};

	DragManager.onDragEnd = function(dragObject, dropElem) {

		var parentId = dropElem.getAttribute('data-id'),
			tasksList = dropElem.querySelector('.todo-item__tasks-list'),
			elemId = dragObject.elem.getAttribute('data-id'),
			cardTasks = JSON.parse(localStorage.getItem('tasks')),
			droppedTask;

		droppedTask = cardTasks.find(function(obj) {
			return obj.id === +elemId;
		});

		droppedTask.parentId = +parentId;
		localStorage.setItem('tasks', JSON.stringify(cardTasks));

		tasksList.classList.remove('is-highlighted');
		dragObject.elem.classList.remove('is-dragging');
		dragObject.elem.removeAttribute('style');
		tasksList.appendChild(dragObject.elem);

		removeClass();
	};

	DragManager.onDragLeave = removeClass;

	DragManager.onDragEnter = function(dropElem) {
		dropElem.querySelector('.todo-item__tasks-list').classList.add('is-highlighted');
	};

	function removeClass() {
		var lists = document.querySelectorAll('.todo-item__tasks-list'), i;

		for (i = 0; i < lists.length; i++) {
			lists[i].classList.remove('is-highlighted');
		}
	}
})();



