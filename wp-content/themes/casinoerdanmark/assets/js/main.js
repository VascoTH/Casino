
jQuery(document).ready(function ($) {
  jQuery.event.special.touchstart = {
    setup: function (_, ns, handle) {
      this.addEventListener("touchstart", handle, {
        passive: !ns.includes("noPreventDefault"),
      });
    },
  };
  jQuery.event.special.touchmove = {
    setup: function (_, ns, handle) {
      this.addEventListener("touchmove", handle, {
        passive: !ns.includes("noPreventDefault"),
      });
    },
  };
  jQuery.event.special.wheel = {
    setup: function (_, ns, handle) {
      this.addEventListener("wheel", handle, { passive: true });
    },
  };
  jQuery.event.special.mousewheel = {
    setup: function (_, ns, handle) {
      this.addEventListener("mousewheel", handle, { passive: true });
    },
  };

  var iframe = $("#jsVideo");
  if (iframe.length) {
    var player = new Vimeo.Player(iframe);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var autoplayvar = urlParams.get("autoplay");
    if (autoplayvar != "yes") {
      player.pause();
      $(".section-hero").removeClass("video-active");
    }
    $("a.playbtn-hero").on("click", function (e) {
      e.preventDefault();
      player.play();
      $(".section-hero").addClass("video-active");
    });
    $(".section-hero").mouseenter(function (e) {
      e.preventDefault();
      // player.setVolume(0);
      player.play();
      $(this).addClass("video-active");
    });
    $(".section-hero").mouseleave(function (e) {
      e.preventDefault();
      // player.setVolume(0);
      player.pause();
      $(this).removeClass("video-active");
    });
  }

  //Mm-menu

  //placeholders for IE
  $("input").placeholder();

  $sliders = [
    ".jsCasinoSlider",
    ".jsGamesSlider",
    ".jsReviewsSlider",
    ".jsPostsSlider",
  ];

  $sliders.forEach((element) =>
    $(element).each(function () {
      var $slider = $(this);
      var options = {
        items: 5,
        nav: true,
        dots: false,
        margin: 5,
        navText: [
          "<div class='slider-arrow slider-arrow__left'></div>",
          "<div class='slider-arrow slider-arrow__right'></div>",
        ],
        responsive: {
          0: {
            items: 1,
            stagePadding: 20,
            nav: false,
          },
          420: {
            items: 1,
            stagePadding: 50,
            nav: false,
          },
          576: {
            items: 2,
          },
          900: {
            items: 3,
          },
          1400: {
            items: 4,
          },
          1500: {
            items: 5,
          },
        },
      };
      $slider.owlCarousel(options);
    })
  );
  $(".jsSingleImageSlider").each(function () {
    var $slider = $(this);
    var options = {
      items: 1,
    };
    $slider.owlCarousel(options);
  });

  $(".jsButtonMore").each(function (e) {
    $buttonMore = $(this);
    $buttonMore.on("click", function (e) {
      e.preventDefault();
      $parent = $(this).closest(".bonusser__content");
      $parent.toggleClass("active");
      // $paragraph = $(this).find("p");
      if ($(this).text() == "Read more") {
        $(this).text("Read less");
      } else {
        $(this).text("Read more");
      }
    });
  });

  //review category change

  $(".jsReviewCategory").each(function () {
    var $btn = $(this);
    var $parent_ul = $btn.closest(".sorting-items");
    var $table = $btn.parent().parent().parent().parent().find(".table-s1");
    var version = $table.data("version");
    var loader = $btn.parent().parent().parent().parent().find("#jsLoader");
    var logo_aff_link = $parent_ul.data("logo_aff_link");
    var num = $parent_ul.data("num");
    var css_class = $parent_ul.data("css_class");
    var sort = $parent_ul.data("sort");

    $btn.on("click", function (e) {
      e.preventDefault();
      $table.empty();
      $parent_ul.find("li").removeClass("active");
      $btn.closest("li").addClass("active");

      $.ajax({
        type: "post",
        dataType: "json",
        url: ajax_var.ajaxurl,
        data: {
          action: "review_table_category_change",
          category: $btn.text(),
          version: version,
          logo_aff_link: logo_aff_link,
          num: num,
          css_class: css_class,
          sort: sort,
        },
        beforeSend: function () {
          loader.show();
        },
        success: function (response) {
          setTimeout(function () {
            $table.append(response.html);
          }, 600);
        },
        error: function (err) {
          console.log(err);
        },
        complete: function (err) {
          setTimeout(function () {
            loader.hide();
          }, 500);
        },
      });
    });
  });

  //Table Content
  $("#jsTableContent").each(function () {
    var $table = $(this);
    var $tableul = $table.find(".tablecontent__content ul");
    var $headings = $table.data("heads");
    $headings ? $headings : "h2,h3";
    $($headings).each(function () {
      var title = $(this).text();
      var slug = convertToSlug(title);
      var tagName = $(this).prop("tagName");
      var className = tagName == "H2" ? "tablecontent__h2" : "tablecontent__h3";

      if (title) {
        $(this).attr("id", slug);
        $tableul.append(
          `<li class="${className}"><a href="#${slug}" class="jsHeadLink">${$(
            this
          ).text()}</a></li>`
        );
      }
    });
  });
  $("#jsTableContentToggler").each(function () {
    var $toggler = $(this);
    var $parent = $toggler.parent();
    $toggler.on("click", function (e) {
      e.preventDefault();
      $parent.toggleClass("hide");
    });
  });

  $(".jsHeadLink").each(function () {
    $link = $(this);
    $link.on("click", function (e) {
      e.preventDefault();
      var $href = $(this).attr("href");
      $([document.documentElement, document.body]).animate(
        {
          scrollTop: $($href).offset().top - 50,
        },
        2000
      );
    });
  });

  function convertToSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  //if hash exists then auto scroll
  if (window.location.hash && $("#jsTableContent").length) {
    var $hash = window.location.hash;

    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $($hash).offset().top - 50,
      },
      2000
    );
  }

  /**
   * Custom Pagination brugeranmeldelser
   */
  $(".jsCustomPagination").each(function () {
    var $pagelink = $(this);
    var $offset = $pagelink.data("offset");
    var $type = $pagelink.data("type");
    var $wrapper = $pagelink.parent().parent().find(".addreviewbox-wrapper");
    var loader = $pagelink.parent().parent().find("#jsLoader");
    $pagelink.on("click", function (e) {
      e.preventDefault();
      $pagenation_btn = $(this);
      $wrapper.empty();
      $pagelink.parent().children(".jsCustomPagination").removeClass("current");
      $pagelink.addClass("current");

      $.ajax({
        type: "post",
        dataType: "json",
        url: ajax_var.ajaxurl,
        data: {
          action: "psdtheme_custom_pagination",
          offset: $offset,
          type: $type,
        },
        beforeSend: function () {
          loader.show();
          $([document.documentElement, document.body]).animate(
            {
              scrollTop: loader.offset().top - 150,
            },
            100
          );
        },
        success: function (response) {
          setTimeout(function () {
            $pagenation_btn.parent().parent().find(".jsSubmitComment").remove();
            $pagenation_btn
              .parent()
              .parent()
              .find(".addreviewbox__bottom-left .rating-stars img")
              .remove();
            $wrapper.append(response.html);
            submit_comment(
              `.col:nth-of-type(${
                $pagenation_btn.parent().parent().index() + 1
              })`
            );
            star_rating();
          }, 600);
        },
        error: function (err) {
          console.log(err);
        },
        complete: function (err) {
          setTimeout(function () {
            loader.hide();
          }, 500);
        },
      });
    });
  });

  /**
   * Submit Comment
   */
  submit_comment();
  function submit_comment(column = "") {
    $(`${column} .jsSubmitComment`).each(function () {
      var $btn = $(this);
      var $pid = $btn.data("pid");

      $btn.on("click", function (e) {
        e.preventDefault();
        $clickedbtn = $(this);
        var $comment = $btn
          .parent()
          .parent()
          .parent()
          .find(".addreviewbox__middle textarea");
        var $rating = $(this).data("rating");

        $.ajax({
          type: "post",
          dataType: "json",
          url: ajax_var.ajaxurl,
          data: {
            action: "psdtheme_custom_comments",
            comment: $comment.val(),
            pid: $pid,
            rating: $rating,
          },
          success: function (response) {
            if (response.message != "success") {
              setTimeout(function () {
                $clickedbtn.css("border-color", "#d52828");
              }, 200);
              setTimeout(function () {
                $clickedbtn.css("border-color", "#929292");
              }, 400);
              setTimeout(function () {
                $clickedbtn.css("border-color", "#d52828");
              }, 600);
              if (
                response.message ==
                "Please give your review a star-valuation and a short description of 50 characters at least."
              ) {
                $comment.val(response.message);
                $comment.css("color", "#d52828");
                setTimeout(function () {
                  $comment.css("color", "#929292");
                }, 200);
                setTimeout(function () {
                  $comment.css("color", "#d52828");
                }, 400);
                setTimeout(function () {
                  $comment.css("color", "#929292");
                }, 600);
              }
              if (
                response.message ==
                "Please login before you can submit your review"
              ) {
                $comment.val(response.message);
                $comment.css("color", "#d52828");
                setTimeout(function () {
                  $comment.css("color", "#929292");
                }, 200);
                setTimeout(function () {
                  $comment.css("color", "#d52828");
                }, 400);
                setTimeout(function () {
                  $comment.css("color", "#929292");
                }, 600);
              }
              if (
                response.message ==
                "you can not review a casino|slot more than 2 times"
              ) {
                $comment.val("You can only create one review per game/ casino");
                $comment.css("color", "#d52828");
                setTimeout(function () {
                  $comment.css("color", "#929292");
                }, 200);
                setTimeout(function () {
                  $comment.css("color", "#d52828");
                }, 400);
                setTimeout(function () {
                  $comment.css("color", "#929292");
                }, 600);
              }
            } else {
              alert("Thanks for Your review on Betkingcompare");
              setTimeout(function () {
                $clickedbtn.css("border-color", "#27ff20");
              }, 200);
              setTimeout(function () {
                $clickedbtn.css("border-color", "#929292");
              }, 400);
              setTimeout(function () {
                $clickedbtn.css("border-color", "#27ff20");
              }, 600);
            }
          },
          error: function (err) {
            console.log(err);
          },
        });
      });
    });
  }

  /**
   * Hover Star
   */

  star_rating();
  function star_rating() {
    $(`.addreviewbox .rating-stars img`).mouseenter(function (e) {
      var parent = $(e.target).parent();
      var $yellow_stars = $(e.target).index() + 1;
      var $gray_stars = 5 - $yellow_stars;
      for (var i = 1; i <= $yellow_stars; i++) {
        parent
          .children(`img:nth-of-type(${i})`)
          .attr("src", `${siteurl.siteurl}/assets/images/svg/star.svg`);
      }
      if ($gray_stars != 0) {
        for (var i = $yellow_stars + 1; i <= 5; i++) {
          parent
            .children(`img:nth-of-type(${i})`)
            .attr("src", `${siteurl.siteurl}/assets/images/svg/star-gray.svg`);
        }
      }
    });

    $(`.addreviewbox .rating-stars img`).mouseleave(function (e) {
      var parent = $(e.target).parent();
      if (parent.hasClass("voted")) {
        var $yellow_stars = Number(
          $(e.target)
            .parent()
            .parent()
            .parent()
            .find(".addreviewbox__bottom-right a")
            .attr("data-rating")
        );
        var $gray_stars = 5 - $yellow_stars;
        for (var i = 1; i <= $yellow_stars; i++) {
          parent
            .children(`img:nth-of-type(${i})`)
            .attr("src", `${siteurl.siteurl}/assets/images/svg/star.svg`);
        }

        if ($gray_stars > 0) {
          for (var i = $yellow_stars + 1; i <= 5; i++) {
            parent
              .children(`img:nth-of-type(${i})`)
              .attr(
                "src",
                `${siteurl.siteurl}/assets/images/svg/star-gray.svg`
              );
          }
        }
      } else {
        for (var i = 1; i <= 5; i++) {
          parent
            .children(`img:nth-of-type(${i})`)
            .attr("src", `${siteurl.siteurl}/assets/images/svg/star-gray.svg`);
        }
      }
    });

    $(`.addreviewbox .rating-stars img`).click(function (e) {
      e.preventDefault();
      var parent = $(e.target).parent();
      parent.hasClass("voted") ? "" : parent.addClass("voted");
      $(e.target)
        .parent()
        .parent()
        .parent()
        .find(".addreviewbox__bottom-right a")
        .attr("data-rating", $(this).index() + 1);
    });
  }

  /**
   * Custom Pagination brugeranmeldelser
   */
  $(".jsLike").each(function () {
    var $likebtn = $(this);

    $likebtn.on("click", function (e) {
      e.preventDefault();
      var $pid = $likebtn.data("pid");
      var $counter = $likebtn.find("strong");

      $.ajax({
        type: "post",
        dataType: "json",
        url: ajax_var.ajaxurl,
        data: {
          action: "psdtheme_custom_likes",
          pid: $pid,
        },

        success: function (response) {
          if (response.message == "success") {
            $counter.html(response.total_likes);
            $(".jsLike").each(function () {
              if ($(this).data("pid") == $pid) {
                if ($(this).find("strong").length) {
                  $(this).find("strong").html(response.total_likes);
                }
                if ($(this).find("span").length) {
                  $(this).find("span").html(response.total_likes);
                }
              }
            });
          }
        },
        error: function (err) {
          console.log(err);
        },
      });
    });
  });

  /**
   * FAQ row expand
   */
  $(".jsFAQHead").on("click", function (e) {
    e.preventDefault();

    $(this).find(".jsFAQTitle").toggleClass("is_active");
    $(this)
      .parent()
      .closest(".jsFAQRow")
      .find(".jsFAQClose")
      .toggleClass("is_active");
    $(this).parent().closest(".jsFAQRow").find(".jsFAQContent").slideToggle();
  });

  if (window.location.href.includes("register")) {
    $('form[name="register"]')[0].encoding = "multipart/form-data";
    $(".acf-user-register-fields").remove();

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $("#profile-image-preview").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    }

    $("#profile_image").change(function () {
      readURL(this);
    });
  }

  // Scroll to top function

  new Headroom(document.querySelector(".headroom")).init();

  $window = $(window);

  $window.scroll(function () {
    handleScrollBtn();
  });

  function handleScrollBtn() {
    setTimeout(function () {
      if ($(".headroom").hasClass("headroom--top")) {
        $(".scroll-top").removeClass("active");
      } else {
        $(".scroll-top").addClass("active");
      }
    }, 800);
  }

  $(".scroll-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  handleScrollBtn();

  //cookies functions
  function setCookie(cName, cValue, expTime) {
    var date = new Date();
    var time = date.getTime();
    var expireTime = time + expTime * 36000;
    date.setTime(expireTime);
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }
  function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }
  //pop-up
  //Close PopUp
  $(".jsClosePopUp").each(function () {
    var $toggler = $(this);
    var $popup = $toggler.parents().closest(".jsPopUp");

    $toggler.on("click", function (e) {
      e.preventDefault();
      $popup.toggleClass("active");
    });
  });
  $(".jsPopUp").each(function () {
    var $popup = $(this);
    var $wrapper = $(this).find(".popup-outer-wrapper");
    $popup.on("click", function (e) {
      e.preventDefault();
      $popup.toggleClass("active");
    });
    $wrapper.on("click", function (e) {
      e.stopPropagation();
    });
  });

  if (getCookie("user-popup-show") != "yes") {
    setTimeout(function () {
      var $popup = $(".jsPopUp");
      var expireTime = $popup.data("exp");
      if ($popup.length > 0) {
        setCookie("user-popup-show", "yes", expireTime);
        $popup.addClass("active");
      }
    }, 3000);
  }

  // Search
  $(".jsSearch").on("click", function (e) {
    $(".search-form-wrapper").addClass("open");
    $(".jsSearchInput").focus();
    $("#page-wrapper").addClass("overflow");
  });
  $(".jsCloseSearch").on("click", function (e) {
    closeSearchPop();
  });
  function closeSearchPop() {
    $(".search-form-wrapper").removeClass("open");
    $("#page-wrapper").removeClass("overflow");
    $(".jsSearchInput").val("");
  }

  $(".search-form-wrapper").on("click", function (e) {
    if ($(e.target).hasClass("search-form-wrapper")) {
      closeSearchPop();
    }
  });
  // Menu toggle Menu

  $('#jsHeaderToggler, .jsCloseMobile').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('overflow');
    $('#mobile-menu').toggleClass('active');
  });
  // Menu toggle sub menu
  $('#mobile-menu .mobmenu > li > .sub-menu > li:has(.sub-menu) > a').each(function() {
    $(this).append($('<img/>', {
      class: 'jsToggleMenu toggleMenu',
      src: siteurl.siteurl + '/assets//images/svg/arrow-down-yellow.svg'
    }).on('click', function(e) {
      e.preventDefault(); // $(this) default action when clicking on the img element
      $(this).closest('a').toggleClass('active');
      $(this).closest('li').find('.sub-menu').toggle();
    }));
  });

  // or just with selector string
  const ps = new PerfectScrollbar('#mobile-menu');

  //Ajax search autocomplete

  if ($(".jsSearchInput").length > 0) {
    $.ajax({
      type: "post",
      dataType: "jsonp",
      url: ajax_var.ajaxurl,
      data: {
        action: "poka_autocomplete_suggestions",
      },
      success: function (result) {
        var inputSearchEl = $(".jsSearchInput");
        inputSearchEl
          .autocomplete({
            minLength: 1,
            appendTo: inputSearchEl.parents(".jsSearchForm"),
            source: function (request, response) {
              var results = $.ui.autocomplete.filter(result, request.term);
              response(results.slice(0, 3));
            },
          })
          .autocomplete("instance")._renderItem = function (ul, item) {
          return $("<li class='custom-li-el'>")
            .append("<a href='" + item.link + "'>" + item.label + "</a>")
            .appendTo(ul);
        };
      },
    });
  }
  // Affiliate sticky CTA
  if ($(".JSStickyCTA").length > 0) {
    $(".scroll-top").addClass("cta-active");

    $(".JSStickyCTA").on("click", function () {
      $(".section-sticky-cta").toggleClass("hide");
      $(".JSStickyCTA img").toggleClass("hide");
      $(".scroll-top").toggleClass("cta-active");
      $(".scroll-top").toggleClass("cta-close");
    });
  }

  // Ajax Get 3 more posts on blog list v2 shortcode

  if ($(".js-get-more-posts").length > 0) {
    var page = 2;
    $(".js-get-more-posts").on("click", function () {
      $.ajax({
        type: "post",
        dataType: "json",
        url: ajax_var.ajaxurl,
        data: {
          action: "get_more_blog_posts",
          page: page,
        },
        beforeSend: function () {
          /*loader.show();*/
        },
        success: function (response) {
          $(".blogpost_listsv2__recent-wrapper").append(response.html);
          page = parseInt(response.page) + 1;
          if (response.last_page) {
            $(".js-get-more-posts").css("display", "none");
          }
        },
        error: function (err) {
          console.log(err);
        },
        complete: function (err) {},
      });
    });
  }
  // END OF Ajax Get 3 more posts on blog list v2 shortcode
});
