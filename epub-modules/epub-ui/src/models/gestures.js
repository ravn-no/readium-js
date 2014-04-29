define(['jquery','jquery_hammer','hammer'], function($,jqueryHammer,Hammer){

    var GesturesHandler = function(reader, $touchableArea){

        _.extend(this, Backbone.Events);

        var self = this;
        //these events are not fired by default and have to be attached to the reader by
        //gesture interpreting library - reference implementation in readium.js epub-ui module

        GesturesHandler.Events = {
            TOUCH_SWIPELEFT: "swipeleft",
            TOUCH_SWIPERIGHT: "swiperight",
            TOUCH_TAP: "tap",
            TOUCH_DOUBLETAP: "doubletap",
            TOUCH_HOLD: "hold"
        };

        var hammerOptions = {stop_browser_behavior: false, prevent_mouseevents: true};

        reader.on(ReadiumSDK.Events.CONTENT_DOCUMENT_LOADED, function (iframe, s) {
            //set hammer's document root
            Hammer.DOCUMENT = iframe[0].contentDocument.documentElement;
            //hammer's internal touch events need to be redefined? (doesn't work without)
            Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_MOVE, Hammer.detection.detect);
            Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_END, Hammer.detection.detect);
            //delete Hammer.defaults.stop_browser_behavior.userSelect;
            //set up the hammer gesture events

            //swiping handlers
            Hammer(Hammer.DOCUMENT, hammerOptions).on("swipeleft.Hammer", function (e) {
                self.trigger(GesturesHandler.Events.TOUCH_SWIPELEFT, e);
            });

            Hammer(Hammer.DOCUMENT, hammerOptions).on("swiperight.Hammer", function (e) {
                self.trigger(GesturesHandler.Events.TOUCH_SWIPERIGHT, e);
            });

            //touch handlers
            Hammer(Hammer.DOCUMENT, hammerOptions).on("tap.Hammer", function (e) {
                self.trigger(GesturesHandler.Events.TOUCH_TAP, e);
            });

            Hammer(Hammer.DOCUMENT, hammerOptions).on("doubletap.Hammer", function (e) {
                self.trigger(GesturesHandler.Events.TOUCH_DOUBLETAP, e);
            });

            Hammer(Hammer.DOCUMENT, hammerOptions).on("hold.Hammer", function (e) {
                self.trigger(GesturesHandler.Events.TOUCH_HOLD, e);
            });

            //remove stupid ipad safari elastic scrolling
            //TODO: test this with reader ScrollView and FixedView
            $(Hammer.DOCUMENT).on(
                'touchmove.Hammer',
                function (e) {
                    //hack: check if we are not dealing with a scroll view
                    var viewType = reader.viewType();
                    if (   viewType !== ReadiumSDK.Views.ReaderView.VIEW_TYPE_SCROLLED_DOC
                        && viewType !== ReadiumSDK.Views.ReaderView.VIEW_TYPE_SCROLLED_CONTINUOUS ) {

                        e.preventDefault();
                    }
                }
            );
        });

        //swiping handlers
        $touchableArea.hammer(hammerOptions).on("swipeleft.Hammer", function (e) {
            self.trigger(GesturesHandler.Events.TOUCH_SWIPELEFT, e);

        });

        $touchableArea.hammer(hammerOptions).on("swiperight.Hammer", function (e) {
            self.trigger(GesturesHandler.Events.TOUCH_SWIPERIGHT, e);

        });

        //touch handlers
        $touchableArea.hammer(hammerOptions).on("tap.Hammer", function (e) {
            self.trigger(GesturesHandler.Events.TOUCH_TAP, e);
        });

        $touchableArea.hammer(hammerOptions).on("doubletap.Hammer", function (e) {
            self.trigger(GesturesHandler.Events.TOUCH_DOUBLETAP, e);
        });

        $touchableArea.hammer(hammerOptions).on("hold.Hammer", function (e) {
            self.trigger(GesturesHandler.Events.TOUCH_HOLD, e);
        });

        //remove stupid ipad safari elastic scrolling (improves UX for gestures)
        //TODO: test this with reader ScrollView and FixedView
        $touchableArea.on(
            'touchmove.Hammer',
            function(e) {
                e.preventDefault();
            }
        );
    };


    return GesturesHandler;
});

