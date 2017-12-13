<template>
    <div class="pt-datepicker flip-container" :class="[theme ? 'pt-datepicker__theme-' + theme :'']">
        <div class="pt-datepicker__flipper" :class="{flip: flip}">
            <!--月份面板-->
            <div class="pt-datepicker__flipper_front">
                <!--头部展示-->
                <div class="pt-datepicker_header">
                    <a class="pt-datepicker_header_prev" @click="nav('month', -1)">
                        <pt-svg use-id="icon-arrowline"></pt-svg>
                    </a>
                    <span class="pt-datepicker_header_title" @click="toggle">{{dateTitle}}</span>
                    <a class="pt-datepicker_header_next" @click="nav('month', 1)">
                        <pt-svg use-id="icon-arrowline"></pt-svg>
                    </a>
                </div>
                <!--月份展示-->
                <div class="pt-datepicker_content">
                    <table>
                        <thead>
                        <th v-for="name of weekends">{{name}}</th>
                        </thead>
                        <tbody>
                        <tr v-for="row in rows">
                            <td v-for="col in row">
                                <a :class="{disable: col.isDisable, selected: col.isSelected, otherMonth: isOtherMonth(col)}"
                                    @click="selectDate(col)">{{col.day}}
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!--年份面板-->
            <div class="pt-datepicker__flipper_back">
                <div class="pt-datepicker_header">
                    <a class="pt-datepicker_header_prev" @click="nav('year', -1)">
                        <pt-svg use-id="icon-arrowline"></pt-svg>
                    </a>
                    <span class="pt-datepicker_header_title" @click="toggle">{{yearTitle}}</span>
                    <a class="pt-datepicker_header_next" @click="nav('year', 1)">
                        <pt-svg use-id="icon-arrowline"></pt-svg>
                    </a>
                </div>
                <div class="pt-datepicker_content month-content">
                    <ul class="pt-datepicker_content_month">
                        <li v-for="(month,index) of months" @click="selectMonth(index)" :class="{'currentMonth': isCurrentMonth(month)}"><a>{{month}}</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dateUtils from './utils/date';
    const ROW_NUM = 6,
        COL_NUM = 7,
        DATE_FORMAT = 'yyyy/mm/dd',
        MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        WEEKENDS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    export default {
        name: 'ptDatepicker',
        props: {
            value: {
                type: String,
                required: true
            },
            max: {
                type: String,
                // default: () => dateUtils.format(new Date(), DATE_FORMAT)
            },
            min: String,
            onSelect: Function,
            theme: String,
            format: {
                type: String,
                default: DATE_FORMAT
            }
        },

        computed: {
            rows() {
                var weeks = [],
                    date = new Date(this.currentMonth), // 需要用字符串,日期对象vue不是响应式的。
                    firstDayDate = dateUtils.getFirstDayOfDate(date), //该月的第一天
                    firstWeekDayNum = firstDayDate.getDay(), //该月的一个星期
                    curDate = dateUtils.addDays(dateUtils.clone(firstDayDate), -firstWeekDayNum); //循环遍历的开始日期

                // var max = new Date(this.max),
                //     min = new Date(this.min);

                for (var i = 0; i < ROW_NUM; i++) {
                    var days = [];
                    for (var j = 0; j < COL_NUM; j++) {
                        days.push({
                            day: curDate.getDate(),
                            date: curDate,
                            isDisable: this.isDayDisable(curDate),
                            isSelected: this.isDaySelected(curDate)
                        });
                        curDate = dateUtils.addDays(dateUtils.clone(curDate), 1);
                    }
                    weeks.push(days);
                }
                return weeks;
            },

            dateTitle() {
                return dateUtils.format(this.currentMonth, 'mmm yyyy');
            },

            yearTitle() {
                return dateUtils.format(this.currentMonth, 'yyyy');
            },

            monthTitle(){
                return dateUtils.format(this.currentMonth, 'mmm');
            },

            // maxDate() {
            //     return this.max && new Date(this.max);
            // },

            // minDate() {
            //     return this.min && new Date(this.min);
            // }
        },

        data() {
            return {
                months: MONTHS,
                weekends: WEEKENDS,
                currentMonth: this.getCurrentMonth(),
                flip: false
            };
        },

        methods: {
            getCurrentMonth() {
                var curr = this.value ? dateUtils.parse(this.value) : new Date();
                curr = dateUtils.clearTime(curr);
                // 设置第一天
                curr.setDate(1);
                return dateUtils.format(curr, this.format);
            },

            nav(type, num) {
                let date;
                if(type == 'month'){
                    date = dateUtils.addMonths(new Date(this.currentMonth), num);
                }else{
                    date = dateUtils.addYears(new Date(this.currentMonth), num);
                }
                this.currentMonth = dateUtils.format(date, this.format);
            },

            isOtherMonth(col) {
                return col.date.getMonth() != new Date(this.currentMonth).getMonth();
            },

            isDayDisable(date) {
                return (this.max && dateUtils.compare(date, new Date(this.max)) > 0) ||
                    (this.min && dateUtils.compare(date, new Date(this.min)) < 0);
            },

            isDaySelected(date) {
                if(!this.value) return false;
                return dateUtils.compare(date, new Date(this.value)) == 0;
            },

            isCurrentMonth(month) {
                if(this.value == null) return false;
                let curr = dateUtils.parse(this.value, DATE_FORMAT);
                return curr.getFullYear() == this.yearTitle
                    && month == this.monthTitle;
            },

            selectDate(obj) {
                if(obj.isDisable) return;
                const value = dateUtils.format(obj.date, this.format);
                this.onSelect(value);
                this.$emit('input', value);
            },

            selectMonth(month) {
                let date = new Date(this.currentMonth).setMonth(month);
                this.currentMonth = dateUtils.format(date, this.format);
                this.toggle();
            },

            toggle() {
                this.flip = !this.flip;
            }
        }
    };
