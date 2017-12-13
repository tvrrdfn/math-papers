import utils from './utils';
import cache from './cache';
import conllision from './conllision';

var
	DK_ID = 'data-dk-id', // 拖拽节点的数据标识id
	DK_NODE_INFO = 'data-dk-node-info', // 待新增拖拽节点携带的数据
	DK_GROUP = 'data-dk-group',		// 分组名称
	DK_DRAG_DROP_ITEM = 'dk-dragdrop-item', // 正在拖拽的节点classname
	DK_ADD_ITEM = 'dk-add-item', // 拖入容器待添加节点的classname
	DK_DELETE_ITEM = 'dk-delete-item', // 拖出容器待删除节点的classname
	DK_USER_SELECT = 'dk-user-select',
	DK_ANIMATE_ITEM = 'dk-animate-item',
	DK_CONTAINER = 'dk-container'
	; // 拖拽节点的占位符


var dragdrop = {
	isDrag: false,					// 是否开始拖拽
	startDragkit: null,				// 开始拖拽容器
	dragkit: null,					// 当前容器
	el: null,						// 当前开始拖拽元素
	dragElement: null,				// 当前拖拽元素
	dragNode: null,					// 当前拖拽节点数据
	dragCoveredNode: null,			// 当前拖拽覆盖节点
	offsetX: null,
	offsetY: null,
	group: null,					// 所在分组
	state: {
		isDragAddNode: false,    // 没有容器的节点(如字段列表)
		isDragCoverNode: false,		// 是否是拖拽覆盖情况
		inside: false,			// 是否是容器内, 判断是进入容器还是离开容器
		isDragCrossNode: false,		// 是否跨容器
	},

	// 开始拖拽
	dragStart: function (event, offsetX, offsetY, ele) {
		console.log(event);

		this.ele = ele;
		this.isDrag = true;

		var targetOffset = this.getOffset(event.target);
		var eleOffset = this.getOffset(ele);

		// 当前鼠标距dk-item左边的距离
		var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

		this.offsetX = targetOffset.left - eleOffset.left + scrollLeft + offsetX || 0;
		// 当前鼠标距dk-item上边的距离
		this.offsetY = targetOffset.top - eleOffset.top + scrollTop + offsetY || 0;

		console.log(document.body.scrollTop, this.offsetX, this.offsetY)

		this.startDragkit = this.dragkit = this.getDragkit();
		this.group = this.startDragkit.group;

		// 容器外点击待新增节点
		if (this.startDragkit.role == 'pull') {
			this.state.isDragAddNode = true; // 状态 新增节点
			this.state.inside = false; 		 // 状态 容器外
			let dragNode = JSON.parse(ele.getAttribute(DK_NODE_INFO));
			dragNode.__id = dragNode[this.startDragkit.idProp];
			this.dragNode = dragNode;
		}else { // 容器内点击节点
			this.state.inside = true; // 初始状态为容器内
			var index = this.startDragkit.index(ele);
			console.log('dragstartIndex', index);
			this.startDragkit.startIndex = index;
			this.startDragkit.fromIndex = index;
			this.dragNode = this.startDragkit.get(index);
			this.dragNode.isPlaceholder = true;
			// 缓存开始容器数据
			this.startDragkit.clone();
		}

		// 设置可以拖拽的区域(同组)
		this.setCanDragContainers();
		// 在body上创建拖拽节点
		this.createDragElement();
		// 移动复制节点
		this.moveDragElement(event);

		this.dragkit.callback('dragstart', this.group);

		// 根据beforeEnter来检查同一组的是否允许拖拽进去
		let containers = cache.all().filter(container => container.group == this.group);
		containers.forEach(c => {
			if(!c.beforeEnter.call(null, c.name, this.dragNode)) {
				c.callback('refusedenter');
			}
		});

	},

	// 正在拖拽
	drag: function (event) {

		// 拖拽状态, 拖拽元素
		if (!this.isDrag && !this.dragNode) return;

		// 移动拖拽节点
		this.moveDragElement(event);

		// 拖拽节点与容器的碰撞检测
		// 拖拽节点的当前坐标
		var node = this.getDragElementCoord(event);
		var hit = conllision.checkContainerHit(node, cache.all().filter(c => c.role != 'pull'), this.state.inside);

		this.dragNodeCoord = hit.dragNodeCoord;

		// 根据碰撞结果判断是否进入容器
		if (hit.isContainerHit) {
			// 判断是否在同一组
			if(hit.currentDragkit.opt.group != this.group) return;

			// 执行回调（如果回调返回false,则不能进入容器）
			if(!hit.currentDragkit.beforeEnter.call(null, hit.currentDragkit.name, this.dragNode)) {
				return;
			}

			// 判断进入
			if (!this.state.inside) {
				this.dragEnterContainer(hit.currentDragkit);
				this.dragkit = hit.currentDragkit;
				this.state.inside = true;
			}
			this.dragStayContainer(this.dragkit);
		} else {
			// 判断离开
			if (this.state.inside) {
				this.dragLeaveContainer(this.dragkit);
				this.state.inside = false;
			}
		}

		this.dragkit.callback('dragging', this.group, event);
	},

	// 结束拖拽
	dragEnd: function (event) {
		if (this.isDrag) {
			console.log("dragend", this.state);

			// 清除当前容器placeholder
			this.dragkit && this.dragkit.updatePlaceholder();

			// 删除节点(跨容器其它操作也要进行删除)
			if (this.state.isDragDeleteNode) {
				// this.dragNode.isPlaceholder = true;
				this.startDragkit.remove(this.dragNode);
				console.log('[callback] remove');
				this.startDragkit.callback('dragremove', this.startDragkit.startIndex);
			}

			// 容器内拖拽
			if (this.startDragkit == this.dragkit && this.state.inside){
				console.log('[callback] inside', this.dragkit.startIndex, this.dragkit.toIndex);
				if(this.dragkit.startIndex != this.dragkit.toIndex) {
					this.dragkit && this.dragkit.callback('dragsort', this.dragkit.startIndex, this.dragkit.toIndex);
				}
			}

			// 覆盖节点
			if (this.dragkit.coverMode) {
				this.dragkit.cover(this.dragNode);
				console.log('[callback] cover');
				this.dragkit && this.dragkit.callback('dragcover', this.dragNode, this.dragkit.toIndex);
			}

			// 新增节点
			console.log(this.state)
			if ((this.state.isDragAddNode || this.state.isDragCrossNode) && this.state.inside && !this.state.isDragCoverNode) {
				// 删除之前容器的节点
				// if(!this.startDragkit.opt.clone){
				// 	this.startDragkit.remove(this.dragNode);
				// }
				console.log('[callback] dragadd');
				if(this.dragkit && this.dragkit.realLength < this.dragkit.maxNodeNum){
					this.dragkit.callback('dragadd', this.dragNode, this.dragkit.toIndex);
				}
			}

			this.dragkit && this.dragkit.callback('dragend');

			this.isDrag = false;
		}
	},

	/**
	 * 拖拽进入容器
	 * 处理添加临时节点(该临时节点在leave容器时要删除)
	 * @param currentDragkit
     */
	dragEnterContainer: function (currentDragkit) {
		// 隐藏删除图标
		this.state.isDragDeleteNode = false;
		this.dragElement.classList.remove(DK_DELETE_ITEM);
		currentDragkit.isCurrentContainer = true;
		currentDragkit.callback('dragenter');

		// 如果进入的是开始容器,且是复制操作,需要增加placeholder
		if(this.startDragkit && this.startDragkit.opt.clone && this.startDragkit == currentDragkit){
			this.dragNode.isPlaceholder = true;
			// 先删除开始位置节点，然后插入
			var innerY = this.getInnerY(currentDragkit);
			// 删除
			var node = currentDragkit.data.splice(currentDragkit.startIndex, 1)[0];
			currentDragkit.add(this.dragNode, innerY);
		}

		// 检测是否切换容器
		this.state.isDragCrossNode = (this.startDragkit && this.startDragkit !== currentDragkit);

		if (this.state.isDragAddNode || this.state.isDragCrossNode) {
			// 容器没有真正超量的情况下, 才会添加
			if (currentDragkit.realLength < currentDragkit.maxNodeNum) {
				// 添加节点
				var innerY = this.getInnerY(currentDragkit);
				currentDragkit.add(this.dragNode, innerY);
			}
		}
	},

	// 在容器内停留(反复触发)
	dragStayContainer: function (dragkit) {
		// 覆盖情况: 配置允许覆盖, 节点数量等于大于配置最大节点数, 且新增或跨容器添加
		if (dragkit.opt.isCoverNode
			&& dragkit.realLength >= dragkit.maxNodeNum
			&& (this.state.isDragAddNode || this.state.isDragCrossNode)) {

			// 拖拽节点的当前坐标
			// var node = this.getDragElementCoord(event);
			// var nodeHit = conllision.checkNodeHit(dragkit.$el,
			// 	dragkit.data, dragkit.getElements(), node, dragkit.opt.coverNodeScale, dragkit.nodeH);
			//
			//
			//
			// if (nodeHit.isNodeHit) {
			// 	this.state.isDragCoverNode = true;
			// 	this.dragCoveredNode = nodeHit.coveredNode;
			// 	this.dragCoveredNode.isCovered = true; // 该node节点要被覆盖
			// } else {
			// 	this.state.isDragCoverNode = false;
			// 	if(this.dragCoveredNode) this.dragCoveredNode.isCovered = false;
			// }

			dragkit.coverMode = true;
			dragkit.coveredLayout(this.getInnerY(dragkit));

		}else{
			this.applyLayout(this.dragNode, dragkit);
		}
	},

	// 拖拽离开容器
	dragLeaveContainer: function (dragkit) {
		console.log(this.state)

		dragkit.isCurrentContainer = false;
		dragkit.callback('dragleave');
		dragkit.fromIndex = -1;

		// 复位开始容器数据
		this.startDragkit && this.startDragkit.reset();

		// 如果是复制操作,需要移除placeholder
		if(this.startDragkit && this.startDragkit.opt.clone){
			this.dragNode.isPlaceholder = false;
		}

		if (!this.state.isDragAddNode) {
			// 显示删除图标
			this.state.isDragDeleteNode = true;
			this.dragElement.classList.add(DK_DELETE_ITEM);
		}

		// 新增离开容器需要移除placeholder
		if ((this.state.isDragAddNode || this.state.isDragCrossNode) && dragkit.coverMode == false) {
			this.state.isDragCrossNode = false;
			dragkit.fromIndex = dragkit.toIndex = -1;
			dragkit.remove(this.dragNode);
		}

		dragkit.coverMode = false;



	},

	// 可以拖拽区域
	setCanDragContainers: function () {
		var containers = cache.all();
		containers.forEach(c => {
			if(c.opt.group == this.group){
				c.isSameGroup = true;
			}
		});
	},

	// 清理
	clearSameGroupStatusOfContainers: function () {
		var containers = cache.all();
		containers.forEach(c => {
			c.isSameGroup = false;
		});
	},

	// 复制拖拽节点
	createDragElement: function () {
		// 复制当前拖拽节点
		this.dragElement = this.ele.cloneNode(true);
		this.dragElement.classList.add(DK_DRAG_DROP_ITEM);
		this.dragElement.classList.remove(DK_ANIMATE_ITEM);
		document.body.appendChild(this.dragElement);
	},

	// 移动拖拽节点
	moveDragElement: function (event) {
		var x = event.pageX - this.offsetX;
		var y = event.pageY - this.offsetY;
		this.dragElement && (this.dragElement.style.cssText = 'top:' + y + 'px;left:' + x + 'px;');
	},

	getDragkit() {
		var containerNode = utils.searchUp(this.ele, node => node.getAttribute(DK_CONTAINER) == 'true');
		var dragkit = cache.get(containerNode.getAttribute('name'));
		if(dragkit == null) {
			throw new Error("dragkit is not instance")
		}
		dragkit.isStartContainer = true;
		dragkit.isCurrentContainer = true;
		return dragkit;
	},

	// 当鼠标位置转换成容器内排版坐标
	getInnerY: function(dragkit) {
		var containerTop = this.getOffset(dragkit.$el).top;
		return this.dragNodeCoord.y - containerTop;
	},

	// 应用布局
	applyLayout: function (node, dragkit) {
		// console.log("innerY", this.getInnerY(node, dragkit), node);
		dragkit.layout(node, this.getInnerY(dragkit));
	},

	// 拖拽节点的当前坐标(x, y为左上角距离屏幕距离)
	getDragElementCoord: function (event) {
		return {
			x: event.pageX - this.offsetX,
			y: event.pageY - this.offsetY,
			w: this.dragElement.clientWidth,
			h: this.dragElement.clientHeight
		};
	},

	getOffset: function(node, offset, parent) {
		if (!parent)
			return node.getBoundingClientRect();
		offset = offset || {top: 0, left: 0};
		if (node === null || node === parent) return offset;
		offset.top += node.offsetTop;
		offset.left += node.offsetLeft;
		return this.getOffset(node.offsetParent, offset, parent);
	},

	/**====== get set 方法======**/

	get isDrag() {return this._isDrag;},
	set isDrag(value) {
		this._isDrag = value;

		// 移除user_select样式
		let api = value ? 'add' : 'remove';
		document.body.classList[api](DK_USER_SELECT);
		document.body.classList[api]('dk-drag');

		// 拖拽结束
		if(value === false){
			this.dragNode = null;

			// 移除body上的临时拖拽节点
			this.dragElement && document.body.removeChild(this.dragElement);
			this.dragElement = null;

			this.group = null;
			this.clearSameGroupStatusOfContainers();

			// 清理临时变量
			this.state = {};
			this.ele = null;

			if(this.dragkit){
				this.dragkit.initStatus();
				this.dragkit = null;
			}

			if(this.startDragkit){
				this.startDragkit.initStatus();
				this.startDragkit = null;
			}

			// 清理临时坐标
			this.offsetX = null;
			this.offsetY = null;
			this.dragNodeCoord = null;
			this.dragCoveredNode = null;
		}
	}
};

export default dragdrop;
