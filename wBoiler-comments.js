// Make sure we have a closure so that we don't have any conflicts
// with our plugin class and prototype or any other functions.
(function ($) {

  // Its a good idea to use `strict` to reduce number of errors
  // in your plugin and code in general.
  'use strict';

  // Plugin function class.  This object will hold the properties
  // for each instantiation of the plugin.
  function Boiler(el, options) {
    this.$el = $(el);
    this.options = options;

    // Occasionally useful to track the initialization of our plugin.
    // Useful if we want specific things to happen or not on initialization.
    this.init = false;

    // Call our generate method to setup the plugin.
    this._generate();
  }

  // Prototype our class.  This shares the core code between all
  // instantiations of our plugin.  The majority of our code will
  // live here.
  Boiler.prototype = {
    _generate: function () {

      // Visual setup should be here.  If you have many components
      // it's a good idea to break it up into functions however keep
      // the core of it here.
      this.$boiler = $('<div>boiler demo</div>');

      this._setOptions();

      // Probably will append something at this point.
      this.$el.append(this.$boiler);

      // Set init to true so that we now our plugin has been setup.
      this.init = true;
    },

    // Destroy method to completely remove the plugin.  Typically
    // we will just remove the main element and the `data` stored
    // with it.  Any additional things that need to removed go here.
    destroy: function () {
      this.$boiler.remove();
      $.removeData(this.$el, 'wBoiler');
    },

    // This options setting routine first checks to see if a local `data-`
    // attribute is set then checks the options object.  Finally once the
    // proper option value is set it will go on to check for a `set`
    // function which it will call to initialize the variable.
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

    // This is a common function useful for setting themes.  It will
    // support multiple themes separated by a space.
    setTheme: function (theme) {
      theme = theme.split(' ');
      this.$boiler.attr('class', (this.$boiler.attr('class') || '').replace(/\s?wBoiler-theme-(\S*)\s?/, ''));
      
      for (var i = 0, ii = theme.length; i < ii ; i++) {
        this.$boiler.addClass('wBoiler-theme-' + theme[i]);
      }
    }
  };

  // Any checks for specific browser support can go here. 
  $.support.placeholder = 'placeholder' in document.createElement('input');

  // Our plugin function that will extend jQuery.  Try to keep the name
  // unique to not overwrite any existing function names.
  $.fn.wBoiler = function (options, value) {

    // Our get function for instantiating our plugin object.
    function get() {
      var wBoiler = $.data(this, 'wBoiler');

      if (!wBoiler) {
        wBoiler = new Boiler(this, $.extend(true, {}, options));
        $.data(this, 'wBoiler', wBoiler);
      }

      return wBoiler;
    }

    // Our get / set routine to get and set options.  Works on multiple
    // events and with our `set` functions and `options` object.
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

      // Run on each element.
      this.each(runOpt);

      // Make sure to return the `this` object unless we are running
      // a get call in which case we will return the values.
      return values.length ? (values.length === 1 ? values[0] : values) : this;
    }

    // Extend our object before running our get method.
    options = $.extend({}, $.fn.wBoiler.defaults, options);

    // Return the elements to maintain jQuery method chaining.
    return this.each(get);
  };

  // Setup our default options.  Note an other option type objects
  // can also be setup in this area to keep them all in one place.
  $.fn.wBoiler.defaults = {
    theme: 'classic',
  };

  // If we need to support some basic mobile event binding this
  // is a good little function to get you started.
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