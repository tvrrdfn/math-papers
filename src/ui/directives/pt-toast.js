/**
show: true/false   控制隐藏和显示
icon: 图标，传一个icon名字字符串
content: 提示的文案
interval: 动画时间，默认1500毫秒
**/

export default {
    name: "pttoast",

    bind: function(el,binding){
    	var toastDom = document.createElement('div');
        var svgDom = '<span class="pt-toast-icon"><svg><use xlink:href="#'+binding.value.icon+ '"></use></svg></span>';
        var contentDom = '<span class="pt-toast-content">' + binding.value.content + '</span>';
        toastDom.classList.add('pt-toast');
        //可以设置size，需要添加small
        if(binding.value.size && binding.value.size === 'small'){
            toastDom.classList.add('small');
        }

        //可以设置是否需要icon
        if(binding.value.icon){
            toastDom.innerHTML += svgDom ;
        }
        if(binding.value.content){
            toastDom.innerHTML += contentDom;
        }


        document.body.appendChild(toastDom);
        binding.value.show ? toastDom.classList.add('show') : toastDom.classList.remove('show');

        //如果需要重新定位提示的位置，需要提供position对象
        if(binding.value.position){
            toastDom.style.top = binding.value.position.top;
            toastDom.style.left = binding.value.position.left;
        }
        setTimeout(() => {
            toastDom.classList.remove('show');
            setTimeout(() =>{document.body.removeChild(toastDom);},300);
        }, binding.value.interval || 1500);
    },
    update: function(el,binding){
		if(binding.value.show){
            el.classList.add('show');
        }else{
            el.classList.remove('show');
        }
    }
};