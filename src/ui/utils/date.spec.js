import dateUtils from './date';

describe('date utils', function () {


	describe('year', function () {
		it('add year', function () {
			var date = new Date('2017-01-01');
			var result = dateUtils.addYears(date, 1);
			expect(result.getFullYear()).to.be.equal(2018);
		});
	});

});
