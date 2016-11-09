(function($) {

    window.JUKSY = {
        apiUri: 'https://www.juksy.com/api'
    };

    var init = function() {
        // android version under 4.4 FB APP can't use css fadeout
        function getAndroidVersion(ua) {
            ua = (ua || navigator.userAgent).toLowerCase();
            var match = ua.match(/android\s([0-9\.]*)/);
            return match ? match[1] : false;
        };
        var $android = parseFloat(getAndroidVersion());
        if ($android < 4.4) {
            alert('Android 4.3 以下手機，請使用Chrome瀏覽器閱讀');
        }

        // Configure webfont
        window.WebFontConfig = {
            google: {
                families: ['Roboto+Condensed:400,400italic,700,700italic:latin']
            }
        };

        // Init Facebook
        window.fbAsyncInit = function() {
            FB.init({
                appId: '608477045879026',
                cookie: true, // enable cookies to allow the server to access 
                // the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.6' // use version 2.6
            });
        };
    }

    // nav_01
    var nav_01 = function() {
        /*
        -------------------------------------
        open and close menu // didn't use toggleClass because FB APP can't work for android4.2
        -------------------------------------
        */
        var $window = $(window),
            $nav = $('.nav_01'),
            $body = $('body'),
            $openBtn = $nav.find('.mIcon .open'),
            $closeBtn = $nav.find('.mIcon .close'),
            $menuOpen = 'menuOpen',
            $noscroll = 'noscroll',
            lastScrollTop = 0,
            $scrollout = 'scrollout',
            $menuOut = true,
            $menuli = $nav.find('ul.menu >li'),
            $menuTimer;
        $openBtn.click(function() {
            $nav.addClass($menuOpen);
            $body.addClass($noscroll);
        });
        $closeBtn.click(function() {
            $nav.removeClass($menuOpen);
            $body.removeClass($noscroll);
        });
        /*
        -------------------------------------
        FB share, Line share
        -------------------------------------
        */
        $nav.find("ul.share li.fb, ul.share .title").click(function(e) {
            e.preventDefault();
            FB.ui({
                method: 'share',
                href: document.URL
            }, function(response) {});
        });
        $nav.find("ul.share li.line a.btn").attr("href", "http://line.naver.jp/R/msg/text/?" + document.title + "%0A" + document.URL);
        /*
        -------------------------------------
        nav move out while scrolling
        -------------------------------------
        */
        function navmove() {
            var st = $(this).scrollTop(),
                outTimer;
            clearTimeout(outTimer);
            if (st > lastScrollTop && $menuOut == true) {
                // downscroll code
                $nav.stop(true, true).addClass($scrollout);
                $menuOut = false;
            } else if (st == 0) {
                // top
                scrollOut();
            } else if (st < lastScrollTop && $menuOut == false) {
                // upscroll code
                outTimer = setTimeout(scrollOut, 10000);
            }
            lastScrollTop = st;

            function scrollOut() {
                clearTimeout(outTimer);
                $nav.stop(true, true).removeClass($scrollout);
                $menuOut = true;
            }
        }
        $window.scroll($.throttle(500, navmove));
        /*
        -------------------------------------
        hover menu li animation
        -------------------------------------
        */
        $menuli.hover(function() {
            clearTimeout($menuTimer);
            $menuli.not(this).stop(true, true).animate({ opacity: 0.5 }, 500);
            $(this).stop(true, true).animate({ opacity: 1 }, 500);
        }, function() {
            $menuTimer = setTimeout(menuHover, 300);
        });

        function menuHover() {
            $menuli.stop(true, true).animate({ opacity: 1 }, 500);
        }
        /*
        -------------------------------------
        page scroll
        -------------------------------------
        */
        $nav.find('ul.menu >li').not('notli').click(goPosition);
        $nav.find('ul.submenu >li').click(goPosition);

        function goPosition() {
            var nowIndex = $(this).index(),
                $submenu = $(this).parent('ul.submenu').length,
                scrollPosition;
            if ($submenu == 0 && nowIndex == 4) {
                return;
            } else if ($submenu > 0) { nowIndex += 4; }
            scrollPosition = $('[data-menu="true"]').eq(nowIndex).offset().top;
            $closeBtn.trigger('click');
            $('html,body').animate({ scrollTop: scrollPosition }, 1000);
        }
    }

    // header_03
    var header_03 = function() {
        /*---------------------
        輪播 Slider
        -----------------------*/
        var jssor_1_options = {
            $AutoPlay: true,
            $SlideDuration: 800,
            $Idle: 2500,
            $SlideEasing: $Jease$.$OutQuint,
        };

        var jssor_1_slider = new $JssorSlider$("header_03_banner", jssor_1_options);

        //responsive code begin
        //you can remove responsive code if you don't want the slider scales while window resizing
        function ScaleSlider() {
            var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
            if (refSize) {
                jssor_1_slider.$ScaleWidth(refSize);
            } else {
                window.setTimeout(ScaleSlider, 30);
            }
        }
        ScaleSlider();
        $(window).bind("load", ScaleSlider);
        $(window).bind("resize", ScaleSlider);
        $(window).bind("orientationchange", ScaleSlider);
        //responsive code end

        /*---------------------
        文字三角形凹槽高度
        -----------------------*/
        var $headerWrap = $('.header_03 .headerWrap'),
            $visualBg = $headerWrap.find('.visualBg'),
            $txtBg = $headerWrap.find('.detail .detailWrap .txtBg'),
            $txtWrap = $headerWrap.find('.detail .detailWrap');
        $txtBg.height($txtWrap.height());
        $headerWrap.height($txtBg.height() + $visualBg.height() - 31);
    }

    // layout_04
    var layout_04 = function() {
        // Slider
        var $layout04 = $('.layout_04');
        $layout04.each(function() {
            var $this = $(this),
                $slideW = $this.find('ul.slides li:first').width(),
                $gap = 20,
                $number = $this.find('ul.slides li').length,
                $windowW = $(window).width(),
                $setWidth = $windowW < 1024 ? (($slideW + $gap) * $number) : (($slideW + $gap) * $number - $gap),
                $container = $this.find('.slidesWrap'),
                containW = $container.width();
            // Set slides width
            $this.find('ul.slides').width($setWidth);
            // Mobile and tablet move to second slide
            if ($windowW < 1024) {
                var $center = $slideW - (($windowW - $slideW) / 2 - $gap);
                $this.find('.slidesWrap').scrollLeft($center);
            }
        });
    }

    // layout_05
    var layout_05 = function() {
        // Count img height
        var $layout05 = $('.layout_05');
        $layout05.each(function() {
            var $img = $(this).find('ul.article li a.img');
            $img.each(function() {
                $(this).height($(this).width());
            });
        });
    }

    // gallery_02
    var gallery_02 = function() {
        var $gallery02 = $('.gallery_02'),
            $windowW = $(window).width();
        $gallery02.each(function() {
            var $iframe = $gallery02.find('.photo iframe'),
                mUrl = $iframe.data('msrc'),
                pcUrl = $iframe.data('pcsrc');
            if($windowW<1024) {
                $iframe.easyframe({
                    url: mUrl
                },function(){
                    iFrameResize();
                });
            }
            else {
                $iframe.easyframe({
                    url: pcUrl
                },function(){
                    iFrameResize();
                });
            }
        });
    }

    // fixedBtn
    var fixedBtn_01 = function() {
        // Back to top
        $('ul.fixedBtn_01 li.top').click(function() {
            $('html,body').animate({ scrollTop: 0 }, 1000);
        });
        // Open share menu
        $('ul.fixedBtn_01 li.share').mousedown(function(){
            $('.fixedBtnCover_01').addClass('show');
        });
        // Close share menu
        $('.fixedBtnCover_01 .coverWrap .backCover, .fixedBtnCover_01 .item .arrow').bind('mousedown touchstart', function () {
            $('.fixedBtnCover_01').removeClass('show');
        });
        // Share with LINE
        $('.fixedBtnCover_01 ul.share li.line .material_btn').click(function(e) {
            e.preventDefault();
            window.location.href = 'http://line.naver.jp/R/msg/text/?' + document.title + '%0A' + document.URL;
        });
        // Share with FB
        $('.fixedBtnCover_01 ul.share li.fb .material_btn').click(function(e) {
            e.preventDefault();
            FB.ui({
                method: 'share',
                href: document.URL
            }, function(response) {});
        });
        // Copy link
        var clipboard = new Clipboard('.fixedBtnCover_01 ul.share li.copy .material_btn', {
            text: function(trigger) {
                return document.URL;
            }
        });
        // Copy tip
        clipboard.on('success', function(e) {
            var tipTime;
            clearTimeout(tipTime);
            $('.fixedBtnCover_01 .coverWrap .copytip').addClass('show');
            tipTime = setTimeout(hide, 2000);
            function hide() {
                 $('.fixedBtnCover_01 .coverWrap .copytip').removeClass('show');
            }
        });
        /*
        -------------------------------------
        nav move out while scrolling
        -------------------------------------
        */
        var $window = $(window);

        function fixedBtnShow() {
            var st = $(this).scrollTop(),
                ft = $('#footer').offset().top - $window.height() - 300,
                $fixedBtn = $('.fixedBtn_01');
            if (st > ft) {
                $fixedBtn.addClass('show');
            } else if (st == 0) {
                $fixedBtn.removeClass('show');
            }
        }
        $window.scroll($.throttle(500, fixedBtnShow));
    }

    // render content first
    init();
    nav_01();
    header_03();
    layout_04();
    layout_05();
    gallery_02();
    fixedBtn_01();

    // plugin fadeOut
    $(function() {
        $(document).on('fadeOut', function() {
            var $window = $(window),
                target = $('.fadeOut');

            function addAction() {
                var length = target.length;
                for (var i = 0; i < length; i++) {
                    if (target.eq(i).hasClass('action')) continue;
                    var in_position = target.eq(i).offset().top + 100;
                    var window_bottom_position = $window.scrollTop() + $window.height();
                    if (in_position < window_bottom_position) {
                        target.eq(i).addClass('action');
                    }
                }
            }
            addAction();
            $window.scroll($.throttle(250, addAction));
        });
        $(document).trigger('fadeOut');
    });

    // plugin img_lazyLoad
    $(function() {
        $(document).on('img_lazyLoad', function() {
            var $window = $(window),
                target = $('.imgLoading'),
                complete = 'complete';

            function addComplete() {
                var length = target.length;
                for (var i = 0; i < length; i++) {
                    if (target.eq(i).hasClass(complete)) continue;
                    var in_position = target.eq(i).offset().top + 100;
                    var window_bottom_position = $window.scrollTop() + $window.height() + 150;
                    if (in_position < window_bottom_position) {
                        var targeturl = target.eq(i).data('imgload');
                        target.eq(i).css('background-image', 'url(' + targeturl + ')');
                        target.eq(i).addClass(complete);
                    }
                }
            }
            addComplete();
            $window.scroll($.throttle(250, addComplete));
        });
        $(document).trigger('img_lazyLoad');
    });

    // plugin dotdotdot
    $(function() {
        $(document).on('dotdotdot', function() {
            $('[data-dotdotdot="true"]').dotdotdot({
                wrap: 'letter'
            });
        });
        $(document).trigger('dotdotdot');
    });

    // window resizing
    $(function() {
        var resizeId;
        $(window).resize(function() {
            clearTimeout(resizeId);
            resizeId = setTimeout(doneResizing, 500);
        });

        function doneResizing() {
            layout_04();
            layout_05();
            $(document).trigger('dotdotdot');
        }
    });

})(jQuery);