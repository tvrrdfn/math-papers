var cache = {
	items: {},

	get: function (key) {
		return this.items[key];
	},

	set: function (key, value) {
		this.items[key] = value;
	},

	remove: function (key) {
		delete this.items[key];
	},

	all: function () {
		var arr = [];

		for(var key in this.items){
			if(this.items.hasOwnProperty(key)) {
				arr.push(this.items[key]);
			}
		}

		return arr;
	},

	clear: function () {
		for(var key in this.items){
			if(this.items.hasOwnProperty(key)) {
				delete this.items[key];
			}
		}
	}
};

export default cache;
