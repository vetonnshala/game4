class Loja4 {
    constructor(selector) {
        this.ROWS = 6;
        this.COLS = 7;
        this.lojtari = 'red';
        this.selector = selector;
        this.isGameOver = false;
        this.onPlayerMove = function() {};
        this.createGrid();
        this.setupEventListeners();
    }


    //Krijimi i cells 
    createGrid() {
        const $board = $(this.selector);
        $board.empty();
        this.isGameOver = false;
        this.lojtari = 'red';
        for (let row = 0; row < this.ROWS; row++) {
            const $row = $('<div>')
                .addClass('row');
            for (let col = 0; col < this.COLS; col++) {
                const $col = $('<div>')
                    .addClass('col empty')
                    .attr('data-col', col)
                    .attr('data-row', row);
                $row.append($col);
            }
            $board.append($row);
        }
    }


    //Event Listeners per cells 
    setupEventListeners() {
        const $board = $(this.selector);
        const that = this;

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }

        $board.on('mouseenter', '.col.empty', function() {
            if (that.isGameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.lojtari}`);
        });

        $board.on('mouseleave', '.col', function() {
            $('.col').removeClass(`next-${that.lojtari}`);
        });

        $board.on('click', '.col.empty', function() {
            if (that.isGameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.lojtari}`);
            $lastEmptyCell.addClass(that.lojtari);
            $lastEmptyCell.data('lojtari', that.lojtari);

            const winner = that.checkForWinner(
                $lastEmptyCell.data('row'),
                $lastEmptyCell.data('col')
            )
            if (winner) {
                that.isGameOver = true;
                alert(`Game Over! Player ${that.lojtari} has won!`);
                $('.col.empty').removeClass('empty');
                return;
            }

            that.lojtari = (that.lojtari === 'red') ? 'black' : 'red';
            that.onPlayerMove();
            $(this).trigger('mouseenter');
        });
    }


    //Funksioni per me bo check winner-in 
    checkForWinner(row, col) {
        const that = this;

        function $getCell(i, j) {
            return $(`.col[data-row='${i}'][data-col='${j}']`);
        }

        function checkDirection(direction) {
            let total = 0;
            let i = row + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >= 0 &&
                i < that.ROWS &&
                j >= 0 &&
                j < that.COLS &&
                $next.data('lojtari') === that.lojtari
            ) {
                total++;
                i += direction.i;
                j += direction.j;
                $next = $getCell(i, j);
            }
            return total;
        }

        function checkWin(directionA, directionB) {
            const total = 1 +
                checkDirection(directionA) +
                checkDirection(directionB);
            if (total >= 4) {
                return that.lojtari;
            } else {
                return null;
            }
        }



        //4 funksionet qe kontrollojn poziten e 4 dots me e percaktu fituesin 
        function checkDiagonalBLtoTR() {
            return checkWin({ i: -1, j: -1 }, { i: 1, j: 1 });
        }

        function checkDiagonalTLtoBR() {
            return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 });
        }

        function checkVerticals() {
            return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
        }

        function checkHorizontals() {
            return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
        }

        return checkVerticals() ||
            checkHorizontals() ||
            checkDiagonalBLtoTR() ||
            checkDiagonalTLtoBR();
    }

    restart() {
        this.createGrid();
        this.onPlayerMove();
    }
}