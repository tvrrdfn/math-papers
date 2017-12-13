
// 常量
export const CONSTANT = {
	THROTTLE_TIME: 16                            	  // 节流函数的间隔时间单位ms, FPS = 1000 / THROTTLE_TIME
}

// 全局配置
export const globalConfig = {
	isCss3: true,
	minWidth: 960,
	row: 7,                                            // 网格布局的默认行,默认7行
	col: 36,                                           // 网格布局的默认列,默认12列
	distance: 5,                                       // 触发拖拽的拖拽距离,默认5px
	draggable: true,                                   // 是否允许拖拽, 默认允许
	resizable: true,                                   // 是否允许缩放, 默认允许
	minW: 6,                                       // 节点块的最小宽度, 默认占2格
	minH: 8,                                       // 节点块的最小高度, 默认占2格
	overflow: 5,                                       // 当拖拽或缩放超出网格容器的溢出像素
	padding: {                                         // 节点块之间的间距, 默认都为5px
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	cellScale: {                                       // 单元格的宽高比例, 默认16:9
		w: 1,
		h: 1
	}
}
