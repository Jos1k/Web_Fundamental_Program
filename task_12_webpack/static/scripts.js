/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const AppInstanse = __webpack_require__(3);

class SuperFramework{
    static createRoot(appName) {
        return new AppInstanse(appName);
    }
}

module.exports = SuperFramework;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * Because there weren’t enough autocomplete scripts in the world? Because I’m completely insane and have NIH syndrome? Probably both. :P
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license
 */

(function () {

var _ = function (input, o) {
	var me = this;

	// Setup

	this.isOpened = false;

	this.input = $(input);
	this.input.setAttribute("autocomplete", "off");
	this.input.setAttribute("aria-autocomplete", "list");

	o = o || {};

	configure(this, {
		minChars: 2,
		maxItems: 10,
		autoFirst: false,
		data: _.DATA,
		filter: _.FILTER_CONTAINS,
		sort: o.sort === false ? false : _.SORT_BYLENGTH,
		item: _.ITEM,
		replace: _.REPLACE
	}, o);

	this.index = -1;

	// Create necessary elements

	this.container = $.create("div", {
		className: "awesomplete",
		around: input
	});

	this.ul = $.create("ul", {
		hidden: "hidden",
		inside: this.container
	});

	this.status = $.create("span", {
		className: "visually-hidden",
		role: "status",
		"aria-live": "assertive",
		"aria-relevant": "additions",
		inside: this.container
	});

	// Bind events

	$.bind(this.input, {
		"input": this.evaluate.bind(this),
		"blur": this.close.bind(this, { reason: "blur" }),
		"keydown": function(evt) {
			var c = evt.keyCode;

			// If the dropdown `ul` is in view, then act on keydown for the following keys:
			// Enter / Esc / Up / Down
			if(me.opened) {
				if (c === 13 && me.selected) { // Enter
					evt.preventDefault();
					me.select();
				}
				else if (c === 27) { // Esc
					me.close({ reason: "esc" });
				}
				else if (c === 38 || c === 40) { // Down/Up arrow
					evt.preventDefault();
					me[c === 38? "previous" : "next"]();
				}
			}
		}
	});

	$.bind(this.input.form, {"submit": this.close.bind(this, { reason: "submit" })});

	$.bind(this.ul, {"mousedown": function(evt) {
		var li = evt.target;

		if (li !== this) {

			while (li && !/li/i.test(li.nodeName)) {
				li = li.parentNode;
			}

			if (li && evt.button === 0) {  // Only select on left click
				evt.preventDefault();
				me.select(li, evt.target);
			}
		}
	}});

	if (this.input.hasAttribute("list")) {
		this.list = "#" + this.input.getAttribute("list");
		this.input.removeAttribute("list");
	}
	else {
		this.list = this.input.getAttribute("data-list") || o.list || [];
	}

	_.all.push(this);
};

_.prototype = {
	set list(list) {
		if (Array.isArray(list)) {
			this._list = list;
		}
		else if (typeof list === "string" && list.indexOf(",") > -1) {
				this._list = list.split(/\s*,\s*/);
		}
		else { // Element or CSS selector
			list = $(list);

			if (list && list.children) {
				var items = [];
				slice.apply(list.children).forEach(function (el) {
					if (!el.disabled) {
						var text = el.textContent.trim();
						var value = el.value || text;
						var label = el.label || text;
						if (value !== "") {
							items.push({ label: label, value: value });
						}
					}
				});
				this._list = items;
			}
		}

		if (document.activeElement === this.input) {
			this.evaluate();
		}
	},

	get selected() {
		return this.index > -1;
	},

	get opened() {
		return this.isOpened;
	},

	close: function (o) {
		if (!this.opened) {
			return;
		}

		this.ul.setAttribute("hidden", "");
		this.isOpened = false;
		this.index = -1;

		$.fire(this.input, "awesomplete-close", o || {});
	},

	open: function () {
		this.ul.removeAttribute("hidden");
		this.isOpened = true;

		if (this.autoFirst && this.index === -1) {
			this.goto(0);
		}

		$.fire(this.input, "awesomplete-open");
	},

	next: function () {
		var count = this.ul.children.length;
		this.goto(this.index < count - 1 ? this.index + 1 : (count ? 0 : -1) );
	},

	previous: function () {
		var count = this.ul.children.length;
		var pos = this.index - 1;

		this.goto(this.selected && pos !== -1 ? pos : count - 1);
	},

	// Should not be used, highlights specific item without any checks!
	goto: function (i) {
		var lis = this.ul.children;

		if (this.selected) {
			lis[this.index].setAttribute("aria-selected", "false");
		}

		this.index = i;

		if (i > -1 && lis.length > 0) {
			lis[i].setAttribute("aria-selected", "true");
			this.status.textContent = lis[i].textContent;

			// scroll to highlighted element in case parent's height is fixed
			this.ul.scrollTop = lis[i].offsetTop - this.ul.clientHeight + lis[i].clientHeight;

			$.fire(this.input, "awesomplete-highlight", {
				text: this.suggestions[this.index]
			});
		}
	},

	select: function (selected, origin) {
		if (selected) {
			this.index = $.siblingIndex(selected);
		} else {
			selected = this.ul.children[this.index];
		}

		if (selected) {
			var suggestion = this.suggestions[this.index];

			var allowed = $.fire(this.input, "awesomplete-select", {
				text: suggestion,
				origin: origin || selected
			});

			if (allowed) {
				this.replace(suggestion);
				this.close({ reason: "select" });
				$.fire(this.input, "awesomplete-selectcomplete", {
					text: suggestion
				});
			}
		}
	},

	evaluate: function() {
		var me = this;
		var value = this.input.value;

		if (value.length >= this.minChars && this._list.length > 0) {
			this.index = -1;
			// Populate list with options that match
			this.ul.innerHTML = "";

			this.suggestions = this._list
				.map(function(item) {
					return new Suggestion(me.data(item, value));
				})
				.filter(function(item) {
					return me.filter(item, value);
				});

			if (this.sort !== false) {
				this.suggestions = this.suggestions.sort(this.sort);
			}

			this.suggestions = this.suggestions.slice(0, this.maxItems);

			this.suggestions.forEach(function(text) {
					me.ul.appendChild(me.item(text, value));
				});

			if (this.ul.children.length === 0) {
				this.close({ reason: "nomatches" });
			} else {
				this.open();
			}
		}
		else {
			this.close({ reason: "nomatches" });
		}
	}
};

// Static methods/properties

_.all = [];

_.FILTER_CONTAINS = function (text, input) {
	return RegExp($.regExpEscape(input.trim()), "i").test(text);
};

_.FILTER_STARTSWITH = function (text, input) {
	return RegExp("^" + $.regExpEscape(input.trim()), "i").test(text);
};

_.SORT_BYLENGTH = function (a, b) {
	if (a.length !== b.length) {
		return a.length - b.length;
	}

	return a < b? -1 : 1;
};

_.ITEM = function (text, input) {
	var html = input.trim() === '' ? text : text.replace(RegExp($.regExpEscape(input.trim()), "gi"), "<mark>$&</mark>");
	return $.create("li", {
		innerHTML: html,
		"aria-selected": "false"
	});
};

_.REPLACE = function (text) {
	this.input.value = text.value;
};

_.DATA = function (item/*, input*/) { return item; };

// Private functions

function Suggestion(data) {
	var o = Array.isArray(data)
	  ? { label: data[0], value: data[1] }
	  : typeof data === "object" && "label" in data && "value" in data ? data : { label: data, value: data };

	this.label = o.label || o.value;
	this.value = o.value;
}
Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
	get: function() { return this.label.length; }
});
Suggestion.prototype.toString = Suggestion.prototype.valueOf = function () {
	return "" + this.label;
};

