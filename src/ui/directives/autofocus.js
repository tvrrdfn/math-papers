export default {
	name: "autofocus",
	
    inserted(el, { value }) {
        if (value) {
            el.focus();
        }
    }
};