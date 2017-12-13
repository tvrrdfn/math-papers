    "use strict";
    import MouseHandler from './mouse-handler';
    import utils from './utils';
	
    // This simple and small javascript solution for resizing html tables
    // is based on
    // http://bz.var.ru/comp/web/resizable.html
    function ResizeHandler(table, options) {

		//set default options
		this.options.minWidth = 30;
		this.options.restoreState = true;
		this.options.fixed = false;
		this.options.callback = function(){};//回调函数
		
        // set options
		var newOptions = {};
        for (var opt in this.options)
			newOptions[opt] = (typeof options[opt] == 'undefined') ?  this.options[opt] : options[opt];
		this.options = newOptions;
		
		// table
		this.table = table;
        // header row
        this.hr = table.rows[0];
		// number of columns
		this.nc = this.hr.cells.length;
        // number of rows
        this.nr = table.rows.length;

		this._init();
		
    }

	ResizeHandler.prototype = new MouseHandler();
	ResizeHandler.prototype.constructor = ResizeHandler;
	
	// helper functions
	
	function eventPageX(event) {
		var pageX = event.pageX;

		if (typeof pageX == 'undefined') {
			var body = document.body;
			var docElem = document.documentElement;
			pageX = event.clientX + (docElem && docElem.scrollLeft || body && body.scrollLeft || 0) - (docElem && docElem.clientLeft || body && body.clientLeft || 0);
		}

		return pageX;
	}
    function elementStyleProperty(element, prop) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(element, "").getPropertyValue(prop);
        } else { // http://stackoverflow.com/questions/21797258/getcomputedstyle-like-javascript-function-for-ie8
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return element.currentStyle[prop]
        }
    }
	function numericProperty(prop) {
        return (typeof prop == 'undefined' || prop == '' || prop == null) ? 0 : parseInt(prop);
    }
	function eventTarget (event) {
		return event.target || event.srcElement;
	}
	
	// storage functions
	// load state and returns the array
	function loadState(key) {
		var state = localStorage.getItem(key);

		if (state != null) {
			try {
				state = JSON.parse(state);
			} catch (e) {
				state = new Array();
			}
		} else {
			state = new Array();
		}

		return state;
	}
	function getIndex(state, searchId) {
		//find element
		var index = state.findIndex(function (element, index, array) {
			var id = element.id;
			if (id != searchId) {
				return false;
			} else {
				return true;
			}
		});
		
		return index;
	}
	function saveState(key, table /* name, prop*/) {
		// ie in offline mode can't use localStorage,
		// use alternative storage like
		// https://github.com/andris9/simpleStorage
		// or many more alternatives on
		// https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills
		if (!localStorage) {
            console.log('localStorage not supported or not usable (i.e. ie in offline mode).');
			return; 
		}
		
		var state = loadState(key),
			id = table.getAttribute('id'),
			element = {id: id},
			index = getIndex(state, id);
			
		for (var i = 2; i < arguments.length; i+=2) {
			element[arguments[i]] = arguments[i+1];
		}

		// place element
		if (index < 0) {
			state.push(element);
		} else {
			state.splice(index, 1, element);
		}

		localStorage.setItem(key, JSON.stringify(state));
	}
	function restoreState(key, table, name) {
		// ie in offline mode can't use localStorage,
		// use alternative storage like
		// https://github.com/andris9/simpleStorage
		// or many more alternatives on
		// https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills
		if (!localStorage) {
            console.log('localStorage not supported or not usable (i.e. ie in offline mode).');
			return; 
		}
		
		var state = loadState(key),
			id = table.getAttribute('id'),
			index = getIndex(state, id);
	
		if (index >= 0) {
			var element = state[index],
				memory = element[name],
				length = memory.length,
				nc = table.rows[0].cells.length;
	
			//check length
			if (nc == length) {
				for (var i = 0; i < nc; i++) {
					var cell = table.rows[0].cells[i];
					cell.style.maxWidth = cell.style.width = memory[i];
				}
			}
		}			
	}

	// private functions
	
	ResizeHandler.prototype._init = function () {
        for (var i = 0; i < this.nc; i++) {
            var cell = this.hr.cells[i],
				width = elementStyleProperty(cell, 'width'),
				width = width == 'auto'?(cell.clientWidth-numericProperty(elementStyleProperty(cell, 'paddingLeft'))-numericProperty(elementStyleProperty(cell, 'paddingRight')))+'px':width; // ie8 support
            cell.style.width = width;
        }
		
		if (this.options.restoreState)
			restoreState('table-resize', this.table, 'resize');
	};

	// the overriden placeholder methods
	
	ResizeHandler.prototype._mousePrepareDrag = function (event) {
		// initial column
        this.ic = eventTarget(event).parentNode.parentNode.cellIndex;
        var initialColumn = this.ic,
			fixed = this.options.fixed,
			cell = [],
			width = [];
		for (var i = 0; i < 2; i++) {
			cell[i] = this.hr.cells[initialColumn+(i?fixed:i)];
			width[i] = numericProperty(cell[i].style.width);
		}
	
        for (var i = 0; i < this.nr; i++) {
			for (var j = 0; j <= fixed; j++) {
				cell = this.table.rows[i].cells[initialColumn+j];
				cell.style.maxWidth = cell.style.width = width[j] + 'px';
			}
        }

        // replace current document cursor
        this.cur = document.body.style.cursor;
        document.body.style.cursor = 'col-resize';

        return true;
	};
	ResizeHandler.prototype._mouseDrag = function (event) {
        var dist = eventPageX(event) - eventPageX(this._mouseDownEvent),
            initialColumn = this.ic,
			fixed = this.options.fixed,
			cell = [],
			width = [];
		for (var i = 0; i < 2; i++) {
			cell[i] = this.hr.cells[initialColumn+(i?fixed:i)];
			width[i] = numericProperty(cell[i].style.width);
		}

        if (width[0] <= -dist || width[1] <= dist) {
            this._mouseStopDrag(event);
        } else {
            var newWidth = [width[0] + dist, width[1] - dist];
            if (newWidth[0] > this.options.minWidth && newWidth[1] > this.options.minWidth) {

                for (var i = 0; i < this.nr; i++) {
					for (var j = 0; j <= fixed; j++) {
						cell = this.table.rows[i].cells[initialColumn+j];
						cell.style.maxWidth = cell.style.width = newWidth[j] + 'px';
					}
                }

				this._mouseDownEvent = event;
				if (!event.which) { // detect ie8
					var copy = {};
					for (var attr in event) {
						copy[attr] = event[attr];
					}
					this._mouseDownEvent = copy;
				}
            }
        }
	}
	ResizeHandler.prototype._mouseStopDrag = function () {
		var temp = new Array(this.nc);
        for (var i = 0; i < this.nc; i++) {
            var cell = this.hr.cells[i];
            temp[i] = cell.style.width;
        }
		
		if (this.options.restoreState)
			this.options.callback(this.table,temp);
			// saveState('table-resize', this.table, 'resize', temp);
	
        // restore mouse cursor
        document.body.style.cursor = this.cur;
	};

    function TableResize(table, options) {
		// check input
        if (table && table.tagName !== 'TABLE') {
			console.log('ERROR: DOM element/input is not a table!');
			console.log(table)
            return;
        }
		
        // check empty table
        if (!(table && table.rows && table.rows.length > 0)) {
			console.log('WARNING: Empty table.');
            return;
        }

		options = options || {};
        var resizeHandler = new ResizeHandler(table, options);
		
        // attach handlers to each cell of the header row.
		var length = resizeHandler.hr.cells.length;
        for (var i = 0; i < ((options.fixed)?(length-1):length); i++) {
            var cell = resizeHandler.hr.cells[i];
            cell.innerHTML = '<div class=\"resize-base\"><div class=\"resize-elem\"></div><div class=\"resize-text\">' + cell.innerHTML + '</div></div>';

            utils.addEvent(cell.childNodes[0].childNodes[0], 'mousedown', function (event) {
                resizeHandler._mouseDown(event);
            });
        }
    }
	
    // export
    
export default TableResize;