function configure(instance, properties, o) {
	for (var i in properties) {
		var initial = properties[i],
		    attrValue = instance.input.getAttribute("data-" + i.toLowerCase());

		if (typeof initial === "number") {
			instance[i] = parseInt(attrValue);
		}
		else if (initial === false) { // Boolean options must be false by default anyway
			instance[i] = attrValue !== null;
		}
		else if (initial instanceof Function) {
			instance[i] = null;
		}
		else {
			instance[i] = attrValue;
		}

		if (!instance[i] && instance[i] !== 0) {
			instance[i] = (i in o)? o[i] : initial;
		}
	}
}

// Helpers

var slice = Array.prototype.slice;

function $(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

function $$(expr, con) {
	return slice.call((con || document).querySelectorAll(expr));
}

$.create = function(tag, o) {
	var element = document.createElement(tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$(val).appendChild(element);
		}
		else if (i === "around") {
			var ref = $(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		}
		else if (i in element) {
			element[i] = val;
		}
		else {
			element.setAttribute(i, val);
		}
	}

	return element;
};

$.bind = function(element, o) {
	if (element) {
		for (var event in o) {
			var callback = o[event];

			event.split(/\s+/).forEach(function (event) {
				element.addEventListener(event, callback);
			});
		}
	}
};

$.fire = function(target, type, properties) {
	var evt = document.createEvent("HTMLEvents");

	evt.initEvent(type, true, true );

	for (var j in properties) {
		evt[j] = properties[j];
	}

	return target.dispatchEvent(evt);
};

$.regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

$.siblingIndex = function (el) {
	/* eslint-disable no-cond-assign */
	for (var i = 0; el = el.previousElementSibling; i++);
	return i;
};

// Initialization

function init() {
	$$("input.awesomplete").forEach(function (input) {
		new _(input);
	});
}

// Are we in a browser? Check for Document constructor
if (typeof Document !== "undefined") {
	// DOM already loaded?
	if (document.readyState !== "loading") {
		init();
	}
	else {
		// Wait for it
		document.addEventListener("DOMContentLoaded", init);
	}
}

_.$ = $;
_.$$ = $$;

// Make sure to export Awesomplete on self when in a browser
if (typeof self !== "undefined") {
	self.Awesomplete = _;
}

// Expose Awesomplete as a CJS module
if (typeof module === "object" && module.exports) {
	module.exports = _;
}

return _;

}());


