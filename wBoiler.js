(function ($) {
  'use strict';

  function Boiler(el, options) {
    this.$el = $(el);
    this.options = options;

    this.init = false;

    this._generate();
  }

  Boiler.prototype = {
    _generate: function () {
      this.$boiler = $('<div>boiler demo</div>');

      this._setOptions();

      this.$el.append(this.$boiler);

      this.init = true;
    },

    destroy: function () {
      this.$boiler.remove();
      $.removeData(this.$el, 'wBoiler');
    },

    _setOptions: function () {
      var opt, func;

      for (opt in this.options) {
        this.options[opt] = this.$el.attr('data-' + opt) || this.options[opt];
        func = 'set' + opt.charAt(0).toUpperCase() + opt.substring(1);

        if (this[func]) {
          this[func](this.options[opt]);
        }
      }
    },

    setTheme: function (theme) {
      theme = theme.split(' ');
      this.$boiler.attr('class', (this.$boiler.attr('class') || '').replace(/wBoiler-theme-.+\s|wBoiler-theme-.+$/, ''));
      
      for (var i = 0, ii = theme.length; i < ii ; i++) {
        this.$boiler.addClass('wBoiler-theme-' + theme[i]);
      }
    }
  };

  $.support.placeholder = 'placeholder' in document.createElement('input');

  $.fn.wBoiler = function (options, value) {
    function get() {
      var wBoiler = $.data(this, 'wBoiler');

      if (!wBoiler) {
        wBoiler = new Boiler(this, $.extend(true, {}, options));
        $.data(this, 'wBoiler', wBoiler);
      }

      return wBoiler;
    }

    if (typeof options === 'string') {
      var wBoiler,
          values = [],
          func = (value !== undefined ? 'set' : 'get') + options.charAt(0).toUpperCase() + options.substring(1),

          setOpt = function () {
            if (wBoiler[func]) { wBoiler[func].apply(wBoiler, [value]); }
            if (wBoiler.options[options]) { wBoiler.options[options] = value; }
          },

          getOpt = function () {
            if (wBoiler[func]) { return wBoiler[func].apply(wBoiler, [value]); }
            else if (wBoiler.options[options]) { return wBoiler.options[options]; }
            else { return undefined; }
          },

          runOpt = function () {
            wBoiler = $.data(this, 'wBoiler');
            // Or optionally if you want to allow on the fly creation when
            // using set / get then change the line above to the ones below.
            // options = $.extend({}, $.fn.wBoiler.defaults);
            // wBoiler = $.proxy(get, this)();

            if (wBoiler) {
              if (wBoiler[options]) { wBoiler[options].apply(wBoiler, [value]); }
              else if (value !== undefined) { setOpt(); }
              else {  values.push(getOpt()); }
            }
          };

      this.each(runOpt);

      return values.length ? (values.length === 1 ? values[0] : values) : this;
    }

    options = $.extend({}, $.fn.wBoiler.defaults, options);

    return this.each(get);
  };

  $.fn.wBoiler.defaults = {
    theme: 'classic',
  };

  $.fn.bindMobileEvents = function () {
    $(this).on('touchstart touchmove touchend touchcancel', function () {
      var touches = (event.changedTouches || event.originalEvent.targetTouches),
          first = touches[0],
          type = '';

      switch (event.type) {
      case 'touchstart':
        type = 'mousedown';
        break;
      case 'touchmove':
        type = 'mousemove';
        event.preventDefault();
        break;
      case 'touchend':
        type = 'mouseup';
        break;
      default:
        return;
      }

      var simulatedEvent = document.createEvent('MouseEvent'); 

      simulatedEvent.initMouseEvent(
        type, true, true, window, 1, 
        first.screenX, first.screenY, first.clientX, first.clientY, 
        false, false, false, false, 0/*left*/, null
      );

      first.target.dispatchEvent(simulatedEvent);
    });
  };
})(jQuery);