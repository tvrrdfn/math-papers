//添加外部样式
export default {
	includeStyle: function(url, id){
		var style = document.createElement('link');
		style.type = 'text/css';
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', url);
		document.head.appendChild(style);
	}
}