/***/ }),
/* 3 */
/***/ (function(module, exports) {

const privateProperties = new WeakMap();
const getContent = (templateUri) => {
    return fetch(templateUri).then(response => {
        return response.text().then(text => {
            return text;
        });
    }).catch(ex => {throw ex;});
};

class AppInstanse {
    constructor(appName) {
        privateProperties.set(this, {});

        privateProperties.get(this).applicationName = appName;
        privateProperties.get(this).content_area = document.querySelector('[wd-root]', appName);
    }

    root() { return privateProperties.get(this).content_area; }

    routes(routeList) {
        privateProperties.get(this).appRoutes = routeList;
        return this;
    }

    navigate(templateUrl) {
        const route = privateProperties.get(this).appRoutes.find(element => {
            return element.url === templateUrl;
        });

        return getContent(route.templateUrl).then(content => {
            privateProperties.get(this).content_area.innerHTML = content;
            history.pushState(content, null, route.url);
        }).catch(ex => {throw ex;});
    }

    component(name, description) {
        const componentProto = Object.create(HTMLElement.prototype);
        const that = this;

        const getComponentData = (element) => {
            const componentData = {};
            componentData.innerHTML = element.innerHTML;
            Array.prototype.slice.call(element.attributes)
                .forEach((attr) => componentData[attr.name] = attr.value);
            return componentData;
        };

        componentProto.createdCallback = function () {
            const newComponent = new DOMParser()
                .parseFromString(description.template, 'text/html')
                .body.firstChild;

            const oldComponentData = getComponentData(this);

            description.beforeMount(that, newComponent, oldComponentData);
            this.parentNode.replaceChild(newComponent, this);
        };

        document.registerElement(name, { prototype: componentProto});
        return this;
    }
}

module.exports = AppInstanse;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
const Awesomplete = __webpack_require__(2);
const SuperFramework = __webpack_require__(0);

window.addEventListener('load', () => {
    const myApp = SuperFramework.createRoot('app')
        .routes([
            { url: '/', templateUrl: 'views/main.html' },
            { url: '/sign-in', templateUrl: 'views/sign-in.html' }
        ])
        .component('in-link', {
            template: '<a href=""></a>',
            beforeMount: function (app, element, componentData) {
                element.innerHTML = componentData.innerHTML;
                element.setAttribute('href', componentData.href);
                element.setAttribute('class', componentData.class);
                element.addEventListener('click', (event) => {
                    app.navigate(element.getAttribute('href'));
                    event.preventDefault();
                });
            }
        })
        .component('in-search', {
            template: '<span><input data-list=""/></span>',
            beforeMount: function (app, element, componentData) {
                const searchInput = element.children[0];
                searchInput.setAttribute('placeholder', componentData.placeholder);
                searchInput.setAttribute('class', componentData.class);

                element.addEventListener('input', (event) => {
                    if (event.target && event.target.nodeName == 'INPUT') {
                        awesomplete._list = [];
                        if (!event.target.value) {
                            return;
                        }
                        fetch('http://127.0.0.1:8082/api/search?query=' + event.target.value, {
                            method: 'post'
                        }).then((response) => {
                            if (!response.ok) {
                                throw response.statusText;
                            }
                            response.json().then((result) => {
                                awesomplete._list = result;
                                awesomplete.evaluate();
                            });
                        }).catch((error) => {
                            throw error;
                        });
                        event.stopPropagation();
                    }
                }, true);

                const awesomplete = new Awesomplete(searchInput,
                    { filter: () => { return true; } });
            }
        });

    myApp.navigate('/');
    window.addEventListener('popstate', event => myApp.root().innerHTML = event.state);
});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTc2MTkwMWJhZWY5OTMzZmI4MDUiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zdXBlckZyYW1ld29yay5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMvc2Fzcy9zdHlsZS5zY3NzIiwid2VicGFjazovLy8uL2xpYnMvYXdlc29tcGxldGUvYXdlc29tcGxldGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcHBJbnN0YW5zZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2hFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDOzs7Ozs7QUNSQSx5Qzs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FB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O0FBQzdCLHlCQUF5QjtBQUN6QjtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBLHFCQUFxQixnQkFBZ0IsYUFBYSxFQUFFLEVBQUU7QUFDdEQ7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlNzYxOTAxYmFlZjk5MzNmYjgwNSIsImNvbnN0IEFwcEluc3RhbnNlID0gcmVxdWlyZSgnLi9hcHBJbnN0YW5zZScpO1xyXG5cclxuY2xhc3MgU3VwZXJGcmFtZXdvcmt7XHJcbiAgICBzdGF0aWMgY3JlYXRlUm9vdChhcHBOYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcHBJbnN0YW5zZShhcHBOYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdXBlckZyYW1ld29yaztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvc3VwZXJGcmFtZXdvcmsuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3N0eWxlcy9zYXNzL3N0eWxlLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBTaW1wbGUsIGxpZ2h0d2VpZ2h0LCB1c2FibGUgbG9jYWwgYXV0b2NvbXBsZXRlIGxpYnJhcnkgZm9yIG1vZGVybiBicm93c2Vyc1xuICogQmVjYXVzZSB0aGVyZSB3ZXJlbuKAmXQgZW5vdWdoIGF1dG9jb21wbGV0ZSBzY3JpcHRzIGluIHRoZSB3b3JsZD8gQmVjYXVzZSBJ4oCZbSBjb21wbGV0ZWx5IGluc2FuZSBhbmQgaGF2ZSBOSUggc3luZHJvbWU/IFByb2JhYmx5IGJvdGguIDpQXG4gKiBAYXV0aG9yIExlYSBWZXJvdSBodHRwOi8vbGVhdmVyb3UuZ2l0aHViLmlvL2F3ZXNvbXBsZXRlXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbnZhciBfID0gZnVuY3Rpb24gKGlucHV0LCBvKSB7XG5cdHZhciBtZSA9IHRoaXM7XG5cblx0Ly8gU2V0dXBcblxuXHR0aGlzLmlzT3BlbmVkID0gZmFsc2U7XG5cblx0dGhpcy5pbnB1dCA9ICQoaW5wdXQpO1xuXHR0aGlzLmlucHV0LnNldEF0dHJpYnV0ZShcImF1dG9jb21wbGV0ZVwiLCBcIm9mZlwiKTtcblx0dGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWF1dG9jb21wbGV0ZVwiLCBcImxpc3RcIik7XG5cblx0byA9IG8gfHwge307XG5cblx0Y29uZmlndXJlKHRoaXMsIHtcblx0XHRtaW5DaGFyczogMixcblx0XHRtYXhJdGVtczogMTAsXG5cdFx0YXV0b0ZpcnN0OiBmYWxzZSxcblx0XHRkYXRhOiBfLkRBVEEsXG5cdFx0ZmlsdGVyOiBfLkZJTFRFUl9DT05UQUlOUyxcblx0XHRzb3J0OiBvLnNvcnQgPT09IGZhbHNlID8gZmFsc2UgOiBfLlNPUlRfQllMRU5HVEgsXG5cdFx0aXRlbTogXy5JVEVNLFxuXHRcdHJlcGxhY2U6IF8uUkVQTEFDRVxuXHR9LCBvKTtcblxuXHR0aGlzLmluZGV4ID0gLTE7XG5cblx0Ly8gQ3JlYXRlIG5lY2Vzc2FyeSBlbGVtZW50c1xuXG5cdHRoaXMuY29udGFpbmVyID0gJC5jcmVhdGUoXCJkaXZcIiwge1xuXHRcdGNsYXNzTmFtZTogXCJhd2Vzb21wbGV0ZVwiLFxuXHRcdGFyb3VuZDogaW5wdXRcblx0fSk7XG5cblx0dGhpcy51bCA9ICQuY3JlYXRlKFwidWxcIiwge1xuXHRcdGhpZGRlbjogXCJoaWRkZW5cIixcblx0XHRpbnNpZGU6IHRoaXMuY29udGFpbmVyXG5cdH0pO1xuXG5cdHRoaXMuc3RhdHVzID0gJC5jcmVhdGUoXCJzcGFuXCIsIHtcblx0XHRjbGFzc05hbWU6IFwidmlzdWFsbHktaGlkZGVuXCIsXG5cdFx0cm9sZTogXCJzdGF0dXNcIixcblx0XHRcImFyaWEtbGl2ZVwiOiBcImFzc2VydGl2ZVwiLFxuXHRcdFwiYXJpYS1yZWxldmFudFwiOiBcImFkZGl0aW9uc1wiLFxuXHRcdGluc2lkZTogdGhpcy5jb250YWluZXJcblx0fSk7XG5cblx0Ly8gQmluZCBldmVudHNcblxuXHQkLmJpbmQodGhpcy5pbnB1dCwge1xuXHRcdFwiaW5wdXRcIjogdGhpcy5ldmFsdWF0ZS5iaW5kKHRoaXMpLFxuXHRcdFwiYmx1clwiOiB0aGlzLmNsb3NlLmJpbmQodGhpcywgeyByZWFzb246IFwiYmx1clwiIH0pLFxuXHRcdFwia2V5ZG93blwiOiBmdW5jdGlvbihldnQpIHtcblx0XHRcdHZhciBjID0gZXZ0LmtleUNvZGU7XG5cblx0XHRcdC8vIElmIHRoZSBkcm9wZG93biBgdWxgIGlzIGluIHZpZXcsIHRoZW4gYWN0IG9uIGtleWRvd24gZm9yIHRoZSBmb2xsb3dpbmcga2V5czpcblx0XHRcdC8vIEVudGVyIC8gRXNjIC8gVXAgLyBEb3duXG5cdFx0XHRpZihtZS5vcGVuZWQpIHtcblx0XHRcdFx0aWYgKGMgPT09IDEzICYmIG1lLnNlbGVjdGVkKSB7IC8vIEVudGVyXG5cdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0bWUuc2VsZWN0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoYyA9PT0gMjcpIHsgLy8gRXNjXG5cdFx0XHRcdFx0bWUuY2xvc2UoeyByZWFzb246IFwiZXNjXCIgfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoYyA9PT0gMzggfHwgYyA9PT0gNDApIHsgLy8gRG93bi9VcCBhcnJvd1xuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdG1lW2MgPT09IDM4PyBcInByZXZpb3VzXCIgOiBcIm5leHRcIl0oKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0JC5iaW5kKHRoaXMuaW5wdXQuZm9ybSwge1wic3VibWl0XCI6IHRoaXMuY2xvc2UuYmluZCh0aGlzLCB7IHJlYXNvbjogXCJzdWJtaXRcIiB9KX0pO1xuXG5cdCQuYmluZCh0aGlzLnVsLCB7XCJtb3VzZWRvd25cIjogZnVuY3Rpb24oZXZ0KSB7XG5cdFx0dmFyIGxpID0gZXZ0LnRhcmdldDtcblxuXHRcdGlmIChsaSAhPT0gdGhpcykge1xuXG5cdFx0XHR3aGlsZSAobGkgJiYgIS9saS9pLnRlc3QobGkubm9kZU5hbWUpKSB7XG5cdFx0XHRcdGxpID0gbGkucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxpICYmIGV2dC5idXR0b24gPT09IDApIHsgIC8vIE9ubHkgc2VsZWN0IG9uIGxlZnQgY2xpY2tcblx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdG1lLnNlbGVjdChsaSwgZXZ0LnRhcmdldCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9fSk7XG5cblx0aWYgKHRoaXMuaW5wdXQuaGFzQXR0cmlidXRlKFwibGlzdFwiKSkge1xuXHRcdHRoaXMubGlzdCA9IFwiI1wiICsgdGhpcy5pbnB1dC5nZXRBdHRyaWJ1dGUoXCJsaXN0XCIpO1xuXHRcdHRoaXMuaW5wdXQucmVtb3ZlQXR0cmlidXRlKFwibGlzdFwiKTtcblx0fVxuXHRlbHNlIHtcblx0XHR0aGlzLmxpc3QgPSB0aGlzLmlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtbGlzdFwiKSB8fCBvLmxpc3QgfHwgW107XG5cdH1cblxuXHRfLmFsbC5wdXNoKHRoaXMpO1xufTtcblxuXy5wcm90b3R5cGUgPSB7XG5cdHNldCBsaXN0KGxpc3QpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShsaXN0KSkge1xuXHRcdFx0dGhpcy5fbGlzdCA9IGxpc3Q7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSBcInN0cmluZ1wiICYmIGxpc3QuaW5kZXhPZihcIixcIikgPiAtMSkge1xuXHRcdFx0XHR0aGlzLl9saXN0ID0gbGlzdC5zcGxpdCgvXFxzKixcXHMqLyk7XG5cdFx0fVxuXHRcdGVsc2UgeyAvLyBFbGVtZW50IG9yIENTUyBzZWxlY3RvclxuXHRcdFx0bGlzdCA9ICQobGlzdCk7XG5cblx0XHRcdGlmIChsaXN0ICYmIGxpc3QuY2hpbGRyZW4pIHtcblx0XHRcdFx0dmFyIGl0ZW1zID0gW107XG5cdFx0XHRcdHNsaWNlLmFwcGx5KGxpc3QuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRcdFx0aWYgKCFlbC5kaXNhYmxlZCkge1xuXHRcdFx0XHRcdFx0dmFyIHRleHQgPSBlbC50ZXh0Q29udGVudC50cmltKCk7XG5cdFx0XHRcdFx0XHR2YXIgdmFsdWUgPSBlbC52YWx1ZSB8fCB0ZXh0O1xuXHRcdFx0XHRcdFx0dmFyIGxhYmVsID0gZWwubGFiZWwgfHwgdGV4dDtcblx0XHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRpdGVtcy5wdXNoKHsgbGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5fbGlzdCA9IGl0ZW1zO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmlucHV0KSB7XG5cdFx0XHR0aGlzLmV2YWx1YXRlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGdldCBzZWxlY3RlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5pbmRleCA+IC0xO1xuXHR9LFxuXG5cdGdldCBvcGVuZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXNPcGVuZWQ7XG5cdH0sXG5cblx0Y2xvc2U6IGZ1bmN0aW9uIChvKSB7XG5cdFx0aWYgKCF0aGlzLm9wZW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMudWwuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuXHRcdHRoaXMuaXNPcGVuZWQgPSBmYWxzZTtcblx0XHR0aGlzLmluZGV4ID0gLTE7XG5cblx0XHQkLmZpcmUodGhpcy5pbnB1dCwgXCJhd2Vzb21wbGV0ZS1jbG9zZVwiLCBvIHx8IHt9KTtcblx0fSxcblxuXHRvcGVuOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy51bC5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG5cdFx0dGhpcy5pc09wZW5lZCA9IHRydWU7XG5cblx0XHRpZiAodGhpcy5hdXRvRmlyc3QgJiYgdGhpcy5pbmRleCA9PT0gLTEpIHtcblx0XHRcdHRoaXMuZ290bygwKTtcblx0XHR9XG5cblx0XHQkLmZpcmUodGhpcy5pbnB1dCwgXCJhd2Vzb21wbGV0ZS1vcGVuXCIpO1xuXHR9LFxuXG5cdG5leHQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgY291bnQgPSB0aGlzLnVsLmNoaWxkcmVuLmxlbmd0aDtcblx0XHR0aGlzLmdvdG8odGhpcy5pbmRleCA8IGNvdW50IC0gMSA/IHRoaXMuaW5kZXggKyAxIDogKGNvdW50ID8gMCA6IC0xKSApO1xuXHR9LFxuXG5cdHByZXZpb3VzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGNvdW50ID0gdGhpcy51bC5jaGlsZHJlbi5sZW5ndGg7XG5cdFx0dmFyIHBvcyA9IHRoaXMuaW5kZXggLSAxO1xuXG5cdFx0dGhpcy5nb3RvKHRoaXMuc2VsZWN0ZWQgJiYgcG9zICE9PSAtMSA/IHBvcyA6IGNvdW50IC0gMSk7XG5cdH0sXG5cblx0Ly8gU2hvdWxkIG5vdCBiZSB1c2VkLCBoaWdobGlnaHRzIHNwZWNpZmljIGl0ZW0gd2l0aG91dCBhbnkgY2hlY2tzIVxuXHRnb3RvOiBmdW5jdGlvbiAoaSkge1xuXHRcdHZhciBsaXMgPSB0aGlzLnVsLmNoaWxkcmVuO1xuXG5cdFx0aWYgKHRoaXMuc2VsZWN0ZWQpIHtcblx0XHRcdGxpc1t0aGlzLmluZGV4XS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIFwiZmFsc2VcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbmRleCA9IGk7XG5cblx0XHRpZiAoaSA+IC0xICYmIGxpcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRsaXNbaV0uc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBcInRydWVcIik7XG5cdFx0XHR0aGlzLnN0YXR1cy50ZXh0Q29udGVudCA9IGxpc1tpXS50ZXh0Q29udGVudDtcblxuXHRcdFx0Ly8gc2Nyb2xsIHRvIGhpZ2hsaWdodGVkIGVsZW1lbnQgaW4gY2FzZSBwYXJlbnQncyBoZWlnaHQgaXMgZml4ZWRcblx0XHRcdHRoaXMudWwuc2Nyb2xsVG9wID0gbGlzW2ldLm9mZnNldFRvcCAtIHRoaXMudWwuY2xpZW50SGVpZ2h0ICsgbGlzW2ldLmNsaWVudEhlaWdodDtcblxuXHRcdFx0JC5maXJlKHRoaXMuaW5wdXQsIFwiYXdlc29tcGxldGUtaGlnaGxpZ2h0XCIsIHtcblx0XHRcdFx0dGV4dDogdGhpcy5zdWdnZXN0aW9uc1t0aGlzLmluZGV4XVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNlbGVjdDogZnVuY3Rpb24gKHNlbGVjdGVkLCBvcmlnaW4pIHtcblx0XHRpZiAoc2VsZWN0ZWQpIHtcblx0XHRcdHRoaXMuaW5kZXggPSAkLnNpYmxpbmdJbmRleChzZWxlY3RlZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlbGVjdGVkID0gdGhpcy51bC5jaGlsZHJlblt0aGlzLmluZGV4XTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZWN0ZWQpIHtcblx0XHRcdHZhciBzdWdnZXN0aW9uID0gdGhpcy5zdWdnZXN0aW9uc1t0aGlzLmluZGV4XTtcblxuXHRcdFx0dmFyIGFsbG93ZWQgPSAkLmZpcmUodGhpcy5pbnB1dCwgXCJhd2Vzb21wbGV0ZS1zZWxlY3RcIiwge1xuXHRcdFx0XHR0ZXh0OiBzdWdnZXN0aW9uLFxuXHRcdFx0XHRvcmlnaW46IG9yaWdpbiB8fCBzZWxlY3RlZFxuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChhbGxvd2VkKSB7XG5cdFx0XHRcdHRoaXMucmVwbGFjZShzdWdnZXN0aW9uKTtcblx0XHRcdFx0dGhpcy5jbG9zZSh7IHJlYXNvbjogXCJzZWxlY3RcIiB9KTtcblx0XHRcdFx0JC5maXJlKHRoaXMuaW5wdXQsIFwiYXdlc29tcGxldGUtc2VsZWN0Y29tcGxldGVcIiwge1xuXHRcdFx0XHRcdHRleHQ6IHN1Z2dlc3Rpb25cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGV2YWx1YXRlOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWUgPSB0aGlzO1xuXHRcdHZhciB2YWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XG5cblx0XHRpZiAodmFsdWUubGVuZ3RoID49IHRoaXMubWluQ2hhcnMgJiYgdGhpcy5fbGlzdC5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLmluZGV4ID0gLTE7XG5cdFx0XHQvLyBQb3B1bGF0ZSBsaXN0IHdpdGggb3B0aW9ucyB0aGF0IG1hdGNoXG5cdFx0XHR0aGlzLnVsLmlubmVySFRNTCA9IFwiXCI7XG5cblx0XHRcdHRoaXMuc3VnZ2VzdGlvbnMgPSB0aGlzLl9saXN0XG5cdFx0XHRcdC5tYXAoZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBuZXcgU3VnZ2VzdGlvbihtZS5kYXRhKGl0ZW0sIHZhbHVlKSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBtZS5maWx0ZXIoaXRlbSwgdmFsdWUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0aWYgKHRoaXMuc29ydCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy5zdWdnZXN0aW9ucyA9IHRoaXMuc3VnZ2VzdGlvbnMuc29ydCh0aGlzLnNvcnQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnN1Z2dlc3Rpb25zID0gdGhpcy5zdWdnZXN0aW9ucy5zbGljZSgwLCB0aGlzLm1heEl0ZW1zKTtcblxuXHRcdFx0dGhpcy5zdWdnZXN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdFx0XHRtZS51bC5hcHBlbmRDaGlsZChtZS5pdGVtKHRleHQsIHZhbHVlKSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRpZiAodGhpcy51bC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0dGhpcy5jbG9zZSh7IHJlYXNvbjogXCJub21hdGNoZXNcIiB9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMub3BlbigpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuY2xvc2UoeyByZWFzb246IFwibm9tYXRjaGVzXCIgfSk7XG5cdFx0fVxuXHR9XG59O1xuXG4vLyBTdGF0aWMgbWV0aG9kcy9wcm9wZXJ0aWVzXG5cbl8uYWxsID0gW107XG5cbl8uRklMVEVSX0NPTlRBSU5TID0gZnVuY3Rpb24gKHRleHQsIGlucHV0KSB7XG5cdHJldHVybiBSZWdFeHAoJC5yZWdFeHBFc2NhcGUoaW5wdXQudHJpbSgpKSwgXCJpXCIpLnRlc3QodGV4dCk7XG59O1xuXG5fLkZJTFRFUl9TVEFSVFNXSVRIID0gZnVuY3Rpb24gKHRleHQsIGlucHV0KSB7XG5cdHJldHVybiBSZWdFeHAoXCJeXCIgKyAkLnJlZ0V4cEVzY2FwZShpbnB1dC50cmltKCkpLCBcImlcIikudGVzdCh0ZXh0KTtcbn07XG5cbl8uU09SVF9CWUxFTkdUSCA9IGZ1bmN0aW9uIChhLCBiKSB7XG5cdGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcblx0XHRyZXR1cm4gYS5sZW5ndGggLSBiLmxlbmd0aDtcblx0fVxuXG5cdHJldHVybiBhIDwgYj8gLTEgOiAxO1xufTtcblxuXy5JVEVNID0gZnVuY3Rpb24gKHRleHQsIGlucHV0KSB7XG5cdHZhciBodG1sID0gaW5wdXQudHJpbSgpID09PSAnJyA/IHRleHQgOiB0ZXh0LnJlcGxhY2UoUmVnRXhwKCQucmVnRXhwRXNjYXBlKGlucHV0LnRyaW0oKSksIFwiZ2lcIiksIFwiPG1hcms+JCY8L21hcms+XCIpO1xuXHRyZXR1cm4gJC5jcmVhdGUoXCJsaVwiLCB7XG5cdFx0aW5uZXJIVE1MOiBodG1sLFxuXHRcdFwiYXJpYS1zZWxlY3RlZFwiOiBcImZhbHNlXCJcblx0fSk7XG59O1xuXG5fLlJFUExBQ0UgPSBmdW5jdGlvbiAodGV4dCkge1xuXHR0aGlzLmlucHV0LnZhbHVlID0gdGV4dC52YWx1ZTtcbn07XG5cbl8uREFUQSA9IGZ1bmN0aW9uIChpdGVtLyosIGlucHV0Ki8pIHsgcmV0dXJuIGl0ZW07IH07XG5cbi8vIFByaXZhdGUgZnVuY3Rpb25zXG5cbmZ1bmN0aW9uIFN1Z2dlc3Rpb24oZGF0YSkge1xuXHR2YXIgbyA9IEFycmF5LmlzQXJyYXkoZGF0YSlcblx0ICA/IHsgbGFiZWw6IGRhdGFbMF0sIHZhbHVlOiBkYXRhWzFdIH1cblx0ICA6IHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmIFwibGFiZWxcIiBpbiBkYXRhICYmIFwidmFsdWVcIiBpbiBkYXRhID8gZGF0YSA6IHsgbGFiZWw6IGRhdGEsIHZhbHVlOiBkYXRhIH07XG5cblx0dGhpcy5sYWJlbCA9IG8ubGFiZWwgfHwgby52YWx1ZTtcblx0dGhpcy52YWx1ZSA9IG8udmFsdWU7XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU3VnZ2VzdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN0cmluZy5wcm90b3R5cGUpLCBcImxlbmd0aFwiLCB7XG5cdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmxhYmVsLmxlbmd0aDsgfVxufSk7XG5TdWdnZXN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IFN1Z2dlc3Rpb24ucHJvdG90eXBlLnZhbHVlT2YgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBcIlwiICsgdGhpcy5sYWJlbDtcbn07XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZShpbnN0YW5jZSwgcHJvcGVydGllcywgbykge1xuXHRmb3IgKHZhciBpIGluIHByb3BlcnRpZXMpIHtcblx0XHR2YXIgaW5pdGlhbCA9IHByb3BlcnRpZXNbaV0sXG5cdFx0ICAgIGF0dHJWYWx1ZSA9IGluc3RhbmNlLmlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtXCIgKyBpLnRvTG93ZXJDYXNlKCkpO1xuXG5cdFx0aWYgKHR5cGVvZiBpbml0aWFsID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRpbnN0YW5jZVtpXSA9IHBhcnNlSW50KGF0dHJWYWx1ZSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGluaXRpYWwgPT09IGZhbHNlKSB7IC8vIEJvb2xlYW4gb3B0aW9ucyBtdXN0IGJlIGZhbHNlIGJ5IGRlZmF1bHQgYW55d2F5XG5cdFx0XHRpbnN0YW5jZVtpXSA9IGF0dHJWYWx1ZSAhPT0gbnVsbDtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoaW5pdGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG5cdFx0XHRpbnN0YW5jZVtpXSA9IG51bGw7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aW5zdGFuY2VbaV0gPSBhdHRyVmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCFpbnN0YW5jZVtpXSAmJiBpbnN0YW5jZVtpXSAhPT0gMCkge1xuXHRcdFx0aW5zdGFuY2VbaV0gPSAoaSBpbiBvKT8gb1tpXSA6IGluaXRpYWw7XG5cdFx0fVxuXHR9XG59XG5cbi8vIEhlbHBlcnNcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiAkKGV4cHIsIGNvbikge1xuXHRyZXR1cm4gdHlwZW9mIGV4cHIgPT09IFwic3RyaW5nXCI/IChjb24gfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3IoZXhwcikgOiBleHByIHx8IG51bGw7XG59XG5cbmZ1bmN0aW9uICQkKGV4cHIsIGNvbikge1xuXHRyZXR1cm4gc2xpY2UuY2FsbCgoY29uIHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKGV4cHIpKTtcbn1cblxuJC5jcmVhdGUgPSBmdW5jdGlvbih0YWcsIG8pIHtcblx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cblx0Zm9yICh2YXIgaSBpbiBvKSB7XG5cdFx0dmFyIHZhbCA9IG9baV07XG5cblx0XHRpZiAoaSA9PT0gXCJpbnNpZGVcIikge1xuXHRcdFx0JCh2YWwpLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChpID09PSBcImFyb3VuZFwiKSB7XG5cdFx0XHR2YXIgcmVmID0gJCh2YWwpO1xuXHRcdFx0cmVmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHJlZik7XG5cdFx0XHRlbGVtZW50LmFwcGVuZENoaWxkKHJlZik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGkgaW4gZWxlbWVudCkge1xuXHRcdFx0ZWxlbWVudFtpXSA9IHZhbDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShpLCB2YWwpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBlbGVtZW50O1xufTtcblxuJC5iaW5kID0gZnVuY3Rpb24oZWxlbWVudCwgbykge1xuXHRpZiAoZWxlbWVudCkge1xuXHRcdGZvciAodmFyIGV2ZW50IGluIG8pIHtcblx0XHRcdHZhciBjYWxsYmFjayA9IG9bZXZlbnRdO1xuXG5cdFx0XHRldmVudC5zcGxpdCgvXFxzKy8pLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59O1xuXG4kLmZpcmUgPSBmdW5jdGlvbih0YXJnZXQsIHR5cGUsIHByb3BlcnRpZXMpIHtcblx0dmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKTtcblxuXHRldnQuaW5pdEV2ZW50KHR5cGUsIHRydWUsIHRydWUgKTtcblxuXHRmb3IgKHZhciBqIGluIHByb3BlcnRpZXMpIHtcblx0XHRldnRbal0gPSBwcm9wZXJ0aWVzW2pdO1xuXHR9XG5cblx0cmV0dXJuIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2dCk7XG59O1xuXG4kLnJlZ0V4cEVzY2FwZSA9IGZ1bmN0aW9uIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1stXFxcXF4kKis/LigpfFtcXF17fV0vZywgXCJcXFxcJCZcIik7XG59O1xuXG4kLnNpYmxpbmdJbmRleCA9IGZ1bmN0aW9uIChlbCkge1xuXHQvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuXHRmb3IgKHZhciBpID0gMDsgZWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nOyBpKyspO1xuXHRyZXR1cm4gaTtcbn07XG5cbi8vIEluaXRpYWxpemF0aW9uXG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cdCQkKFwiaW5wdXQuYXdlc29tcGxldGVcIikuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpIHtcblx0XHRuZXcgXyhpbnB1dCk7XG5cdH0pO1xufVxuXG4vLyBBcmUgd2UgaW4gYSBicm93c2VyPyBDaGVjayBmb3IgRG9jdW1lbnQgY29uc3RydWN0b3JcbmlmICh0eXBlb2YgRG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0Ly8gRE9NIGFscmVhZHkgbG9hZGVkP1xuXHRpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIpIHtcblx0XHRpbml0KCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gV2FpdCBmb3IgaXRcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblx0fVxufVxuXG5fLiQgPSAkO1xuXy4kJCA9ICQkO1xuXG4vLyBNYWtlIHN1cmUgdG8gZXhwb3J0IEF3ZXNvbXBsZXRlIG9uIHNlbGYgd2hlbiBpbiBhIGJyb3dzZXJcbmlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRzZWxmLkF3ZXNvbXBsZXRlID0gXztcbn1cblxuLy8gRXhwb3NlIEF3ZXNvbXBsZXRlIGFzIGEgQ0pTIG1vZHVsZVxuaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBfO1xufVxuXG5yZXR1cm4gXztcblxufSgpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGlicy9hd2Vzb21wbGV0ZS9hd2Vzb21wbGV0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBwcml2YXRlUHJvcGVydGllcyA9IG5ldyBXZWFrTWFwKCk7XHJcbmNvbnN0IGdldENvbnRlbnQgPSAodGVtcGxhdGVVcmkpID0+IHtcclxuICAgIHJldHVybiBmZXRjaCh0ZW1wbGF0ZVVyaSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGV4ID0+IHt0aHJvdyBleDt9KTtcclxufTtcclxuXHJcbmNsYXNzIEFwcEluc3RhbnNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcE5hbWUpIHtcclxuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5zZXQodGhpcywge30pO1xyXG5cclxuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuYXBwbGljYXRpb25OYW1lID0gYXBwTmFtZTtcclxuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuY29udGVudF9hcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW3dkLXJvb3RdJywgYXBwTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcm9vdCgpIHsgcmV0dXJuIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5jb250ZW50X2FyZWE7IH1cclxuXHJcbiAgICByb3V0ZXMocm91dGVMaXN0KSB7XHJcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmFwcFJvdXRlcyA9IHJvdXRlTGlzdDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZSh0ZW1wbGF0ZVVybCkge1xyXG4gICAgICAgIGNvbnN0IHJvdXRlID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmFwcFJvdXRlcy5maW5kKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC51cmwgPT09IHRlbXBsYXRlVXJsO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0Q29udGVudChyb3V0ZS50ZW1wbGF0ZVVybCkudGhlbihjb250ZW50ID0+IHtcclxuICAgICAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmNvbnRlbnRfYXJlYS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShjb250ZW50LCBudWxsLCByb3V0ZS51cmwpO1xyXG4gICAgICAgIH0pLmNhdGNoKGV4ID0+IHt0aHJvdyBleDt9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnQobmFtZSwgZGVzY3JpcHRpb24pIHtcclxuICAgICAgICBjb25zdCBjb21wb25lbnRQcm90byA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0Q29tcG9uZW50RGF0YSA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudERhdGEgPSB7fTtcclxuICAgICAgICAgICAgY29tcG9uZW50RGF0YS5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWxlbWVudC5hdHRyaWJ1dGVzKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGF0dHIpID0+IGNvbXBvbmVudERhdGFbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50RGF0YTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb21wb25lbnRQcm90by5jcmVhdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0NvbXBvbmVudCA9IG5ldyBET01QYXJzZXIoKVxyXG4gICAgICAgICAgICAgICAgLnBhcnNlRnJvbVN0cmluZyhkZXNjcmlwdGlvbi50ZW1wbGF0ZSwgJ3RleHQvaHRtbCcpXHJcbiAgICAgICAgICAgICAgICAuYm9keS5maXJzdENoaWxkO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb2xkQ29tcG9uZW50RGF0YSA9IGdldENvbXBvbmVudERhdGEodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbi5iZWZvcmVNb3VudCh0aGF0LCBuZXdDb21wb25lbnQsIG9sZENvbXBvbmVudERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NvbXBvbmVudCwgdGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHsgcHJvdG90eXBlOiBjb21wb25lbnRQcm90b30pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEluc3RhbnNlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9hcHBJbnN0YW5zZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJyZXF1aXJlKCcuLi9zdHlsZXMvc2Fzcy9zdHlsZS5zY3NzJyk7XG5jb25zdCBBd2Vzb21wbGV0ZSA9IHJlcXVpcmUoJy4uL2xpYnMvYXdlc29tcGxldGUvYXdlc29tcGxldGUuanMnKTtcbmNvbnN0IFN1cGVyRnJhbWV3b3JrID0gcmVxdWlyZSgnLi9zdXBlckZyYW1ld29yaycpO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zdCBteUFwcCA9IFN1cGVyRnJhbWV3b3JrLmNyZWF0ZVJvb3QoJ2FwcCcpXG4gICAgICAgIC5yb3V0ZXMoW1xuICAgICAgICAgICAgeyB1cmw6ICcvJywgdGVtcGxhdGVVcmw6ICd2aWV3cy9tYWluLmh0bWwnIH0sXG4gICAgICAgICAgICB7IHVybDogJy9zaWduLWluJywgdGVtcGxhdGVVcmw6ICd2aWV3cy9zaWduLWluLmh0bWwnIH1cbiAgICAgICAgXSlcbiAgICAgICAgLmNvbXBvbmVudCgnaW4tbGluaycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGEgaHJlZj1cIlwiPjwvYT4nLFxuICAgICAgICAgICAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uIChhcHAsIGVsZW1lbnQsIGNvbXBvbmVudERhdGEpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGNvbXBvbmVudERhdGEuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgY29tcG9uZW50RGF0YS5ocmVmKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjb21wb25lbnREYXRhLmNsYXNzKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5uYXZpZ2F0ZShlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNvbXBvbmVudCgnaW4tc2VhcmNoJywge1xuICAgICAgICAgICAgdGVtcGxhdGU6ICc8c3Bhbj48aW5wdXQgZGF0YS1saXN0PVwiXCIvPjwvc3Bhbj4nLFxuICAgICAgICAgICAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uIChhcHAsIGVsZW1lbnQsIGNvbXBvbmVudERhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGVsZW1lbnQuY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgc2VhcmNoSW5wdXQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIGNvbXBvbmVudERhdGEucGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIHNlYXJjaElucHV0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjb21wb25lbnREYXRhLmNsYXNzKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCAmJiBldmVudC50YXJnZXQubm9kZU5hbWUgPT0gJ0lOUFVUJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdlc29tcGxldGUuX2xpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2goJ2h0dHA6Ly8xMjcuMC4wLjE6ODA4Mi9hcGkvc2VhcmNoP3F1ZXJ5PScgKyBldmVudC50YXJnZXQudmFsdWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdlc29tcGxldGUuX2xpc3QgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3ZXNvbXBsZXRlLmV2YWx1YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGF3ZXNvbXBsZXRlID0gbmV3IEF3ZXNvbXBsZXRlKHNlYXJjaElucHV0LFxuICAgICAgICAgICAgICAgICAgICB7IGZpbHRlcjogKCkgPT4geyByZXR1cm4gdHJ1ZTsgfSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICBteUFwcC5uYXZpZ2F0ZSgnLycpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGV2ZW50ID0+IG15QXBwLnJvb3QoKS5pbm5lckhUTUwgPSBldmVudC5zdGF0ZSk7XG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==