/**
 * @namespace ifan
 * ifan 更新器
 */
ifan.updater = {
	/**
	 * 更新器初始化
	 */
	init: function(){
		var Update= window.runtime.air.update;
		this.updater = new air.ApplicationUpdaterUI();
		this.updater.configurationFile = new air.File("app:/updateConfig.xml");
		this.updater.isCheckForUpdateVisible = false;
		var _updater=this.updater;
		/* TODO : 未来版本可考虑 加入"自行判断是否有新版本"的特性.
		this.updater.addEventListener(Update.events.StatusUpdateEvent.UPDATE_STATUS, function(event){
				if (event.available) {
					// 没有找到新版本
				}else{
					// 找到新版本
				}
			});
		*/
		this.updater.initialize();
	},

	/**
	 * 获取 ifan 的当前版本
	 */
	getVersion: function(){
		return this.updater.currentVersion;
	},

	/**
	 * 开始检查更新
	 * @param {bool} isCheckForUpdateVisible 是否显示开始检查的界面 (默认为 否)
	 */
	check: function(isCheckForUpdateVisible){
		this.updater.isCheckForUpdateVisible = isCheckForUpdateVisible===true;
		this.updater.checkNow();
		if (ifan.app._update_timer) clearTimeout(ifan.app._update_timer);
	}
}
