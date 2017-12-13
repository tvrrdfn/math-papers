<template>
    <label :class="wrapClass">
        <input
            type="checkbox"
            v-model="model"
            :disabled="disabled"
            @change="onChange"
            @input="onChange"
        />
        <span class="pt-switch__inner">
        	<span class="pt-switch__inner-bg">{{currentState}}</span>
        	<span class="pt-switch__inner-bd">
        		<pt-svg :use-id="icon" v-if="icon"></pt-svg>
        	</span>
        </span>
    </label>
</template>

<script>
export default {
    name: 'ptSwitch',
    props: {
        name: String,
        value: {
            type: Boolean,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        content: {
        	type: Object,
        	default: function(){
        		return {
	        		on: "on",
	        		off: "off"
        		}
        	}
        },
        icon: String
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        currentState() {
        	return this.content[this.model ? 'on' : 'off'];
        },
        wrapClass() {
        	return [
        		'pt-switch',
        		{
        			'pt-switch__icon': this.icon
        		}
        	]
        }
    },
    methods: {
        onChange(e) {
            this.model = e.target.checked; //safari下直接使用this.model状态不对，需要赋值更新;
            this.$emit('change', e.target.checked);
        }
    }
};
</script>

<style lang="scss">
    @import './styles/imports';

    $switch-width: 50px;
    $switch-width-big: 64px;
    $switch-height: 22px;
    $switch-height-svg: 30px;
    $border-radius: $switch-height/2;

    .pt-switch {
    	position: relative;
		display: flex;
		align-items: center;
		cursor: pointer;
		width: $switch-width;
	    height: $switch-height;

		input[type=checkbox]{
			display: none;
		}
  		&__inner {
		    position: relative;
		    display: inline-block;
		    width: $switch-width;
		    height: $switch-height;
		    color: $dd-white;
		  	box-sizing: border-box;

			span {
				position: absolute;
			  	transition: transform .5s,-webkit-transform .5s;
			}

			&-bg {
				@include size($switch-width, $switch-height);
		    	@include border-radius($border-radius);
		    	background: $dd-silver;
    			text-align: right;
    			top: 50%;
    			transform: translateY(-50%);
                font-size: $f-sm;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 10px;
            }

			&-bd {
				@include size(14px);
				@include border-radius(100%);
				top: 4px;
                left: 4px;
			  	background: $dd-white;
			}
		}
		input[type=checkbox]:checked + &__inner {
		}

		input[type=checkbox]:checked + &__inner &__inner-bg {
			border-color: $dd-larioja;
			background-color: $dd-larioja;
    		text-align: left;
            justify-content: flex-start;
            padding-left: 10px;
		}

		input[type=checkbox]:checked + &__inner &__inner-bd {
			transform: translateX(27px);
		}
    }

    .pt-switch__icon {
        width: $switch-width-big;
        height: $switch-height-svg;
        
    	.pt-switch__inner {
            width: $switch-width-big;
    		height: $switch-height-svg;

            &-bg {
                width: $switch-width-big;
            }

			&-bd {
				@include size($switch-height-svg);
				top: 0;
                left: 0;
			  	border: 1px solid $dd-alto;
    			background-color: $dd-alabaster;
    			display: flex;
			    align-items: center;
			    justify-content: center;

		  		svg {
		  			fill: $dd-nobel;
		  			@include size(16px);
		  		}
			}
		}
		
		input[type=checkbox]:checked + .pt-switch__inner .pt-switch__inner-bd {
			border: 1px solid $dd-white;
			transform: translateX(35px);
			background-color: $dd-larioja;

			svg {
				fill: $dd-white;
			}
		}
    }

    .pt-switch__small {
        .pt-switch__inner {
            &-bd {
                top: 4px;
                left: 2px;
                background: $dd-white;
            }
        }
    }
</style>
