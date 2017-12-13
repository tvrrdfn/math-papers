const PAGINATION_LENGTH = 7,
	PAGINATION_PLACEHOLDER = '...';

function range(start, end){
	var result = [];
	for(var i=start; i<=end; i++){
		result.push(i)
	}
	return result;
}

/**
 * @param {Number} currentPage 当前页
 * @param {Number} pageLength 分页单位，每页显示条数
 * @param {Array} data 要分页的数据
 */
function Pagination(currentPage, pageLength, data) {
	this.cached = data || [];
	this.currentPage = currentPage;
	this.pageLength = pageLength;
	this.totalCount = this.cached.length;
	this.pageCount = Math.ceil(this.totalCount / this.pageLength); // 总页数
}

Pagination.prototype = {
	constructor: Pagination,

	getPagination() {
		if (this.totalCount <= 0) return null;

		if (this.pageCount <= PAGINATION_LENGTH) {
			return range(1, this.pageCount);
		}

		var continueLen = PAGINATION_LENGTH - 2; // 2表示有两个...占位符

		if (this.currentPage < continueLen) {
			return range(1, continueLen).concat([PAGINATION_PLACEHOLDER, this.pageCount]);
		}

		if (this.currentPage > this.pageCount - continueLen + 1) {
			return [1, PAGINATION_PLACEHOLDER].concat(range(this.pageCount - continueLen + 1, this.pageCount));
		}

		return [1, PAGINATION_PLACEHOLDER].concat(range(this.currentPage - 1, this.currentPage + 1)).concat([PAGINATION_PLACEHOLDER, this.pageCount]);
	},

	getData() {
		var start = (this.currentPage - 1) * this.pageLength,
			end = start + this.pageLength;

		return this.cached.slice(start, end);
	},

	prev() {
		this.go(this.currentPage - 1);
	},

	next() {
		this.go(this.currentPage + 1);
	},

	go(page) {
		if (page < 1 || page > this.pageCount) return;

		if (this.currentPage == page) return;

		this.currentPage = page;
	},

	value() {
		return {
			currentPage: this.currentPage,
			pageLength: this.pageLength,
			totalCount: this.totalCount,
			pageCount: this.pageCount,
			items: this.getPagination(),
			data: this.getData(),
			placeholder: PAGINATION_PLACEHOLDER
		};
	}
};

export default Pagination;
