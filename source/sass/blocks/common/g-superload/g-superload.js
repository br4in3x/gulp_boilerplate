/*global document, window, jQuery*/
(function ($) {
    'use strict';
    $(document).on('ready', function () {
        window.setTimeout(function () {
            $('.g-superload').removeClass('g-superload--is_loading');
        }, 700);
    });
}(jQuery));
