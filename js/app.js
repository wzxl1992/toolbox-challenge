
$(document).ready(function(){
    var tiles = [];
    var idx;
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
           tileNum: idx,
           src: 'img/tile' + idx +'.jpg'

        });
    }
    
    var startTime = _.now();
    var timer = window.setInterval(timeCount, 1000);
    console.log(tiles);
    backTiles();
    $('#restart').click(playAgain);

    function backTiles() {
        // shuffle 32 tiles
        var shuffledTiles = _.shuffle(tiles);
        console.log(shuffledTiles);
        // choose first 8 tiles
        var selectedTiles = shuffledTiles.slice(0,8);
        console.log(selectedTiles);
         //double the tiles, make it 16
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
           tilePairs.push(_.clone(tile));
           tilePairs.push(_.clone(tile));
        });
        //now we shuffle 16 tiles again
        tilePairs = _.shuffle(tilePairs);

        console.log(tilePairs);
        //set all tiles to back-tile
        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;

        _.forEach(tilePairs, function(tile, elemIndex){
            if (elemIndex > 0 && 0 == elemIndex % 4) {
               gameBoard.append(row);
               row = $(document.createElement('div'));
            }

            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt:'image of tile' + tile.tileNum
            });
            img.data('tile', tile);
            img.data('same', false);
            row.append(img);
        });
        gameBoard.append(row);
        $('#game-board img').click(letsPlay);
    }


    //once click the back-tile, it flips back
    var flippedTile = [];
    var totalPair = 8;
    var matchNum = 0;
    var missNum =0;
    $('#total').text(totalPair);
    $('#match').text(matchNum);
    $('#miss').text(missNum);
    function letsPlay(){
        var img = $(this);
        var tileOne = img.data('tile');
        var tileMatch = img.data('same');
        if(tileMatch){
            return;
        }
        img.data('same',true);

        flip(img);

        if(0 == flippedTile.length) {
            flippedTile.push(img);
        }
        else {
            var tileTest = flippedTile[0];
            var tileTwo = tileTest.data('tile');
            if(tileTwo.tileNum == tileOne.tileNum) {
                totalPair--;
                $('#total').text(totalPair);
                console.log(totalPair);
                matchNum++;
                $('#match').text(matchNum);
                if( 8 == matchNum){
                    //alert("congratulation, you got all pairs!!!!!Click play to play again");
                    $('#congrat').text("Congratulation,You got all pairs! Click Start Game to Play Again");
                    //window.clearInterval(timer);   
                }
            }
            else {
                img.data('same',false);
                tileTest.data('same',false);
                window.setTimeout(function(){
                    flip(img);
                    flip(tileTest);
                },1000);
                missNum++;
                $('#miss').text(missNum);
            }
            flippedTile.length = 0;
        }

    } // on click of gameboard images

    //flip back image
    function flip(img) {
        var tile = img.data('tile');
        img.fadeOut(100, function(){
            if (tile.flipped) {
                img.attr('src', 'img/tile-back.png');
            }
            else {
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.fadeIn(100);
        });
    }

    //set time
    function timeCount(){
        var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        $('#elapsed-seconds').text(elapsedSeconds);
        if(8 == matchNum){
            window.clearInterval(timer);
        }  
    }

    //play the game again
    function playAgain() {
        var totalPair = 8;
        var matchNum = 0;
        var missNum =0;
        $('#total').text(totalPair);
        $('#match').text(matchNum);
        $('#miss').text(missNum);
        $('#elapsed-seconds').text("0");
        $('#game-board').empty();
        backTiles();
        $('img').hide().fadeIn(1000);
        startTime = _.now();
        window.clearInterval(timer);
        timer = window.setInterval(timeCount, 1000);
    }

}); // jquery ready function