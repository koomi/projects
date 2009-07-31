
/**
 * 操作按钮的菜单
 */
ifan.Menu = function(){
	this.shortcuts = {
		'reply': '2',
		'dmsg': 'D',
		'favorite':'F',
		'rt': 'T',
		'del': '退格',
		'browse': '→',
		'clearall': 'K',
		'refresh': 'R',
		'logout': 'L',
		'goprofile': '←'
	};
	this.shortcutActions = {
		'NUMBER_2': 'reply',
		'D': 'dmsg',
		'F': 'favorite',
		'T': 'rt',
		'DELETE': 'del',
		'RIGHT': 'browse',
		'K': 'clearall',
		'R': 'refresh',
		'L': 'logout',
		'LEFT': 'goprofile'
	};
	var options = new air.NativeWindowInitOptions();
	options.transparent = true;
	options.type = air.NativeWindowType.LIGHTWEIGHT;
	options.systemChrome = air.NativeWindowSystemChrome.NONE;
	options.resizable = false;
	options.minimizable = false;
	options.maximizable = false;
	var width = ifan.util.os.linux ? 202 : 220;
	var bounds = new air.Rectangle(
		/* left */ 0,
		/* top */ 0,
		/* width */ width,
		/* height */ 0
	);
	this.loader = air.HTMLLoader.createRootWindow( 
		false, //hidden 
		options, 
		false, //no scrollbars
		bounds
	);
	this.loader.placeLoadStringContentInApplicationSandbox = true;
	this.loader.paintsDefaultBackground = false;
	this.loader.loadString('<html><head><meta name="Content-Type" content="text/html; charset=UTF-8" /><link rel="stylesheet" href="app:/style.css" type="text/css" media="screen" /></head><body id="actions-menu"><div id="actions-dialog">\
			<ul>\
				<li id="reply">回复这条消息</li>\
				<li id="dmsg">发送私信</li>\
				<li class="sep"></li>\
				<li id="favorite">收藏这条消息</li>\
				<li id="rt">转帖这条消息</li>\
				<li id="del">删除这条消息</li>\
				<li id="browse">浏览这条消息</li>\
				<li class="sep"></li>\
				<li id="clearall">清空消息列表</li>\
				<li class="sep"></li>\
				<li id="refresh">刷新</li>\
				<li id="logout">注销</li>\
				<li class="sep"></li>\
				<li id="goprofile">浏览用户的叽歪主页</li>\
			</ul>\
		</div></body></html>');

	$E.on(this.loader, air.Event.COMPLETE, function(e){
		if (!ifan.util.os.linux){ // flash can not drop shadow at linux platform
			ifan.ui.dropshadow(this.loader);
		} else {
			$D.addClass(this.loader.window.document.body, 'linux');
		}
		var nw = this.loader.stage.nativeWindow;
		nw.height = this._get('actions-menu').offsetHeight;
		this.actionEls = [];
		var lis = this._get('actions-dialog').getElementsByTagName('li'),
			modifier = ifan.util.os.mac ? 'CMD' : 'CTRL';
		for (var i=0; i<lis.length; i++){
			var id = lis[i].id;
			if (id){
				this.actionEls.push(lis[i]);
				var span = document.createElement('span');
				span.innerHTML = modifier + ' + ' + this.shortcuts[id];
				lis[i].appendChild(span);
				if (id == 'dmsg') this._dmsgShortCut = span.outerHTML;
				if (id == 'favorite') this._favShortcut = span.outerHTML;
			}
		}
		this.handleClick();
		this.handleHover();
		this.handleShortcuts();
	}, this, true);
}

