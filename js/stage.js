(function() {
    T.namespace('stage');
	T.stage.wsize = 15;
	T.stage.hsize = 25;
	
    T.stage.init = function() {
		T.stage.dom = $('.stage');
		T.stage.dom.width(T.stage.wsize * T.shape.blockSize);
		T.stage.dom.height(T.stage.hsize * T.shape.blockSize);
		
		//$('.over-lay').width(T.stage.dom.width());
		$('.over-lay').height(T.stage.dom.height());
    };
	
	var level = 1;
	var score = 0;
	var scoreDom, levelDom;
	var setupOnce = false;
	T.stage.startGame = function() {
		level = 1;
		score = 0;
		
		levelDom = $('.right .level').html(level);
		
		scoreDom = $('.right .score').html(score);
		nextShape = $('.right .next-shape').hide();
		
		setupStageField();
		
		if (!setupOnce) setupEvents();	
		
		setupMainLoop();
		
		setupOnce = true;
	}
	
	var isPaused = false;
	T.stage.pauseGame = function() {
		clearInterval(tickTimer);
		isPaused = true;
	}
	
	T.stage.resumeGame = function() {
		setupMainLoop();
		isPaused = false;
	}
	
	T.stage.togglePause = function(callback) {
		if (isPaused == true) T.stage.resumeGame();
		else T.stage.pauseGame();
		callback(isPaused);
	}
	
	var stageColumns = [];
	function setupStageField() {
		stageColumns = [];
		T.stage.dom.children().remove();
		for (var i = 0; i < T.stage.hsize; i++)
			stageColumns.push(newRow());
	}
	
	function newRow() {
		var row = [];
		for (var j = 0; j < T.stage.wsize; j++) {
			row[j] = null;
		}
		
		return row;
	}
    
    var activeShape;
	var nextActiveShape;
    T.stage.addShape = function(shape) {
        if (activeShape) activeShape.dom.remove();
        activeShape = shape;
        T.stage.dom.append(shape.dom);
		shape.x(
			(Math.floor((T.stage.wsize - shape.width() / T.shape.blockSize) / 2)) * T.shape.blockSize
		);
		shape.y(0);
	}
	
	
	T.stage.addNextShape = function(shape) {
		var next = $('.right .next-shape');
		next.children().remove();
		next.append(shape.dom);
		next.show();
		shape.y((next.height() - shape.dom.height()) / 2);
		shape.x((next.width() - shape.dom.width()) / 2);
		
	}
	
	
	//private utility functions
	function setupEvents() {
		//setup stage events.
        $(document).keyup(function(e) {
            switch(e.keyCode) {
                case 38: //up arrow
                    if (activeShape) {
						activeShape.rotate();
						keepShapeInsideStage();
					}
                    break;
				default:
				break;
            }
        });
		
		$(document).keydown(function(e) {
            switch(e.keyCode) {
                case 37: //left arrow
					if (activeShape) moveShapeLeft();
					break;
				case 39: //right arrow
					if (activeShape) moveShapeRight();
					break;
				case 40: //down arrow
					if (activeShape) moveShapeDown();
					break;
				default:
				break;
            }
			return false;
        });
	}
	
	function moveShapeLeft() {
		if(!isShapeColliding(-1, 0)) {
			activeShape.x(activeShape.x() - T.shape.blockSize)	
		}
		keepShapeInsideStage();
	}
	
	function moveShapeRight() {
		if (!isShapeColliding(1, 0)) {
			activeShape.x(activeShape.x() + T.shape.blockSize);
		}
		keepShapeInsideStage();
	}
	
	function moveShapeDown() {
		if(!isShapeColliding(0, -1)) {
			activeShape.y(activeShape.y() + T.shape.blockSize);
		} else {
			addBlocksToStage(activeShape.localToStage());
			erasePossibleLines();
			activeShape.destroy();
			activeShape = null;
		}
		
		if (isGameOver()) setGameIsOver();
	}
	
	function isShapeBelowStage() {
		return activeShape.y() + activeShape.height() >= T.stage.dom.height();
	}
	
	function keepShapeInsideStage() {
		if (activeShape.x() < 0)
			activeShape.x(0);
		else if (activeShape.x() + activeShape.width() > T.stage.dom.width())
			activeShape.x(T.stage.dom.width() - activeShape.width());
		
		if (isShapeBelowStage())
			activeShape.y(T.stage.dom.height() - activeShape.height())
			
	}
	
	function erasePossibleLines() {
		var y1 = (activeShape.y() + activeShape.height()) / T.shape.blockSize;
		var y0 = activeShape.y() / T.shape.blockSize;
		y0 = T.stage.hsize - y0;
		y1 = T.stage.hsize - y1;
		if (y1 > y0) return;
		
		while(y1 != y0) {
			if (stageColumns[y1]) {
				var row = stageColumns[y1];
				var blocksFound = 0;
				for(var x = 0; x < row.length; x++) {
					if(!row[x]) break;
				}
				
				if(x != row.length)
					y1++;
				else {
					removeFromStage(stageColumns.splice(y1, 1));
					stageColumns.push(newRow());
					scoreUp();
				}
			} else break;
		}
		renderBlocks();
	}
	
	function renderBlocks() {
		var blockSize = T.shape.blockSize;
		var stageH = T.stage.hsize - 1;
		for(var col = 0; col < stageColumns.length; col++) {
			var column = stageColumns[col];
			for(var row = 0; row < column.length; row++) {
				if (column[row]) {
					column[row].css('left', row * blockSize);
					column[row].css('top', (stageH - col) * blockSize);
					
				}
			}
		}
	}
	
	function removeFromStage(blocks) {
		var stg = T.stage.dom;
		for(var i = 0; i < blocks[0].length; i++) {
			$(blocks[0][i]).remove();
		}
	}
	
	function isShapeColliding(xoffset,yoffset) {
		var isColliding = false;
		var shapeBlocks = activeShape.localToStage();
		shapeBlocks.each(function() {
			var block = $(this);
			var x = (parseInt(block.css('left')) / T.shape.blockSize) + xoffset;
			var y = ((T.stage.hsize - 1) - parseInt(block.css('top')) / T.shape.blockSize) + yoffset;
			
			if (stageColumns[y] == undefined || y < 0 || stageColumns[y][x]) {
				isColliding = true;
				return false;
			}
		});
			
		return isColliding;
	}
	
	
	function addBlocksToStage(blocks) {
		var blockSize = T.shape.blockSize;
		blocks.each(function(){
			var block = $(this);
			var x = parseInt(block.css('left')) / blockSize;
			var y = (T.stage.hsize - 1) - parseInt(block.css('top')) / blockSize;
			stageColumns[y][x] = block;
			
		});
		T.stage.dom.append(blocks);
	}
	
	function scoreUp() {
		scoreDom.html(score += 10);
		if (score >= (level * 100)) levelUp();
	}
	
	function levelUp() {
		level++;
		levelDom.html(level);
		tickSpeed -= speedIncreasePerLvl;
		console.log(tickSpeed);
		setupMainLoop();
	}
	
	function isGameOver() {
		return !!(lastRowHasBlocks());
	}
	
	function setGameIsOver() {
		clearInterval(tickTimer);
		T.app.showEndMenu();
	}
	
	function lastRowHasBlocks() {
		var row = stageColumns[T.stage.hsize - 1];
		
		for (var i = 0; i < row.length; i++)
			if (row[i] != null) return true;
		return false;
	}
	
	var tickTimer;
	var tickSpeed = 1000;
	var minTickSpeed = 100;
	var speedIncreasePerLvl = (tickSpeed - minTickSpeed) / minTickSpeed;
	function setupMainLoop() {
		clearInterval(tickTimer);
		tickTimer = setInterval(function() {
			if (!nextActiveShape) nextActiveShape = T.shape.createRandom();
			
			if (!activeShape) {
				T.stage.addShape(activeShape = nextActiveShape);
				nextActiveShape = T.shape.createRandom();
				T.stage.addNextShape(nextActiveShape);
			}
			
			moveShapeDown();
			
			return true;
		}, tickSpeed);
	}
	
})();
