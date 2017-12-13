export default {
	escapeRegExp: function escapeRegExp(str) {
		if(!str) return str;
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
};
