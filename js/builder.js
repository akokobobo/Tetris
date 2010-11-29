(function() {
    var shape = [];
    $(document).ready(function() {
        $('.builder button.north').click(function() {
            $(this).attr('disabled', true);
            buildShapeDirection(0);
        });
        $('.builder button.east').click(function() {
            $(this).attr('disabled', true);
            buildShapeDirection(1);
        });
        $('.builder button.south').click(function() {
            $(this).attr('disabled', true);
            buildShapeDirection(2);
        });
        $('.builder button.west').click(function() {
            $(this).attr('disabled', true);
            buildShapeDirection(3);
        });
        $('.builder button.clear').click(function() {
            $('.builder button').attr('disabled', false);
            shape = [];
        });
        
        $('.builder .grid a').click(function() {
            $(this).toggleClass('active');
            return false;
        })
    });
    
    T.shape.blockSize
    
    function buildShapeDirection(dir) {
        var side = [];
        $('.builder .grid a.active').each(function(i, a) {
            var index = $(a).attr('data-index');
            var x = index % 4;
            var y = Math.floor(index/4);
            side.push('{x: '+x+', y:'+y+'}');
        });
        if (side.length) shape[dir] = side;
        
        outputCode();
    }
    
    function outputCode() {
        var str = '[\n'
        +'//north\n[' + (shape[0] ? shape[0].join(',') : '') +'],\n'
        +'//east\n[' + (shape[1] ? shape[1].join(',') : '') +'],\n'
        +'//south\n[' + (shape[2] ? shape[2].join(',') : '') +'],\n'
        +'//west\n[' + (shape[3] ? shape[3].join(',') : '') +']\n'
        +']';
        $('.builder textarea').val(str);
    }
    
    
})();