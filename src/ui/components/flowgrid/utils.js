import {CONSTANT} from './config';

export default {
	searchUp(node, arg) {
		if (!node || node === document.body || node === document) return undefined; // 向上递归到顶就停
		if (typeof arg == 'function'){
			if(arg.call(null, node)) return node;
		}else{
			if(node.classList.contains(arg)) return node;
		}
		return this.searchUp(node.parentNode, arg);
	},

	getOffset: function(node, offset, parent) {
		if (!parent)
			return node.getBoundingClientRect();
		offset = offset || {top: 0, left: 0};
		if (node === null || node === parent) return offset;
		offset.top += node.offsetTop;
		offset.left += node.offsetLeft;
		return this.getOffset(node.offsetParent, offset, parent);
	},

	throttle(now) {
		let time = new Date().getTime();
		this.throttle = function(now) {
			if(now - time > CONSTANT.THROTTLE_TIME) {
				time = now;
				return true;
			}
			return false;
		};
		this.throttle(now);
	},

	getNodeCoord (node, nodes, area) {
		if (nodes.length === 0) return node;
		var r, c, maxCol = area[0].length;
		for (r = 0; r < area.length; r = r + 1) {
			node.y = r;
			for (c = 0; c < area[0].length; c = c + 1) {
				node.x = c;
				if (node.x + node.w > maxCol) {
					node.x = 0;
				}
				if (!this.collision(area, node))
					return node;
			}
		}
		node.x = 0;  // area区域都占满了, 另起一行
		node.y = r;
		return node;
	},

	collision(area, node) {
		for (let r = node.y; r < node.y + node.h; r++) {
			for (let c = node.x; c < node.x + node.w; c++) {
				if (area[r] && (area[r][c] || area[r][c] == 0)) {
					return true;
				}
			}
		}
		return false;
	},
};
