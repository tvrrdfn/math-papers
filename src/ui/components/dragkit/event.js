import utils from './utils';
import cache from './cache';
import dragdrop from './drag';

var
	DK_ITEM = 'dk-item',
	THROTTLE_TIME = 14;

// var isSupportTouch = "ontouchend" in document ? true : false;
var isSupportTouch = false;

var handleEvent = {
	init: function (isbind, instance) {
		console.log("isSupportTouch", ("ontouchend" in document ? true : false));

		// 缓存实例
		cache.set(instance.name, instance);

		if (this.isbind) return;
		this.isbind = isbind;
		this.globalUnbind();
		this.globalBind();
	},

	globalBind: function () {
		// document.addEventListener('touchstart', this.touchStart, true);
		document.addEventListener('mousedown', this.mouseDown, false);
		document.addEventListener('touchstart', this.mouseDown, true);
		document.addEventListener('mousemove', this.mouseMove, false);
		document.addEventListener('touchmove', this.mouseMove, true);
		document.addEventListener('mouseup', this.mouseUp, false);
		document.addEventListener('touchend', this.mouseUp, true);
		document.addEventListener('click', this.click, true);
		this.isbind = true;
	},

	globalUnbind: function () {
		document.removeEventListener('mousedown', this.mouseDown, false);
		document.removeEventListener('touchstart', this.mouseDown, true);
		document.removeEventListener('mousemove', this.mouseMove, false);
		document.removeEventListener('touchstart', this.mouseMove, true);
		document.removeEventListener('mouseup', this.mouseUp, false);
		document.removeEventListener('touchend', this.mouseUp, true);
		document.removeEventListener('click', this.click, true);
		this.isbind = false;
	},

	touchStart: function (event) {
		console.log('touch', event);
	},

	mouseDown: function (event) {
		event = isSupportTouch && event.type === 'touchstart' ? event.touches[0] : event;
		console.log(event);
		// 是否点击了拖拽节点
		var ele = utils.searchUp(event.target, node => node.getAttribute('dk-draggable') == 'true');
		if (!ele) return;

		handleEvent.dragStart = true;
		// 记录位置, 通过比较拖拽距离来判断是否是拖拽, 如果是拖拽则阻止冒泡. 不触发点击事件
		handleEvent.distance = 5;
		handleEvent.distanceX = event.pageX;
		handleEvent.distanceY = event.pageY;
		handleEvent.offsetX = event.offsetX || 0;
		handleEvent.offsetY = event.offsetY || 0;
		handleEvent.event = event;
		handleEvent.ele = ele;
	},

	mouseMove: function (event) {
		event = isSupportTouch && event.type === 'touchmove' ? event.touches[0] : event;

		// 函数节流
		if (!handleEvent.throttle(new Date().getTime())) return;

		// 开始拖拽
		if (handleEvent.dragStart && handleEvent.isDrag(event)) {
			handleEvent.dragStart = false;
			dragdrop.dragStart(handleEvent.event, handleEvent.offsetX, handleEvent.offsetY, handleEvent.ele);
			return;
		}

		dragdrop.drag(event);
	},

	mouseUp: function (event) {
		event = isSupportTouch && event.type === 'touchend' ? event.touches[0] : event;

		dragdrop.dragEnd(event);
		// 清理临时变量
		delete handleEvent.ele;
		delete handleEvent.distance;
		delete handleEvent.distanceX;
		delete handleEvent.distanceY;
		delete handleEvent.offsetX;
		delete handleEvent.offsetY;
		delete handleEvent.dragStart;
		delete handleEvent.event;
	},

	click: function (event) {
		if (!handleEvent.dragStart && handleEvent.dragStart !== undefined) {
			// event.preventDefault();
			event.stopPropagation();
			delete handleEvent.dragStart;
		}
	},

	isDrag: function (event) {
		var distanceX = Math.abs(event.pageX - handleEvent.distanceX || 0),
			distanceY = Math.abs(event.pageY - handleEvent.distanceY || 0);
		if (handleEvent.distance < distanceX || handleEvent.distance < distanceY) {
			return true;
		}
	},

	throttle: function (now) {
		var time = new Date().getTime();
		this.throttle = function (now) {
			if (now - time > THROTTLE_TIME) {
				time = now;
				return true;
			}
			return false;
		};
		this.throttle(now);
	},

	isCapture() {
		return isSupportTouch ? true : false;
	}
};

export default handleEvent;
