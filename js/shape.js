//Shapes
(function() {
    T.namespace('shape.create');
    
    var colors = ['#dfe52f', '#22a4ff', '#ffa340', '#cf93d0', '#90a2ff', '#8eb583', '#9ca0c6', '#c6baa3'];
    var blockSize = 12;
    T.shape.blockSize = blockSize;
    T.shape._new = function(dirs) {
        var currentDir = 0;
        var shapeDom = $('<div class="shape"></div>');
        var blocks = [];
        var color = colors[Math.floor(Math.random() * colors.length)]
        
        for(var i = 0; i < 4; i++) {
            blocks[i] = [];
            for(var j = 0; j < dirs[i].length; j++) {
                blocks[i].push(
                    $('<a href="#"></a>').css({
                        left: dirs[i][j].x * blockSize,
                        top: dirs[i][j].y * blockSize,
                        backgroundColor: color
                    }));
            }
        }
        
        /**
         * Renders blocks for currentDir into shapeDom
         */
        function render() {
            shapeDom.find('a').remove();
            var width = 0; var height = 0;
            for(var i = 0 ; i < blocks[currentDir].length; i++) {
                var block = blocks[currentDir][i];
                var left = parseInt(block.css('left'));
                var right = parseInt(block.css('top'));
                
                width = left > width ? left : width;
                height = right > height ? right : height;
                
                shapeDom.append(blocks[currentDir][i]);
            }
            
            shapeDom.css({
               width: width + blockSize,
               height: height + blockSize
            });
        }
        render();
        
        return {
            rotate: function() {
                currentDir = (currentDir + 1) % 4;
                render();
            },
            dom: shapeDom,
            x: function(_x) {
                if(!isNaN(_x)) { shapeDom.css('left', _x); return _x; }
                return parseInt(shapeDom.css('left'));
            },
            y: function(_y) {
                if(!isNaN(_y)) { shapeDom.css('top', _y); return _y; }
                return parseInt(shapeDom.css('top'));
            },
            width: function() { return shapeDom.width(); },
            height: function() { return shapeDom.height(); },
            destroy: function() {
                shapeDom.remove().children().remove();
                shapeDom = null;
            },
            localToStage: function() {
                var x = this.x();
                var y = this.y();
                var blocks = shapeDom.children().clone();
                blocks.each(function(i, block) {
                    var b = $(block);
                    var top = parseInt(b.css('top')); var left = parseInt(b.css('left'));
                    b.css('top', top + y).css('left', left + x);
                });
                return blocks;
            }
        }
    }
    
    T.shape.create.L_left = function() {
        return T.shape._new([
            //north
            [{x: 0, y:0},{x: 1, y:0},{x: 1, y:1},{x: 1, y:2}],
            //east
            [{x: 2, y:0},{x: 0, y:1},{x: 1, y:1},{x: 2, y:1}],
            //south
            [{x: 0, y:0},{x: 0, y:1},{x: 0, y:2},{x: 1, y:2}],
            //west
            [{x: 0, y:0},{x: 1, y:0},{x: 2, y:0},{x: 0, y:1}]
        ]);
    }
    
    T.shape.create.T = function() {
        return T.shape._new([
            //north
            [{x: 1, y:0},{x: 0, y:1},{x: 1, y:1},{x: 2, y:1}],
            //east
            [{x: 0, y:0},{x: 0, y:1},{x: 1, y:1},{x: 0, y:2}],
            //south
            [{x: 0, y:0},{x: 1, y:0},{x: 2, y:0},{x: 1, y:1}],
            //west
            [{x: 1, y:0},{x: 0, y:1},{x: 1, y:1},{x: 1, y:2}]
        ]);
    }
    
    T.shape.create.Squigle_right = function() {
        return T.shape._new([
            //north
            [{x: 0, y:0},{x: 0, y:1},{x: 1, y:1},{x: 1, y:2}],
            //east
            [{x: 1, y:0},{x: 2, y:0},{x: 0, y:1},{x: 1, y:1}],
            //south
            [{x: 0, y:0},{x: 0, y:1},{x: 1, y:1},{x: 1, y:2}],
            //west
            [{x: 1, y:0},{x: 2, y:0},{x: 0, y:1},{x: 1, y:1}]
        ]);
    }
    
    T.shape.create.Squigle_left = function() {
        return T.shape._new([
            //north
            [{x: 1, y:0},{x: 0, y:1},{x: 1, y:1},{x: 0, y:2}],
            //east
            [{x: 0, y:0},{x: 1, y:0},{x: 1, y:1},{x: 2, y:1}],
            //south
            [{x: 1, y:0},{x: 0, y:1},{x: 1, y:1},{x: 0, y:2}],
            //west
            [{x: 0, y:0},{x: 1, y:0},{x: 1, y:1},{x: 2, y:1}]
        ]);
    }
    
    T.shape.create.line = function() {
        return T.shape._new([
            //north
            [{x: 0, y:0},{x: 0, y:1},{x: 0, y:2},{x: 0, y:3}],
            //east
            [{x: 0, y:0},{x: 1, y:0},{x: 2, y:0},{x: 3, y:0}],
            //south
            [{x: 0, y:0},{x: 0, y:1},{x: 0, y:2},{x: 0, y:3}],
            //west
            [{x: 0, y:0},{x: 1, y:0},{x: 2, y:0},{x: 3, y:0}]
        ]);
    }
    
    T.shape.create.block = function() {
        return T.shape._new([
            //north
            [{x: 0, y:0},{x: 1, y:0},{x: 0, y:1},{x: 1, y:1}],
            //east
            [{x: 0, y:0},{x: 1, y:0},{x: 0, y:1},{x: 1, y:1}],
            //south
            [{x: 0, y:0},{x: 1, y:0},{x: 0, y:1},{x: 1, y:1}],
            //west
            [{x: 0, y:0},{x: 1, y:0},{x: 0, y:1},{x: 1, y:1}]
        ]);
    }
    
    var shapeFn = (function() {
        var a = [];
        for (var i in T.shape.create)
            a.push(i);
        return a;
    })();
    
    T.shape.createRandom = function() {
        var fn = shapeFn[Math.floor(Math.random() * shapeFn.length)];
        return T.shape.create[fn]();
    }
    
})();