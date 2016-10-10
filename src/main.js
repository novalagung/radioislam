let vm = {}

vm.SECOND = 1000
vm.urlContent = 'data.json'
vm.data = []

vm.getContent = (callback = $.noop) => {
    $.getJSON(vm.urlContent, (res) => {
        callback(res.data)
    })
}

vm.stream = (id) => {
    let row = vm.data.find((d) => d.id == id)
    $('#selected-radio').val(id)

    let $miniPlayer = $('.mini-player')
    $miniPlayer.addClass('loading')

    let fallback = (message) => {
        let $errorMessage = $('.error-message')

        $miniPlayer.removeClass('loading')
        $errorMessage.html(message)
        setTimeout(() => {
            $errorMessage.empty()
        }, 4 * vm.SECOND)
    }

    let timeout = setTimeout(() => {
        fallback('Timeout')
    }, 4 * vm.SECOND)

    let $player = $('#player')
    $player.jPlayer('destroy')
    $player.jPlayer({
        ready: function (event) {
            let config = { mp3: row.stream }
            $(this).jPlayer('setMedia', config).jPlayer('play')
        },
        swfPath: 'js',
        supplied: 'mp3'
    })
    $player.bind($.jPlayer.event.playing, () => { 
        clearTimeout(timeout)
        
        setTimeout(() => {
            $miniPlayer.removeClass('loading')
        }, 1 * vm.SECOND)
    })
    $player.bind($.jPlayer.event.error, () => {
        fallback('Terjadi error, silakan coba channel radio lainnya')
    })
}

vm.init = () => {
    let $radioListContainer = $('#all-radio').empty()
    let $dropdownRadio = $('#selected-radio').val('').empty()

    // get content
    vm.getContent((data) => {
        vm.data = data

        // plot radio
        data.forEach((d, i) => {
            $('<li />').html(d.title).appendTo($radioListContainer)
            $('<option />').val(d.id).html(d.title).appendTo($dropdownRadio)
        })

        // start stream
        vm.stream('radiorodja')
    })

    // on radio change
    $dropdownRadio.on('change', (e) => vm.stream($(e.target).val()))
}

$(() => {
    vm.init()
})