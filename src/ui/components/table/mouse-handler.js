"use strict";
import utils from './utils';

function MouseHandler () {}
MouseHandler.prototype = (function () {
	// helper functions
	
	// Cross browser event data based on
	// jquery implementation
	function getEvent(event) {
		return event || window.event;
	}
	function eventWhich(event) {
		return event.which || event.button;
	}
	function eventPageX(event) {
		var pageX = event.pageX;

		if (typeof pageX == 'undefined') {
			var body = document.body;
			var docElem = document.documentElement;
			pageX = event.clientX + (docElem && docElem.scrollLeft || body && body.scrollLeft || 0) - (docElem && docElem.clientLeft || body && body.clientLeft || 0);
		}

		return pageX;
	}
	function eventPageY(event) {
		var pageY = event.pageY;

		if (typeof pageY == 'undefined') {
			var body = document.body;
			var docElem = document.documentElement;
			pageY = event.clientY + (docElem && docElem.scrollTop || body && body.scrollTop || 0) - (docElem && docElem.clientTop || body && body.clientTop || 0);
		}

		return pageY;
	}
	
	// prototype functions
	
    function _mouseDown(event) {
		// ie8 support
        event = getEvent(event);

        // we may have missed mouseup (out of window) - clean start, reset all
        (this._mouseStarted && this._mouseUp(event));

        // to compute the first (and the following) mouse move correctly
        this._mouseDownEvent = event;
		// the above line only works for ie>8,  because _mouseDownEvent is a reference to the event
		// so in ie8 you have two references (_mouseDownEvent and event) which points to the same object, the window.event
		// to overcome this, you need a copy of the event e.g.
		if (!event.which) { // detect ie8
			var copy = {};
			for (var attr in event) {
				copy[attr] = event[attr];
			}
			this._mouseDownEvent = copy;
		}

        // only left mouse button down is of interest
		// ie8 support
        if (eventWhich(event) !== 1) {
            return true;
        }

        // lets start and check distance first
        if (this.options.distance == 0) {
			this._mouseStarted = this._mousePrepareDrag(event) !== false;
			if (!this._mouseStarted) {
				// ie8 support
				
				(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
				(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));
				
				return true;
            }
        } else {
			this._mousePrepareClick(event);
		}

        // to keep context
        var _this = this;
        this._mouseMoveDelegate = function (event) {
            return _this._mouseMove(event);
        };
        this._mouseUpDelegate = function (event) {
            return _this._mouseUp(event);
        };

        utils.addEvent(document.body, 'mousemove', this._mouseMoveDelegate);
        utils.addEvent(document.body, 'mouseup', this._mouseUpDelegate);

		// ie8 support
		(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
		(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));

        return true;
	}
    function _mouseMove(event) {
		// ie8 support
        event = getEvent(event);

        // Iframe mouseup check - mouseup occurred in another document
        if (!eventWhich(event)) {
            return this._mouseUp(event);
        }

        // drag functionality
        if (this._mouseStarted) {
		
            this._mouseDrag(event);
            
			// ie8 support
			(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
			(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));

            return false;
        }

        // check distance (no action circle)
        if (this._mouseDistanceMet(event, this._mouseDownEvent)) {
			// lets start
            this._mouseStarted = (this._mousePrepareDrag(this._mouseDownEvent, event) !== false);
			// and move or stop
            (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
        }

		// ie8 support
		(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
		(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));
		
        return !this.mouseStarted;
	}
    function _mouseUp(event) {
		// ie8 support
        event = getEvent(event);
		
        utils.removeEvent(document.body, 'mousemove', this._mouseMoveDelegate);
        utils.removeEvent(document.body, 'mouseup', this._mouseUpDelegate);

        if (this._mouseStarted) {
            this._mouseStarted = false;

			this._mouseStopDrag(event);
        } else {
			this._mouseExecuteClick(event);
		}

		// ie8 support
		(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
		(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));
			
        return false;
	}
    function _mouseDistanceMet(newEvent, lastEvent) {
		var x = Math.abs(eventPageX(lastEvent) - eventPageX(newEvent)),
			y = Math.abs(eventPageY(lastEvent) - eventPageY(newEvent));
		return (Math.sqrt(x*x + y*y)) >= this.options.distance;
	}

    // These are placeholder methods, to be overriden by extentions
    function _mousePrepareClick() {}
	function _mousePrepareDrag() {}
    function _mouseDrag(event) {}
    function _mouseExecuteClick() {}
	function _mouseStopDrag() {}
	
	return {
		constructor: MouseHandler,
		options: {
            distance: 0
		},
		_mouseDown: _mouseDown,
		_mouseMove: _mouseMove,
		_mouseUp: _mouseUp,
		_mouseDistanceMet: _mouseDistanceMet,
		_mousePrepareClick: _mousePrepareClick,
		_mousePrepareDrag: _mousePrepareDrag,
		_mouseDrag: _mouseDrag,
		_mouseExecuteClick: _mouseExecuteClick,
		_mouseStopDrag: _mouseStopDrag
	};
})();

export default MouseHandler;