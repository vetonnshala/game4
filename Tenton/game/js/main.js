$(document).ready(function() {
    const loja4 = new Loja4('#loja4')

    loja4.onPlayerMove = function() {
        $('#lojtari').text(loja4.lojtari);
    }

    $('#restart').click(function() {
        loja4.restart();
    })
});