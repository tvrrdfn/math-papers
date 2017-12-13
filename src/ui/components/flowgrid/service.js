import {globalConfig} from './config';

// 需要暴露的方法
export default {
	buildArea(nodes) {
		let area = [];
		let max = this.getMaxRowAndCol(nodes);
		for (let r = 0; r < max.row; r++) {
			area[r] = new Array(max.col);
		}
		this.putNodes(area, nodes);
		return area;
	},

	putNodes(area, nodes) {
		let r, rlen, c, clen;

		for (let node of nodes) {
			if(node.y !== undefined || node.x !== undefined) {
				for (r = node.y, rlen = node.y + node.h; r < rlen; r++) {
					for (c = node.x, clen = node.x + node.w; c < clen; c++) {
						area[r][c] = node.id;
					}
				}
			}
		}
	},

	getMaxRowAndCol(nodes, opt = globalConfig) {
		let max = {
				row: opt.row,
				col: opt.col
			};

		for (let n of nodes) {
			if(n.y !== undefined || n.x !== undefined){
				if (n.y + n.h > max.row) {
					max.row = n.y + n.h;
				}
				if (n.x + n.w > max.col) {
					max.col = n.x + n.w;
				}
			}
		}

		return max;
	},

	getNodeCoord (node, nodes, area) {
		node = Object.assign({}, node); // 复制一个节点
		if(area == null) {
			area = this.buildArea(nodes);
		}
		if (nodes.length === 0) return node;
		var r, c, maxCol = area[0].length;
		// 一个格一个格地移动,进行检测是否可以放得下
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
				if (area[r] && (area[r][c] || area[r][c] == 0) && area[r][c] !== node.id) {
					return true;
				}
			}
		}
		return false;
	}
};
