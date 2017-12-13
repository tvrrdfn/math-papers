/**
 * 控制当前节点下带[dropdown-menu]属性的显示与隐藏，通过[dropdown-toggle]或者自身节点触发.
 *
 * <div v-dropdown>
 *	<button dropdown-toggle></button>
 *	<div dropdown-menu></div>
 * </div>
 *
 * or
 *
 * <div v-dropdown>
 * 	<div dropdown-menu></div>
 * </div>
 *
 */
export default {
	name: "dropdown",

	bind(el, binding) {
		const toggleDom = el.querySelector('[dropdown-toggle]') || el;
		const menuDom = el.querySelector('[dropdown-menu]');

		el['@@clickContext'] = function() {
			menuDom.classList.toggle('hide');
		};

		el['@@clickoutsideContext'] = function(ev) {
			if (!el.contains(ev.target)) {
				menuDom.classList.add('hide');
			}
		};

		toggleDom.addEventListener('click', el['@@clickContext'], false);
		document.documentElement.addEventListener('click', el['@@clickoutsideContext'], false);
	},

	inserted(el) {
		const menuDom = el.querySelector('[dropdown-menu]');
		menuDom.classList.add('hide');
	},

	update(el, binding) {

	},

	unbind(el) {
		const toggleDom = el.querySelector('[dropdown-toggle]') || el;
		toggleDom.removeEventListener('click', el['@@clickContext']);
		document.removeEventListener('click', el['@@clickoutsideContext']);
	}
}