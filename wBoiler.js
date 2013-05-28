/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This websanova wBoiler jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github          http://github.com/websanova/wBoiler
 * @version         Version 1.0.0
 *
 ******************************************/

(function($) {
    
    function Boiler(el, options) {
        this.$el = $(el);
        this.options = options;

        this.generate();
    };
    
    Boiler.prototype = {
        generate: function() {
            if (!this.$boiler) {
                // generate code
            }

            return this.$boiler;
        },

        setTheme: function(theme) {
            this.$boiler.attr('class', this.$boiler.attr('class').replace(/wBoiler-theme-.+\s|wBoiler-theme-.+$/, ''));
            this.$boiler.addClass('wBoiler-theme-' + theme);
        }
    };

    $.support.placeholder = 'placeholder' in document.createElement('input');

    $.fn.wBoiler = function(options, value) {
        if (typeof options === 'string') {
            var values = [];
            var elements = this.each(function() {
                var wBoiler = $(this).data('wBoiler');

                if (wBoiler) {
                    var func = (value ? 'set' : 'get') + options.charAt(0).toUpperCase() + options.substring(1).toLowerCase();

                    if (wBoiler[options]) {
                        wBoiler[options].apply(wBoiler, [value]);
                    } else if (value) {
                        if (wBoiler[func]) { wBoiler[func].apply(wBoiler, [value]); }
                        if (wBoiler.options[options]) { wBoiler.options[options] = value; }
                    } else {
                        if(wBoiler[func]) { values.push(wBoiler[func].apply(wBoiler, [value])); }
                        else if (wBoiler.options[options]) { values.push(wBoiler.options[options]); }
                        else { values.push(null); }
                    }
                }
            });

            if (values.length === 1) { return values[0]; }
            else if (values.length > 0) { return values; }
            else { return elements; }
        }

        options = $.extend({}, $.fn.wBoiler.defaults, options);

        function get(el) {
            var wBoiler = $.data(el, 'wBoiler');
            if (!wBoiler) {
                var _options = jQuery.extend(true, {}, options);
                wBoiler = new Boiler(el, _options);
                $.data(el, 'wBoiler', wBoiler);
            }

            return wBoiler;
        }

        return this.each(function() {get(this); });
    };
    
    $.fn.wBoiler.defaults = {
        theme: 'classic'        // set theme
    };
    
})(jQuery);
