<template>
    <div class="pt-ui-tab">
    	<ul>
    		<li class="active">
    			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563L5.016 12zm9-14.016C20.11 3 21 3.938 21 5.016v13.97C21 20.062 20.11 21 18.984 21H5.014C3.89 21 3 20.064 3 18.986V5.015C3 3.94 3.89 3 5.014 3h13.97z"/>
                </svg>
                <span>1</span>
                <div class="pt-ui-tab-content">我是内容1</div>
    		</li>
    		<li>
                <span>2</span>
               <div class="pt-ui-tab-content">我是内容2</div>
            </li>
    	</ul>
        
    </div>
</template>

<script>
    export default {
        name: 'ptTab'
    };
</script>
<style lang="scss">
        @import "./styles/imports";
	.pt-ui-tab {
        position: relative;
        clear: both;
		ul {
			li {
				width: 100px;
				height:40px;
                line-height: 40px;
				background-color: #eeeeee;
				text-align: center;
                float: left;
                border-radius: 2px 2px 0 0;
                cursor: pointer;
                &.active {
                    background: #cccccc;
                   .pt-ui-tab-content {
                        display: block;
                   } 
                }
                .pt-ui-tab-content {
                    display: none;
                    width: 600px;
                    height:200px;
                    overflow: hidden;
                    line-height: 25px;
                    position: absolute;
                    top: 40px;
                    left: 0;
                    background: #cccccc;
                    clear: both;
                }
				
			}
		}
        
	}
</style>