ifan.Menu.prototype = {
	/**
	 * 显示菜单
	 * @param {object} event 鼠标的点击事件
	 * @param {function} fn 显示时执行的函数
	 */
	show: function(event, attr, fn){
		var ldr = this.loader,
			nw = ldr.stage.nativeWindow,
			bounds = air.Screen.mainScreen.visibleBounds,
			scrX = event.screenX,
			scrY = event.screenY;
		if (scrX + nw.width > bounds.right){
			scrX = bounds.right - nw.width - 10;
		}
		if (scrY + nw.height > bounds.bottom){
			scrY -= nw.height;
		}
		nw.x = scrX;
		nw.y = scrY;
		nw.visible = true;
		nw.orderToFront();
		this.actionDescription = attr;
		this.handleShow();
		if (this.curItem) $D.removeClass(this.curItem);
		fn && fn();
	},

	/**
	 * 隐藏菜单
	 * @param {function} 隐藏时执行的函数
	 */
	hide: function(fn){
		var nw = this.loader.stage.nativeWindow;
		nw.visible = false;
		if (ifan.msg._curActbtn){
			$D.removeClass(ifan.msg._curActbtn, 'active');
			ifan.msg._curActbtn = null;
		}
		fn && fn();
	},

	isShow: function(){
		return this.loader.stage.nativeWindow.visible;
	},

	handleShow: function(){
		var d = this.actionDescription,
			items = this._disbaledItems[d['type']],
			isFavorited = $D.hasClass(d['msgid'], 'favorited');
			
		for (var i=0; i<this.actionEls.length; i++){
			var li = this.actionEls[i];
			if (items[li.id]){
				$D.addClass(li, 'disabled');
			} else {
				$D.removeClass(li, 'disabled');
			}
		}
		
		this._get('dmsg').innerHTML = (d['type'] == 'dmsg' ? '回复私信' : '发送私信')+ this._dmsgShortCut;
		this._get('favorite').innerHTML = (isFavorited ? '取消收藏' : '收藏这条消息') + this._favShortcut;
	},
	
	handleClick: function(){
		var _this = this;
		$E.on(this.actionEls, 'click', function(e){
			$E.stopEvent(e);
			if (_this._isDisabled(this)) return;
			_this.actionFns[this.id].call(_this);
			_this.hide();
			window.nativeWindow.activate();
		});
	},

	_isDisabled: function(el){
		return $D.hasClass(el, 'disabled');
	},

	handleHover: function(){	// 不使用 CSS 的 hover 是因为鼠标移动过快时无法把 hover 状态清除
		var _this = this,
			els = this.actionEls;
		$E.on(els, 'mouseover', function(e){
			if (_this.curItem) $D.removeClass(_this.curItem, 'hover');
			if (_this._isDisabled(this)) return;
			_this.curItem = this;
			$D.addClass(_this.curItem, 'hover');
		});

		$E.on(els, 'mouseout', function(e){
			if (_this._isDisabled(this)) return;
			if (_this.curItem) $D.removeClass(_this.curItem, 'hover');
			_this.curItem = null;
		});

		$E.on(this.loader.stage, air.Event.MOUSE_LEAVE, function(e){
			if (_this.curItem) $D.removeClass(_this.curItem, 'hover');
		});
	},

	actionFns: {
		'reply': function(){
			var d = this.actionDescription;
			ifan.msg.reply(d['to_uname'], d['msgid']);
		},

		'dmsg': function(){
			var d = this.actionDescription;
			ifan.msg.dmsg(d['to_uname'], d['to_uid'], d['msgid']);
		},

		'favorite': function(){
			var d = this.actionDescription,
				url = STATUS_FAVORITE+d['msgid']+'.json',
				method = 'addClass';
			
			if ($D.hasClass(d['msgid'], 'favorited')){
				url = STATUS_FAVORITE_DESTROY+d['msgid']+'.json';
				method = 'removeClass';
			}
			$C.asyncRequest('POST', url, {
				success: function(o){
					$D[method](d['msgid'], 'favorited');
				},
				failure: function(o){}
			}, ' ');
		},

		'rt': function(){
			var li = $D.get(this.actionDescription['msgid']),
				author = li.getElementsByTagName('h2')[0].innerText,
				content = li.getElementsByClassName('msg')[0].innerText,
				textarea = $D.get('postform')['status'];
			textarea.value = ifan.prefs.get('refan_format').replace(/{%某人%}/, '@'+author).replace(/{%消息%}/, content);
			ifan.ui.focusInTextarea(textarea);
		},

		'del': function(){
			var p = ifan.app.panels['msgdel'];
			p.innerEl.innerHTML = '<p>确定删除这条消息吗？</p><p class="act"><button id="msgdel-cancel" class="msgdel-hide">取消</button> <button id="msgdel-del" class="msgdel-del" status_id="' + this.actionDescription['msgid'] + '">删除</button></p>';
			if (ifan.util.os.win){
				$D.insertAfter('msgdel-cancel', 'msgdel-del');
			}
			setTimeout(function(){
				$D.get('msgdel-cancel').focus();
			}, 10);
			p.show(true);
		},

		'browse': function(){
			var statusURL = HOST + '/statuses/';
			if (ifan.app._is_twitter) statusURL = HOST + '/' + this.actionDescription['to_uname'] + '/status/';
			ifan.util.openURLInBrowser(statusURL+this.actionDescription['msgid']);
		},

		'clearall': function(){
			$D.get('msgs').innerHTML = '';
		},

		'refresh': function(){
			ifan.msg.updateLoop(true);
		},

		'logout': function(){
			ifan.app.logout();
		},

		'goprofile': function(){
			var profile = this.actionDescription['to_uid'];
			if (ifan.app._is_twitter) profile = this.actionDescription['to_uname'];
			ifan.util.openURLInBrowser(HOST+'/'+encodeURIComponent(profile));
		}
	},

	_get: function(id){			// yui's Dom.get don't cross window
		return this.loader.window.document.getElementById(id);
	},

	_disbaledItems: {
		'self': {'reply':true, 'dmsg':true},
		'else': {'del':true},
		'dmsg': {'reply':true, 'rt': true, 'favorite':true, 'del':true, 'browse':true}
	},

	isNoContext: function(act){
		var	nocontext = ['clearall', 'refresh', 'logout'];
		for (var i=0; i<nocontext.length; i++){
			if (act == nocontext[i]) return true;
		}
		return false;
	},

	/**
	 * 清理内存
	 */
	dealloc: function(){
        if(this.loader){
			this.loader.stage.nativeWindow.close();
			this.loader = null;
		}   	
	},

	handleShortcuts: function(){
		var acts = this.shortcutActions,
			modifier = ifan.util.os.mac ? 'meta' : 'ctrl',
			_this = this;
		
		for (var act in acts){
			(function(a){
				var keyData = {
					keys: air.Keyboard[a]
				};
				keyData[modifier] = true;
				var handler = {
					fn: function(key, e){
						$E.stopEvent(e[1]);
						if (!this.isNoContext(acts[a])){
							if (!ifan.msg._curLi) return;
							var button = $D.getElementsByClassName('all', 'b', ifan.msg._curLi);
							if (!button.length) return;
							this.actionDescription = ifan.msg._getAttr(button[0].parentNode);
							var	items = this._disbaledItems[this.actionDescription['type']];
							if (items[acts[a]]) return;
						}
						this.actionFns[acts[a]].call(this);
					},
					scope: _this,
					correctScope: true
				};
				
				var listener = new YAHOO.util.KeyListener(document.body, keyData, handler);
				listener.enable();
			})(act);
		}
	}
}