</script>

<style lang="scss">
    @import "./styles/imports";

    $calendarWidth: 210px;
    $calendarHeight: 234px;


    .pt-datepicker {
        width: $calendarWidth;
        height: $calendarHeight;
        background-color: $dd-mineshaft;
        box-shadow: 0 2px 0 0 rgba(0,0,0,0.2);
        @include border-radius(4px);

        &.flip-container{
            perspective: 1000px;
            position: relative;

            .pt-datepicker__flipper{
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                position: absolute;
                transition: transform 0.6s;
                &_front, &_back {
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    -moz--backface-visibility: hidden;
                    backface-visibility: hidden;
                    position: absolute;
                    margin: 0;
                    transform: rotateX(0deg);
                }
                &_back {
                    transform: rotateY(180deg);
                    transform-origin: center;
                }
            }

            .flip {
                transform: rotateY(180deg);
                transform-origin: center;
                .pt-datepicker__flipper_front {
                    z-index: -1;
                }
            }
        }

        table,td,th{
            padding: 0px;
            margin: 0px;
        }

        &_header{
            text-align: center;
            margin:10px 0;
            &_prev, &_next{
                width: 16px;
                height: 16px;
                display: inline-block;
                position: relative;
                margin: 0 10px;
                vertical-align: middle;
                &.disable {
                    background-color: #999;
                    cursor: default;
                }
                svg{
                    width: 16px;
                    height: 16px;
                    fill: #BBBBBB;
                    transform-origin: center;
                }
                &:hover{
                    svg{
                        fill: #444;
                    }
                }

            }
            &_next{
                svg{
                    transform: rotate(180deg);
                    // -moz-transform: rotate(90deg);
                }
            }


            &_title{
                display: inline-block;
                width: 76px;
                height: 22px;
                color: $dd-mineshaft;
                font-size: $font-default;
                line-height: 22px;
                cursor: pointer;
                background-color: $dd-larioja;
                border-radius: 100px;
                text-align: center;
            }
        }

        &_content {
            margin: 0 10px;

            &.month-content {
                margin:0 6px;
            }

            table {
                width: 100%;
                text-align: center;
                border-collapse: collapse;
                border-spacing: 0;
                table-layout: fixed;
                color: $dd-white;
                font-size: 12px;

                th{
                    font-weight: normal;
                    width: 24px;
                    color: $dd-dimgray;
                    padding-bottom:6px;
                }

                td > a {
                    color: $dd-nobel;
                    display: inline-block;
                    width: 22px;
                    height: 22px;
                    margin: 2px 0px;
                    line-height: 22px;
                    cursor: pointer;

                    &.selected {
                        color: $dd-mineshaft !important;
                        background-color: $dd-larioja;
                        border-radius: 100%;
                    }

                    /*其它月份样式*/
                    &.otherMonth{
                        color: $dd-silver;
                        &:hover {
                            color: $dd-charcoal;
                        }
                    }

                    &.disable{
                        color: $dd-dimgray !important;
                        cursor: default;
                        background: none;
                        &:hover{
                            cursor: default;
                            background: none;
                        }
                    }
                    &:hover{
                        color: $dd-white;
                    }
                }
            }

            &_month{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                li {
                    width: 60px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    box-sizing: border-box;
                    background-color: $dd-nobel;
                    border-radius: 4px;
                    margin: 0 3px 5px;
                    font-size: $font-default;
                    color: $dd-mineshaft;
                    a {
                        width: 100%;
                        height:100%;
                        display: inline-block;
                        color: $dd-mineshaft;
                    }
                    &.currentMonth{
                        background-color: $dd-larioja !important;
                    }
                    &:hover{
                        background-color: $dd-white;
                    }
                }
            }

        }
    }
    .pt-datepicker.pt-datepicker__theme-light{
        background-color: $dd-wildsand;
        .pt-datepicker_header_prev,
        .pt-datepicker_header_next{
            svg{
                fill: $dd-silver;
            }
            &:hover{
                svg{
                    fill: $dd-charcoal;
                }
            }
        }
        .pt-datepicker_header_title{
            color: $dd-white;
        }
        .pt-datepicker_content {
            table{
                td {
                    & > a{
                        color: $dd-nobel;
                    }
                    & > a.otherMonth{
                        color: $dd-silver;
                    }
                    & > a.disable{
                        color: $dd-alto !important;
                    }
                    & > a.selected{
                        color: $dd-white !important;
                    }
                    & > a:hover{
                        color: $dd-charcoal;
                    }
                }

            }
        }

        .pt-datepicker_content_month{
             li{
                background-color: $dd-silver;
                &.currentMonth{
                    background-color: $dd-larioja !important;
                }
                &:hover{
                    background-color: $dd-nobel;
                }
                a{
                    color: $dd-white;
                }
             }
        }
    }
</style>
