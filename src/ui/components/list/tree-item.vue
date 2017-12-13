<template>
    <li
        :class="[
            isFolder ? 'cascade' : 'pt-dropdown__dropdown-item',
            searchKey || model.expand ? 'on' : '',
            !isFolder && model.id == currentId ? 'current' : ''
        ]"
        @click.stop="chooseItem"
    >
        <span>
            <pt-svg v-if="isFolder" use-id="icon-folder-open" class="open"></pt-svg>
            <pt-svg v-if="isFolder" use-id="icon-folder-close" class="close"></pt-svg>
            {{model.name}}
        </span>
        <ul v-if="isFolder">
            <tree-item
                v-for="item of model.child"
                :model="item"
                :searchKey="searchKey"
                :name="name"
                :currentId="currentId"
                @change="onChange"
            ></tree-item>
        </ul>
    </li>
</template>

<script>

    export default {
        name: 'treeItem',
        props: ['model', 'searchKey', 'name', 'currentId'],
        computed: {
            isFolder: function() {
                return !!this.model.child && this.model.child.length > 0;
            }
        },
        data() {
            return {
            };
        },
        methods: {
            chooseItem(e) {
                if(this.isFolder) {
                    e.target.parentNode.classList.toggle('on');
                }else{
                    this.$emit('change', this.model);
                }
            },

            onChange(model){
                this.$emit('change', model);
            }
        }
    };
</script>
