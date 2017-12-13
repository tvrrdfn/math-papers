import utils from './utils';
import cache from './cache';

export default {
	dragStart(el, offsetX, offsetY, isResize) {
		let fgItemEl = utils.searchUp(el, 'fg-item');

		this.flowgrid = this.getContainerInstance(fgItemEl);

		this.dragElement = this.flowgrid.$el.querySelector(".fg-item-dragdrop");
		this.dragElement.setAttribute("style", fgItemEl.getAttribute("style"));
		this.dragElement.innerHTML = fgItemEl.innerHTML;

		let nodeIndex = fgItemEl.getAttribute('fg-index');
		this.flowgrid.isDrag = true;
		this.flowgrid.currentIndex = parseInt(nodeIndex);

		this.offsetX = offsetX;
		this.offsetY = offsetY;

		if (!isResize) {
			let offset = utils.getOffset(el, {left: offsetX, top: offsetY}, fgItemEl);
			this.offsetX = offset.left;
			this.offsetY = offset.top;
		}

		// 容器
		let containerOffset = this.flowgrid.$el.getBoundingClientRect();
		this.containerX = containerOffset.left;
		this.containerY = containerOffset.top;
		this.isResize = isResize;
	},

	drag(event) {
		// 赋初值
		this.prevX || (this.prevX = event.pageX);
		this.prevY || (this.prevY = event.pageY);

		// 计算位移
		this.dx = event.pageX - this.prevX;
		this.dy = event.pageY - this.prevY;

		this.prevX = event.pageX;
		this.prevY = event.pageY;

		this.pageX = event.pageX;
		this.pageY = event.pageY;

		this.isResize ? this.resize() : this.position();
	},

	position() {
		var flowgrid = this.flowgrid,
			opt = flowgrid.opt;

		// 当前拖拽节点定点坐标
		let x = this.pageX + flowgrid.$el.scrollLeft - this.containerX - this.offsetX,
			y = this.pageY + flowgrid.$el.scrollTop - this.containerY - this.offsetY;

		// 极值判断
		var maxW = Math.max(opt.containerW, opt.minWidth);
		var eleW = parseInt(this.dragElement.style.width);
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x + eleW > maxW) x = maxW - eleW;

		// 设置拖拽节点样式
		this.dragElement.style.cssText += ';transform: translate(' + x + 'px, ' + y + 'px)';

		// 求当前placeholder节点的坐标
		var node = flowgrid.current;
		var nodeX = Math.round(x / opt.cellW);
		var nodeY = Math.round(y / opt.cellH);

		/**
		 * 拖拽控制滚动条
		 */
		const scrollTop = flowgrid.$el.scrollTop;
		const scrollLeft = flowgrid.$el.scrollLeft;

		// 控制向下滚动（根据节点纵坐标+高度与浏览器高度来判断）
		const bottomDistance = Math.ceil(y + opt.cellH * node.h - scrollTop) - document.body.offsetHeight;

		if (bottomDistance > 0) {
			// 和最低节点位置比较, 来决定是否继续向下滚动
			let bottomNode = flowgrid.getBottomNode();

			if (y < (bottomNode.y + bottomNode.h) * opt.cellH) {
				flowgrid.$el.scrollTop += bottomDistance;
			}
		}

		// 控制向上滚动（根据节点纵坐标是否为0来判断）
		const topDistance = Math.ceil(y - scrollTop);
		if (topDistance < 0) {
			flowgrid.$el.scrollTop += topDistance;
		}

		// 控制向右滚动 (根据节点左上角坐标+节点宽度到浏览器窗口左侧距离与浏览器窗口宽度来判断)
		const windowX = this.pageX + flowgrid.$el.scrollLeft - this.offsetX;
		const rightDistance = Math.ceil(windowX + eleW - scrollLeft) - document.body.offsetWidth;
		if (rightDistance > 0) {
			flowgrid.$el.scrollLeft += rightDistance;
		}

		// 控制向左滚动（根据节点横坐标是否为0来判断）
		const leftDistance = Math.ceil(x - scrollLeft);
		if (leftDistance < 0) {
			flowgrid.$el.scrollLeft += leftDistance;
		}

		// 移动
		if (node != null && (node.x !== nodeX || node.Y !== nodeY)) {
			node.x = nodeX;
			node.y = nodeY;
			flowgrid.overlap(node, this.dx, this.dy);
		}
	},

	resize() {
		let flowgrid = this.flowgrid,
			opt = flowgrid.opt,
			node = flowgrid.current,
			minW = (node.minW || opt.minW) * opt.cellW - opt.padding.left - opt.padding.right - opt.overflow,
			minH = (node.minH || opt.minH) * opt.cellH - opt.padding.top - opt.padding.bottom - opt.overflow,
			translate = this.dragElement.style.transform,
			coord = translate.replace(/translate.*\(/ig, '').replace(/\).*$/ig, '').replace(/px/ig, '').split(','),
			x = parseInt(coord[0]),
			y = parseInt(coord[1]),
			w = this.pageX + flowgrid.$el.scrollLeft - this.containerX - x + this.offsetX,
			h = this.pageY + flowgrid.$el.scrollTop - this.containerY - y + this.offsetY;

		// 极值判断
		let maxW = Math.max(opt.containerW, opt.minWidth);
		if (w < minW) w = minW;
		if (h < minH) h = minH;
		if (w + x > maxW) w = maxW - x - opt.overflow;

		this.dragElement.style.cssText += ';width:' + w + 'px;height:' + h + 'px;';

		// 缩放到底部需要控制滚动条 （根据节点距离浏览器顶部距离+自身高度与浏览器高度进行比较）
		const bottomDistance = Math.ceil(this.dragElement.getBoundingClientRect().top + h) - document.body.offsetHeight;
		if (bottomDistance > 0) {
			flowgrid.$el.scrollTop += bottomDistance;
		}

		// 缩放到右侧需要控制滚动条(根据节点距离拖拽容器右侧的距离来做)
		const rightDistance = Math.ceil(this.dragElement.getBoundingClientRect().right) - flowgrid.$el.getBoundingClientRect().right;
		if (rightDistance > 0) {
			flowgrid.$el.scrollLeft += rightDistance;
		}

		const leftDistance = Math.ceil(this.dragElement.getBoundingClientRect().right) - flowgrid.$el.scrollLeft - flowgrid.$el.getBoundingClientRect().left;
		if (leftDistance < 0) {
			flowgrid.$el.scrollLeft += leftDistance;
		}

		const topDistance = Math.ceil(this.pageY - this.containerY - 10);
		if(topDistance < 0) {
			flowgrid.$el.scrollTop += topDistance;
		}

		// 判断宽高是否变化
		var nodeW = Math.max(Math.round(w / opt.cellW), node.minW || opt.minW);
		var nodeH = Math.max(Math.round(h / opt.cellH), node.minH || opt.minH);

		if (node.w != nodeW || node.h != nodeH) {
			node.w = nodeW;
			node.h = nodeH;
			flowgrid.overlap(node, this.dx, this.dy, this.isResize);
		}
	},

	dragEnd() {
		this.flowgrid.callback('change');

		this.dragElement.innerHTML = "";
		this.dragElement.removeAttribute("style");
		this.flowgrid.isDrag = false;
		this.flowgrid.currentIndex = -1;

		delete this.dragElement;
		delete this.flowgrid;
		delete this.offsetX;
		delete this.offsetY;
		delete this.containerX;
		delete this.containerY;
		delete this.isResize;
	},

	getContainerInstance(el) {
		let container = utils.searchUp(el, 'fg-container');
		if (container == null) {
			throw new Error('flowgrid container must contain fg-container class name.');
		}

		let instance = cache.get(container.getAttribute('name'));
		if (instance == null) {
			throw new Error('can not found container instance');
		}
		return instance;
	},

	getScroll() {
		var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		return {
			scrollLeft: scrollLeft,
			scrollTop: scrollTop
		};
	}
};
