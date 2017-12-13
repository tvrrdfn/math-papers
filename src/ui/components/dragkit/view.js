var view = {
	getOffset: function(node, offset, parent) {
		if (!parent)
			return node.getBoundingClientRect();
		offset = offset || {top: 0, left: 0};
		if (node === null || node === parent) return offset;
		offset.top += node.offsetTop;
		offset.left += node.offsetLeft;
		return this.getOffset(node.offsetParent, offset, parent);
	}
};

export default view;
