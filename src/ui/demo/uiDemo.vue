<template>
    <div class="demo">
        <div class="demo-item">
            <header>
                Button
            </header>
            <div class="content">
                <h3>默认按钮</h3>
                <p>
                    <pt-button>确定</pt-button>
                </p>
                <h3>带icon的按钮，icon默认在左边 icon="icon-chart"</h3>
                <p>
                    <pt-button icon="icon-chart">确定</pt-button>
                </p>
                <h3>带icon的按钮，icon在右边  :iconright="true" :iconleft="false"</h3>
                <p>
                    <pt-button icon="icon-chart" :iconright="true" :iconleft="false">确定</pt-button>
                </p>
                <h3>全屏显示的按钮 :block="true"</h3>
                <p>
                    <pt-button :block="true">确定</pt-button>
                </p>
                <h3>按钮类型---primary type="primary|main"</h3>
                <p>
                    <pt-button type="primary">primary</pt-button>
                    <pt-button type="main">main</pt-button>
                </p>
                <pt-button type="primary" icon="icon-save">确定</pt-button>
                </p>
                <h3>按钮类型---空心按钮 :plain="true"</h3>
                <p>
                    <pt-button :plain="true">确定</pt-button>
                    <pt-button :plain="true" type="cancel-light">确定</pt-button>
                </p>
                <h3>按钮类型---icon的大小   iconsize="small、big、large"</h3>
                <p>
                    <pt-button type="primary" icon="icon-save" iconsize="small">确定</pt-button>
                    <pt-button type="primary" icon="icon-save">确定</pt-button>
                    <pt-button type="primary" icon="icon-save" iconsize="big">确定</pt-button>
                    <pt-button type="primary" icon="icon-save" iconsize="large">确定</pt-button>
                </p>
                <h3>按钮类型---按钮的大小   size="big"</h3>
                <p>
                    <pt-button type="primary">确定</pt-button>
                    <pt-button type="primary" size="big">确定</pt-button>
                </p>
                <h3>按钮类型---方按钮   square="true"</h3>
                <p>
                    <pt-button :square="true">确定</pt-button>
                    <pt-button size="big" :square="true">确定</pt-button>
                </p>
                <h3>带背景</h3>
                <p style="padding:20px; background-color:#333;">
                    <pt-button :square="true" theme="dark">确定</pt-button>
                    <pt-button size="big" :square="true" theme="dark">确定</pt-button>
                    <pt-button icon="icon-chart" theme="dark">确定</pt-button>
                </p>
            </div>
        </div>
        <div class="demo-item">
            <header>
                弹窗
            </header>
            <div class="content">
                <p>
                    <pt-button @click="openDefaultPopup">打开普通弹窗</pt-button>
                </p>
                <p>
                    <pt-button @click="openShortPopup">打开信息提示弹窗</pt-button>
                </p>
                <pt-popup header="这是普通弹窗标题" v-show="showDefaultPopup" @closePopup="closePopup" @savePopup="closePopup" left-btn-text="取消" right-btn-text="确认">
                    <p slot="content">这是个普通弹窗的内容</p>
                </pt-popup>
                <pt-popup header="这是信息提示弹窗标题" theme="short" v-show="showShortPopup" @closePopup="closePopup" @savePopup="closePopup" left-btn-text="不保存" right-btn-text="保存">
                    <p slot="content">这是个信息提示弹窗的内容</p>
                </pt-popup>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Tag Input
            </header>
            <div class="content">
                <div style="padding:20px; background-color:#333; width: 200px;">
                    <p>高度30</p>
                    <pt-tag-input :on-change="onTagChange" theme="dark" :tags="tags" placeholder="Please select account"></pt-tag-input>
                    <p>高度26</p>
                    <pt-tag-input :on-change="onTagChange" size="small" theme="dark" :tags="tags" placeholder="Please select account"></pt-tag-input>
                </div>
                <div style="padding:20px; background-color:#fff; width: 200px;">
                    <p>高度30</p>
                    <pt-tag-input :on-change="onTagChange" theme="light" :tags="tags" placeholder="Please select account"></pt-tag-input>
                    <p>高度26</p>
                    <pt-tag-input :on-change="onTagChange" size="small" theme="light" :tags="tags" placeholder="Please select account"></pt-tag-input>
                </div>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Datepicker
            </header>
            <div class="content">
                <h3>浅色背景</h3>
                <pt-datepicker v-model="currentDateStr" :onSelect="onSelectDate"></pt-datepicker>
                <div class="m10">
                    <div>只能选择max="2017-02-10" min="2017-02-02"</div>
                    <pt-datepicker v-model="currentDateStr02" :onSelect="onSelectDate" max="2017-02-10" min="2017-02-02"></pt-datepicker>
                </div>
            </div>
            <div class="content">
                <h3>深色背景</h3>
                <div style="padding: 20px; background-color: #333;">
                    <pt-datepicker v-model="currentDateStr" theme="light" :onSelect="onSelectDate"></pt-datepicker>
                </div>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Input Number
            </header>
            <div class="content">
                <div>
                    <h3>允许为空，带placeholder</h3>
                    <pt-input-number :value="2" placeholder="auto"></pt-input-number>
                    <h3>不允许为空, 不可以输入负数</h3>
                    <pt-input-number :value="12" :isEmpty="false" :isNegative="false"></pt-input-number>
                    <h3>不允许为空, 可以输入小数</h3>
                    <pt-input-number :value="11.5" :isEmpty="false" :isDecimal="true"></pt-input-number>
                    <h3>不允许为空, 最小值为10，最大值为100</h3>
                    <pt-input-number :value="13" :min="10" :max="100" :isEmpty="false"></pt-input-number>
                    <h3>Disabled</h3>
                    <pt-input-number :value="13" :disabled="true"></pt-input-number>
                </div>
                <div class="black">
                    <h3>不允许为空, 可以输入小数，不可以输入负数</h3>
                    <pt-input-number theme="dark" :value="10.5" :isEmpty="false" :isDecimal="true" :isNegative="false"></pt-input-number>
                    <h3>允许为空, 可以输入小数，不可以输入负数</h3>
                    <pt-input-number theme="dark" :value="13" :isDecimal="true" :isNegative="false"></pt-input-number>
                    <h3>大</h3>
                    <pt-input-number :value="2" theme="dark" placeholder="auto" size="large"></pt-input-number>
                </div>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Input & Textarea
            </header>
            <div class="content">
                <h3>默认样式</h3>
                <p>small</p>
                <pt-input style="width: 200px;" placeholder="提示文字......." size="small"></pt-input>
                <p>large</p>
                <pt-input style="width: 200px;" placeholder="提示文字......." size="large"></pt-input>
                <p>带背景</p>
                <pt-input style="width: 200px;" v-model="radio01" placeholder="提示文字......." size="large" :disabled="false" :autofocus="false"></pt-input>
                <p>圆角：small</p>
                <pt-input style="width: 200px;" placeholder="提示文字......." size="small" round="round"></pt-input>
                <p>圆角：large</p>
                <pt-input style="width: 200px;" placeholder="提示文字......." size="large" round="round"></pt-input>
                <h3>圆角：带背景</h3>
                <pt-input style="width: 200px;" v-model="radio01" placeholder="提示文字......." size="large" round="round" :disabled="false" :autofocus="false"></pt-input>
                <h3>textarea</h3>
                <pt-input style="width: 200px;" type="textarea" round="round" placeholder="提示文字......."></pt-input>
                <div style="background-color: #333; padding: 10px;">
                    <pt-input style="width: 200px;" v-model="radio01" placeholder="已填充过文字的......." size="large" theme="dark" :autofocus="false"></pt-input>
                    <br>
                    <br>
                    <br>
                    <br>
                    <pt-input style="width: 200px;" placeholder="还没有填充过文字的......." size="large" theme="dark" :autofocus="false"></pt-input>
                </div>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Checkbox
            </header>
            <div class="content">
                <pt-checkbox v-model="languages" trueValue="java" falseValue="not java" checked @change="onCheckboxChange">我是一个复选框</pt-checkbox>
                选择的结果是: {{languages}}
            </div>
            <p>黑色背景</p>
            <div class="content" style="background-color:rgb(51, 51, 51);height:50px;padding:10px">
                <pt-checkbox v-model="languages" theme="black" checked @change="onCheckboxChange">我是一个复选框</pt-checkbox>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Radio
            </header>
            <div class="content">
                <!--  <pt-radio v-model="singleRadio" val="singleValue" @change="onSingleRadioChange">我是一个单选按钮</pt-radio> -->
                <div>
                    <h3>默认样式</h3>
                    <div style="padding: 20px;">
                        <h4>浅色背景</h4>
                        <pt-radio name="sex" v-model="radio01" theme="light" val="male" @change="onRadioChange">选项1</pt-radio>
                        <pt-radio name="sex" v-model="radio01" theme="light" val="female" @change="onRadioChange">选项2</pt-radio>
                        <span>选中的是：{{radio01}}</span>
                    </div>
                    <div style="background-color: #333;padding: 20px;">
                        <h4>深色背景</h4>
                        <pt-radio name="sex" v-model="radio01" theme="dark" val="male2" @change="onRadioChange">选项3</pt-radio>
                        <pt-radio name="sex" v-model="radio01" theme="dark" val="female2" @change="onRadioChange">选项4</pt-radio>
                        <span>选中的是：{{radio01}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Select
            </header>
            <div class="content">
                <p>默认样式</p>
                <div style="background-color: #fff;padding: 20px;">
                    <pt-select :resetPosition="true" theme="light" :options="selectOptions" v-model="selectVal"></pt-select>
                    选择的结果是：{{selectVal}}
                </div>
                <p>深色背景</p>
                <div style="background-color: #333;padding: 20px;">
                    <pt-select :resetPosition="true" theme="dark" :options="selectOptions" v-model="selectVal"></pt-select>
                    选择的结果是：{{selectVal}}
                </div>
                <p>没有背景色</p>
                <div style="background-color: #fff;padding: 20px; width: 150px;">
                    <pt-select :resetPosition="true" theme="dark-transparent" :options="selectOptions" v-model="selectVal"></pt-select>
                    选择的结果是：{{selectVal}}
                </div>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Slider
            </header>
            <div class="content">
                <pt-slider style="width: 180px;" v-model="sliderVal" @change="onSliderDragChange"></pt-slider>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Switch
            </header>
            <div class="content">
                <pt-switch v-model="switchModel" @change="onSwitchChange"></pt-switch>
                <pt-switch v-model="switchModel" icon="icon-home" :content="{on: '开', off: '关'}" @change="onSwitchChange"></pt-switch>
                选择结果为 {{switchModel}}
            </div>
        </div>
        <div class="demo-item">
            <header>
                Palette
            </header>
            <div class="content" style="background-color: rgba(100,100,100,.3)">
                <pt-palette color="#444" icon="icon-save"></pt-palette>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Tree
            </header>
            <div class="content">
                <pt-tree style="width: 300px" :list="treeData" v-model="selectedTreeId"></pt-tree>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Table
            </header>
            <div class="content">
                <pt-table id="example" style="width: 800px" :rows="tableConfig.rows" :columns="tableConfig.columns" :orders="tableConfig.orders" :features="tableFeatures"></pt-table>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Collapse
            </header>
            <div class="content">
                <pt-collapse v-model="activeNames">
                    <pt-collapse-item title="第一层" name="1">
                        <div>第一层子元素1</div>
                        <div>第一层子元素2</div>
                        <div>第一层子元素3</div>
                        <div>第一层子元素4</div>
                        <div>第一层子元素5</div>
                        <div>第一层子元素6</div>
                        <div>第一层子元素7</div>
                        <pt-collapse v-model="activeNamesTwo">
                            <pt-collapse-item title="第二层标题" name="11">
                                <div>第二层子元素1</div>
                                <div>第二层子元素2</div>
                                <div>第二层子元素3</div>
                                <div>第二层子元素4</div>
                            </pt-collapse-item>
                            <pt-collapse-item title="第二层标题" name="12">
                                <div>第二层子元素5</div>
                                <div>第二层子元素6</div>
                                <div>第二层子元素7</div>
                                <div>第二层子元素8</div>
                            </pt-collapse-item>
                        </pt-collapse>
                    </pt-collapse-item>
                    <pt-collapse-item title="第一层" name="2">
                        <div>第一层子元素</div>
                    </pt-collapse-item>
                </pt-collapse>
            </div>
        </div>
        <div class="demo-item">
            <header>
                Modal
            </header>
            <div class="content">
                <pt-modal ref="modal1" title="Basic Modal">
                    Hello World! What's happening?
                </pt-modal>
                <pt-button @click="openModal('modal1')">Basic Modal</pt-button>
            </div>
        </div>
        <div class="demo-item">
            <header>Search</header>
            <p>浅色背景</p>
            <pt-search :list="treeData" theme="light" @change="onTreeDataFiltered"></pt-search>
            <p>big:</p>
            <pt-search :list="treeData" theme="light" @change="onTreeDataFiltered" size="large"></pt-search>
            <p>深色背景</p>
            <div style="background-color: rgb(51, 51, 51); padding: 20px;">
                <p>高度26</p>
                <pt-search theme="black" :list="treeData" @change="onTreeDataFiltered"></pt-search>
                <p>高度30</p>
                <pt-search size="large" theme="black" :list="treeData" @change="onTreeDataFiltered"></pt-search>
            </div>
        </div>
        <div class="demo-item">
            <header v-if="executeFn()">
                动态表达式
            </header>
        </div>
        <div class="demo-item">
            <header v-if="executeFn()">
                ToolTip
            </header>
            <div class="content">
                <h3>悬浮触发</h3>
                <div class="tooltip-box">
                    <div :class="item.position" v-for="item in toolTipItems">
                        <pt-tooltip :effect="tooltip.effect" :content="tooltip.content" :placement="tooltip.placement" v-for="tooltip in item.data">
                            <pt-button>{{tooltip.name}}</pt-button>
                        </pt-tooltip>
                    </div>
                </div>
                <h3>点击触发</h3>
                <pt-tooltip effect="dark" openOn="click" content="我是点击才出现的提示内容，默认显示1秒后隐藏！！！" placement="right">
                    <pt-button>点击触发</pt-button>
                </pt-tooltip>
                <h3>多行内容(需要将slot内容放在最后)</h3>
                <pt-tooltip effect="dark" placement="right">
                    <pt-button>《减字木兰》</pt-button>
                    <div slot="content">
                        花卖花担上，
                        <br> 买得一枝春欲放。
                        <br> 泪染轻匀，
                        <br> 犹带彤霞晓露痕。
                    </div>
                </pt-tooltip>
            </div>
        </div>
        <div class="demo-item">
            <header>
                loading
            </header>
            <div class="content" style="position: relative;height: 100px;">
                <pt-loading></pt-loading>
            </div>
            <div class="content" style="position: relative;height: 100px;" v-loading="loading">
                <pt-checkbox v-model="loading">{{loading}}</pt-checkbox>
            </div>
        </div>
        <div class="demo-item">
            <header>
                scrollbar
            </header>
            <div class="content">
                <div class="scrollbar-box">
                    <pt-scrollbar>
                        <div style="height: 200px; background-color: rgba(0, 255, 0, .4)">第一段落</div>
                        <div style="height: 200px; background-color: rgba(0, 255, 0, .6)">第二段落</div>
                        <div style="height: 200px; background-color: rgba(0, 255, 0, .8)">第三段落</div>
                        <div style="background-color: rgba(0, 255, 0, 1)">
                            第四段落
                            <div class="scrollbar-box">
                                <pt-scrollbar>
                                    <div style="height: 200px; background-color: rgba(255, 0, 0, .4)">第一段落</div>
                                    <div style="height: 200px; background-color: rgba(255, 0, 0, .6)">第二段落</div>
                                    <div style="height: 200px; background-color: rgba(255, 0, 0, .8)">第三段落</div>
                                    <div style="height: 200px; background-color: rgba(255, 0, 0, 1)">第四段落</div>
                                </pt-scrollbar>
                            </div>
                        </div>
                    </pt-scrollbar>
                </div>
                <h3>配置选项(默认从底部开始)</h3>
                <pt-button :plain="true" @click="scrollbarOptions.disabled = !scrollbarOptions.disabled">
                    禁用/开启滚动条
                </pt-button>
                <pt-button :plain="true" @click="scrollbarOptions.suppressScrollX = !scrollbarOptions.suppressScrollX">
                    禁用/开启 X轴滚动条
                </pt-button>
                <pt-button :plain="true" @click="scrollbarOptions.suppressScrollY = !scrollbarOptions.suppressScrollY">
                    禁用/开启 Y轴滚动条
                </pt-button>
                <pt-button :plain="true" @click="scrollbarOptions.scrollTo = 'top'">
                    滚动到顶部
                </pt-button>
                <pt-button :plain="true" @click="scrollbarOptions.scrollTo = 'middle'">
                    滚动到中间
                </pt-button>
                <pt-button :plain="true" @click="scrollbarOptions.scrollTo = 100">
                    滚动到100
                </pt-button>
                <pt-button :plain="true" @click="scrollbarOptions.scrollTo = 'bottom'">
                    滚动到底部
                </pt-button>
                <div class="scrollbar-box">
                    <pt-scrollbar :disabled="scrollbarOptions.disabled" :suppressScrollX="scrollbarOptions.suppressScrollX" :suppressScrollY="scrollbarOptions.suppressScrollY" :scrollTo="scrollbarOptions.scrollTo">
                        <div style="width: 600px; height: 200px; background-color: rgba(0, 0, 255, .4)">第一段落</div>
                        <div style="height: 200px; background-color: rgba(0, 0, 255, .6)">第二段落</div>
                        <div style="height: 200px; background-color: rgba(0, 0, 255, .8)">第三段落</div>
                        <div style="height: 200px; background-color: rgba(0, 0, 255, 1)">第四段落</div>
                    </pt-scrollbar>
                </div>
            </div>
            <div class="demo-item">
                <header>
                    toast
                </header>
                <div class="content">
                    <pt-button @click="toastOptions.isOpen = !toastOptions.isOpen">显示/隐藏</pt-button>
                    <pt-toast :isOpen="toastOptions.isOpen"></pt-toast>
                </div>
            </div>
            <div class="demo-item">
                <header>
                    toast
                </header>
                <div class="content">
                    <pt-button @click="toastOptions.isOpen = !toastOptions.isOpen">显示/隐藏</pt-button>
                    <pt-toast :isOpen="toastOptions.isOpen"></pt-toast>
                </div>
            </div>
            <div class="demo-item">
                <header>
                    DropDown
                </header>
                <div class="content" style="position: relative;height: 100px;">
                    <pt-dropdown :options="treeData" type="tree"></pt-dropdown>
                </div>
            </div>
            <div class="demo-item">
                <header>
                    TreePanel
                </header>
                <div class="content" style="position: relative;height: 100px;">
                    <pt-tree-panel :options="treeData" @change="onPtTreePanelChange">
                    </pt-tree-panel>
                </div>
            </div>
            <div class="demo-item" v-dropdown>
                <header>Dropdown directive</header>
                <pt-button dropdown-toggle>测试</pt-button>
                <ul dropdown-menu class='ul-drop' style="width: 200px; height: 200px; background: #ccc;">
                    <li><a @click="clickMenu('menu01')">menu01</a></li>
                    <li><a @click="clickMenu('menu02')">menu02</a></li>
                </ul>
            </div>
            <div class="demo-item">
                <header>
                    pt-toast
                </header>
                <div class="content" style="position: relative;height: 100px;">
                    <h2 v-pttoast="{show: true, icon: 'icon-save', content:'aaaaa',interval: 5000}"></h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import tableConfig from './tableConfig';
import treeData from './treeData';

import Scroll from '../mixins/scroll';
import Resize from '../mixins/resize';

const dropdowns = [{}];

const toolTipItems = [
    {
        position: 'top',
        data: [
            {
                placement: 'top',
                effect: 'dark',
                content: "Top Center 提示文字",
                name: '上边-黑色模板'
            },
            {
                placement: 'top-start',
                effect: 'dark',
                content: "Top Left 提示文字",
                name: '上左-黑色模板'
            },
            {
                placement: 'top-end',
                effect: 'dark',
                content: "Top Right 提示文字",
                name: '上右-黑色模板'
            }
        ]
    },
    {
        position: 'left',
        data: [
            {
                placement: 'left',
                effect: 'warning',
                content: "Left Center 提示文字",
                name: '左边-警告模板'
            },
            {
                placement: 'left-start',
                effect: 'warning',
                content: "Left Top 提示文字",
                name: '左上-警告模板'
            },
            {
                placement: 'left-end',
                effect: 'warning',
                content: "Left Bottom 提示文字",
                name: '左下-警告模板'
            }
        ]
    },
    {
        position: 'right',
        data: [
            {
                placement: 'right',
                effect: 'warning',
                content: "Right Center 提示文字",
                name: '右边-警告模板'
            },
            {
                placement: 'right-start',
                effect: 'warning',
                content: "Right Top 提示文字",
                name: '右上-警告模板'
            },
            {
                placement: 'right-end',
                effect: 'warning',
                content: "Right Bottom 提示文字",
                name: '右下-警告模板'
            }
        ]
    },
    {
        position: 'bottom',
        data: [
            {
                placement: 'bottom',
                effect: 'light',
                content: "Bottom Center 提示文字",
                name: '下边-亮色模板'
            },
            {
                placement: 'bottom-start',
                effect: 'light',
                content: "Bottom Left 提示文字",
                name: '下左-亮色模板'
            },
            {
                placement: 'bottom-end',
                effect: 'light',
                content: "Bottom Right 提示文字",
                name: '下右-亮色模板'
            }
        ]
    }
];

export default {
    data(){
        return {
            languages: '',
            tags: ['test'],
            singleRadio: '',
            radio01: 'male',
            dropdowns: dropdowns,
            switchModel: true,
            currentDateStr: '2017-02-10',
            currentDateStr02: '2017-02-05',
            sliderVal: 25,
            selectVal: 'avg',
            selectOptions: [
                {code:'sum', name:'SUM'},
                {code:'avg', name:'AVG'},
                {code:'count', name:'COUNT'},
                {code:'min', name:'MIN'},
                {code:'max', name:'MAX'}
            ],
            select1: 'COUNT',
            tableConfig: tableConfig,
            tableFeatures: {
                sortable: false
            },
            treeData: treeData,
            selectedTreeId: '61378798',
            activeNames:'1',
            activeNamesTwo:'',
            inputNumberValue1: 0,
            inputNumberValue2: 10.2,
            name:"lisi",
            person: {
                age: 20
            },
            expression: "this.person.age > 18",
            toolTipItems,
            loading: true,
            scrollbarOptions: {
                disabled: false,
                suppressScrollX: false,
                suppressScrollY: false,
                scrollTo: 'bottom'
            },
            toastOptions: {
                isOpen: false
            },
            showDefaultPopup: false,
            showShortPopup: false
        };
    },
    mixins: [Scroll, Resize],
    methods: {
        onScroll () {
            // 滚动时处理
        },
        onResize () {
            // 窗口大小变化时处理
        },
        onTagChange(tags) {
            console.log(tags);
        },
        onSingleRadioChange() {
            console.log("单选按钮change事件触发了, model值为" + this.singleRadio);
        },
        onRadioChange(arg) {
            console.log("radio changed, current value is " + this.radio01);
        },
        onCheckboxChange(e) {
            console.log("checkbox changed, current value is " + this.languages);
        },
        onDropdownChange() {
            console.log("dropdown changed");
        },
        onSwitchChange() {
            console.log("switch changed, current value is " + this.switchModel);
        },
        onSelectDate(date) {
            alert(date)
        },
        onSliderDragChange() {
            console.log(this.sliderVal)
        },
        openModal(ref){
            this.$refs[ref].open();
        },
        closeModal(ref) {
            this.$refs[ref].close();
        },
        onTreeDataFiltered(data){
            console.log(data);
        },
        executeFn() {
            let fun = new Function( "return " + this.expression);
            let result = fun.bind(this)();
            return result;
        },
        openDefaultPopup(){
            this.showDefaultPopup = true;
        },
        openShortPopup(){
            this.showShortPopup = true;
        },
        closePopup(){
            this.showDefaultPopup = this.showShortPopup = false;
        },
        onPtTreePanelChange(data) {
            console.log(data);
        },
        clickMenu(type) {
            alert(type)
        }
    }
};
</script>

<style lang="scss" scoped>

h3 {
    color: #000;
    margin: 10px 0;
}

.demo {
    margin: 20px;
    overflow: auto;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
}

.demo-item {
    margin: 20px 0;
    border: 1px solid #ccc;

    header {
        font-size: 16px;
        color: #000;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        padding: 10px;
    }

    .content {
        padding: 10px;

        .black {

            h3 {
                color: #fff;
            }

            color: #fff;
            background-color: #333;
            padding: 20px;
        }
    }
}

.tooltip-box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
}

.scrollbar-box {
    max-width: 400px;
    height: 300px;
}

.ul-drop .hide{
    display:none;
}


</style>
