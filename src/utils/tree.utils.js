export default {
	search: function (node, id, childAttr="child", attrVal="id") {
		var child = node[childAttr];
		if (child && child.length > 0) {
			var i;
			var result = null;
			for (i = 0; result == null && i < child.length; i++) {
				result = this.search(child[i], id, childAttr, attrVal);
			}
			return result;
		}
		return node[attrVal] == id ? node : null;
	},
	setExpand: function (node, id, childAttr="child", attrVal="id") {
		var i, c, len, child = node[childAttr];
		if ((child == null || child.length === 0) && id == node[attrVal])
			return true;
		if (child instanceof Array) {
			for (i = 0, len = child.length; i < len; i++) {
				if (this.setExpand(child[i], id, childAttr, attrVal)) {
					node.expand = true;
					return true;
				}
			}
		}
		return false;
	},
	first: function (node, childAttr="child") {
		let child = node[childAttr];
		if(child == null || child.length === 0){
			return node;
		}

		return this.first(node[childAttr][0], childAttr);
	}
};
