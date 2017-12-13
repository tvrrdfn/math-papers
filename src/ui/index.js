import Vue from 'vue';
import ptButton from './pt-button.vue';
import ptCheckbox from './pt-checkbox.vue';
import ptDatepicker from './pt-datepicker.vue';
import ptInput from './pt-input.vue';
import ptRadio from './pt-radio.vue';
import ptSelect from './pt-select.vue';
import ptSlider from './pt-slider.vue';
import ptSwitch from './pt-switch.vue';
import ptPalette from './pt-palette.vue';
import ptTab from './pt-tab.vue';
import ptTagInput from './pt-tag-input.vue';
// import ptTextarea from './pt-textarea.vue';
import ptTree from './components/tree/pt-tree.vue';
import ptTable from './components/table/pt-table.vue';
import ptCollapse from './pt-collapse.vue';
import ptCollapseItem from './pt-collapse-item.vue';
import ptModal from './pt-modal.vue';
import ptSearch from './components/search/pt-search.vue';
import ptDropdown from './components/dropdown/dropdown.vue';
import ptTooltip from './components/tooltip/tooltip.vue';
import ptInputNumber from './components/input-number/input-number.vue';
import ptList from './components/list/list.vue';
import ptScrollbar from './components/scrollbar/scrollbar.vue';
import ptLoading from './pt-loading.vue';
import ptDragkit from './components/dragkit/dragkit.vue';
import ptFlowGrid from './components/flowgrid/flowgrid.vue';
import ptPopup from './components/popup/pt-popup.vue';
import ptSvg from './pt-svg.vue';
import ptToast from './pt-toast.vue';
import ptTreePanel from './components/tree-panel/tree-panel.vue';

//directives
import autofocus from './directives/autofocus';
import clickoutside from './directives/clickoutside';
import loading from './directives/loading';
import dropdown from './directives/dropdown';
import pttoast from './directives/pt-toast';

//services
import flowgridService from './components/flowgrid/service';

const ptUI = [
	ptButton,
	ptCheckbox,
	ptDatepicker,
	ptInput,
	ptInputNumber,
	ptRadio,
	ptSelect,
	ptSlider,
	ptSwitch,
	ptPalette,
	ptTab,
	ptTagInput,
	ptTree,
	ptTable,
	// ptTextarea,
	ptCollapse,
	ptCollapseItem,
	ptModal,
	ptSearch,
	ptDropdown,
	ptList,
	ptScrollbar,
	ptTooltip,
	ptLoading,
	ptDragkit,
	ptFlowGrid,
	ptPopup,
	ptSvg,
	ptToast,
	ptTreePanel
];

const ptDirective = [
	autofocus,
	clickoutside,
	loading,
	dropdown,
	pttoast
]

ptUI.forEach(component => {
	Vue.component(component.name, component);
});

ptDirective.forEach(directive => {
	Vue.directive(directive.name, directive);
});

Vue.$flowgrid = flowgridService;
