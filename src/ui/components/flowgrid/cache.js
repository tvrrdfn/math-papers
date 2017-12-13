var cache = {
	items: {},

	set: function (name, value) {
		this.items[name] = value;
	},

	get: function (name) {
		return this.items[name];
	},

	remove: function (name) {
		delete this.items[name];
	},

	clear: function () {
		var keys = Object.keys(this.items);
		for(let key of keys){
			if(this.items.hasOwnProperty(key)) {
				delete this.items[key];
			}
		}
	}
};

export default cache;
