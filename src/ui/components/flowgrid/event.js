import utils from './utils';
import dragdrop from './dragdrop';

let doc = document,
	DISTANCE = 5;
let isSupportTouch = "ontouchend" in document ? true : false;

let handleEvent = {
	init(isbind) {
		console.log("isSupportTouch", ("ontouchend" in document ? true : false));

		if (this.isbind) return;
		this.isbind = true;
		this.unbind();
		this.bind();
	},

	bind() {
		doc.addEventListener('mousedown', this.mouseDown, false);
		doc.addEventListener('touchstart', this.mouseDown, true);
		doc.addEventListener('mousemove', this.mouseMove, false);
		doc.addEventListener('touchmove', this.mouseMove, true);
		doc.addEventListener('mouseup', this.mouseUp, false);
		doc.addEventListener('touchend', this.mouseUp, true);
		doc.addEventListener('click', this.click, true);
	},

	unbind() {
		doc.removeEventListener('mousedown', this.mouseDown, false);
		doc.removeEventListener('touchstart', this.mouseDown, true);
		doc.removeEventListener('mousemove', this.mouseMove, false);
		doc.removeEventListener('touchmove', this.mouseMove, true);
		doc.removeEventListener('mouseup', this.mouseUp, false);
		doc.removeEventListener('touchend', this.mouseUp, true);
		doc.removeEventListener('click', this.click, true);
		this.isbind = false;
	},

	mouseDown(event) {
		event = isSupportTouch && event.type === 'touchstart' ? event.touches[0] : event;

		let isDrag = event.target.classList.contains("fg-item-drag-bar");
		let isResize = event.target.classList.contains("fg-item-zoom-bar");

		if (isDrag || isResize) {
			handleEvent.isResize = isResize;
			handleEvent.el = event.target;
			handleEvent.offsetX = event.offsetX || 0;
			handleEvent.offsetY = event.offsetY || 0;
			handleEvent.pageX = event.pageX;
			handleEvent.pageY = event.pageY;

			// 绑定touch事件
			if (isSupportTouch) {
				doc.addEventListener('mousemove', handleEvent.mouseMove, false);
				doc.addEventListener('touchmove', handleEvent.mouseMove, true);
				doc.addEventListener('mouseup', handleEvent.mouseUp, false);
				doc.addEventListener('touchend', handleEvent.mouseUp, true);
			}
		}
	},

	mouseMove(event) {
		// touch事件,则阻止默认滚动屏幕行为
		if (isSupportTouch) {
			event.preventDefault();
		}

		if (!handleEvent.el) return;

		event = isSupportTouch && event.type === 'touchmove' ? event.touches[0] : event;

		if (handleEvent.isDrag(event) && !handleEvent.dragStart) {
			handleEvent.dragStart = true;
			dragdrop.dragStart(handleEvent.el, handleEvent.offsetX, handleEvent.offsetY, handleEvent.isResize);

		}

		// 需要函数节流
		if (handleEvent.dragStart) {
			utils.throttle(new Date().getTime()) && dragdrop.drag(event);
		}
	},

	mouseUp(event) {
		event = isSupportTouch && event.type === 'touchend' ? event.touches[0] : event;

		if (handleEvent.dragStart) {
			dragdrop.dragEnd();
		}

		delete handleEvent.dragStart;
		delete handleEvent.el;
		delete handleEvent.offsetX;
		delete handleEvent.offsetY;
		delete handleEvent.pageX;
		delete handleEvent.pageY;
		delete handleEvent.isResize;

		if (isSupportTouch) {
			// 解绑touch事件
			doc.removeEventListener('mousemove', handleEvent.mouseMove, false);
			doc.removeEventListener('touchmove', handleEvent.mouseMove, true);
			doc.removeEventListener('mouseup', handleEvent.mouseUp, false);
			doc.removeEventListener('touchend', handleEvent.mouseUp, true);
		}
	},

	click(event) {

	},

	isDrag(event) {
		let distanceX = Math.abs(event.pageX - this.pageX) || 0,
			distanceY = Math.abs(event.pageY - this.pageY) || 0;

		if (distanceX > DISTANCE || distanceY > DISTANCE) {
			return true;
		}

		return false;
	},

	destroy() {
		this.unbind();
	}
};

export default handleEvent;