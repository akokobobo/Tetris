(function() {
	var BASE_NS = 'T';
	var T = window.T = {
	    /**
		 * Create a namespace and return the namespaced object literal.
		 * @param {string} namespace the namespace to create
		 * @returns {object} the namespaced object literal or nil
		 */
		_createNamespace: function(namespace) {
			if (namespace == '') { return null; }
			var names = namespace.split('.'), obj = window;
			for (var i = 0, len = names.length; i < len; i++) {
				if (typeof obj[names[i]] == 'undefined') { obj[names[i]] = {}; }
				obj = obj[names[i]];
			}
			return obj;
		},

		/** 
		 * Create a namespace and extend it with and object literal
		 * @param {string} namespace the namespace to create
		 * @param {object} obj (optional) object to extend namespace
		 */
		namespace: function(namespace, obj) {
			var names = (namespace == '') ? [] : namespace.split('.');
			if (names[0] != BASE_NS) { names.unshift(BASE_NS); }
	
			var ns = T._createNamespace(names.join('.'));
			if (obj) { $.extend(ns, obj); }
		}
	}
})();

(function() {
	T.namespace('app');
	
	$(document).ready(function() {
		T.app.resetStats();
		T.stage.init();
		T.app.showStartMenu();
		$('.start.menu button').click(function() {
			T.stage.startGame();
			T.app.hideOverLay();
		});
		
		
		$('.end.menu button').click(function() {
			T.stage.startGame();
			T.app.hideOverLay();
		});
		
		$(document).keyup(function(e){
			if(e.keyCode == 80) {
				T.stage.togglePause(function(paused){
					if(paused) T.app.showPauseMenu();
					else T.app.hideOverLay();
				});
				
				
			}
		});
		
		$('.pause.menu button').click(function() {
			T.stage.resumeGame();
			T.app.hideOverLay();
		});
	});
	
	//--------------------------------
	// Start menu
	//--------------------------------
	T.app.resetStats = function() {
		$('.right .level').html('1');
		$('.right .score').html('0');
		$('.right .next-shape').hide();
	}
	
	T.app.showStartMenu = function() {
		T.app.hideMenus();
		T.app.showOverLay();
		$('.over-lay .start.menu').show();
	}
	
	T.app.showEndMenu = function() {
		T.app.hideMenus();
		T.app.showOverLay();
		$('.over-lay .end.menu').show();
	}
	
	T.app.showPauseMenu = function() {
		T.app.hideMenus();
		T.app.showOverLay();
		$('.over-lay .pause.menu').show();
	}
	
	T.app.hideMenus = function() { $('.over-lay .menu').hide(); }
	T.app.hideOverLay = function() { $('.over-lay').hide(); }
	T.app.showOverLay = function() { $('.over-lay').show(); }
	
})();