var net = {};
(function (net, $) {

     "use strict";


     var PromoDemo =       function () { },
          PRODUCT_LIST =    "#productList",
          CLIENT_LIST =     "#clientList",
          PRODUCT_SAVE =    "#productSave",
          NEW_PRODUCT_NAME = "#newProductName",
          NEW_NAME_LABEL =  "#newProductNameLabel",
          PRODUCT_ERROR =   "#emptyNameLabel",
          PRODUCT_MODAL =   "#newProductModal",
          PRODUCT_SELECT =  "#productSelection",
          START_CALENDAR_ICON = "#startCalendarIcon",
          END_CALENDAR_ICON = "#endCalendarIcon",
          START_CALENDAR =  "#promoStartDate",
          END_CALENDAR =    "#promoEndDate",
          START_HOUR =      "#startHour",
          END_HOUR =        "#endHour",
          ENTRY_AREA =      "#workArea",
          PROMOTION_NAME =  "#promotionName",
          SELECTED_CLIENT = "#selectedClient",
          SAVE =            "#saveWork",
          CANCEL =          "#cancelWork",
          DAY_SELECTION =   "#daySelection",
          RUN_CANCEL =      "#runTimeCancel",
          RUN_SAVE =        "#runTimeSave",
          RUN_TIMES =       "#promoTimes",
          HOURS_MODAL =     "#hoursModal",
          MEDIA_AREA =      "#mediaArea",
          MEDIA_LIST =      "#mediaList",
          VIDEO_BOX =       "#videoHolder",
          UNDO_PRODUCT =    "#undoProduct",
          HOUR_ERROR =      "#hourError",
          DAY_ERROR =       "#dayError",
          NEW_MEDIA =       "#newMediaLink",
          NEW_MEDIA_ERROR = "#emptyMediaLabel",
          MEDIA_SAVE =      "#mediaSave",
          MEDIA_MODAL =     "#newMediaModal",
          YOUTUBE_EMBED =   '<iframe width="320" height="240" src="{0}?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>',
          data =            undefined,
          activeClient =    undefined,
          activeProduct =   undefined,
          promoTimes =      [];

     function saveNewMedia() {
          if ($(NEW_MEDIA)[0].value === "" ) {
               $(NEW_MEDIA_ERROR).show();
          } else {
               var newVideo = YOUTUBE_EMBED;
               newVideo = newVideo.replace("{0}", $(NEW_MEDIA)[0].value);

               $(MEDIA_MODAL).modal('hide');
               $(NEW_MEDIA_ERROR).hide();

               $(VIDEO_BOX).html(newVideo);
               $(VIDEO_BOX).fadeIn();
          }
     }

     function populateMediaList() {
          if (activeProduct) {
               // load the media drop down
               $(MEDIA_LIST).html("");
               $(activeProduct.media).each(function(index, value) {
                    $(MEDIA_LIST).append("<li><a media-id='" + index + "' href='#'>" + value.title + "</a></li>");
               });
               $(MEDIA_LIST + " a").on("click", function(event) {
                    // load up the selected video
                    $(VIDEO_BOX).html(activeProduct.media[$(event.target).attr("media-id")].link); 
                    $(VIDEO_BOX).fadeIn();
               });
          } 
          // if a new Product, there won't be any media other than ones added.
          $(MEDIA_LIST).append("<li><a href='#newMediaModal' data-toggle='modal' >New Media</a></li>");

          // fade in the media section once the drop down has been populated. 
          $(MEDIA_AREA).fadeIn();
     }

     function populateProductList(promoObj) {
          if (activeClient) {
               // First clear out anything in there currently
               $(PRODUCT_LIST).html("");

               //repopulate the list for whatever the active client is.
               $(activeClient.products).each(function(index, value) {
                    if ((value) && (value.name)) {
                         $(PRODUCT_LIST).append("<li><a product-id='" + index + "' href='#'>" + value.name + "</a></li>");
                    }
               });
               $(PRODUCT_LIST + " a").on("click", function(event) {
                    promoObj.setActiveProduct($(event.target).attr("product-id"));
                    $(PRODUCT_SELECT)[0].innerHTML = activeProduct.name;
                    $(PRODUCT_LIST).parent().fadeOut(400, function() {
                         $(PRODUCT_SELECT).fadeIn();
                         $(UNDO_PRODUCT).fadeIn();
                    });
                    populateMediaList();
               });
               //add an entry to create a new product
               $(PRODUCT_LIST).append("<li><a href='#newProductModal' data-toggle='modal' >New Product</a></li>");
          }
     }

     function setupClientList(promoObj) {
          if (data) {
               $(data).each(function(index, value) {
                    if ((value) && (value.name)) {
                         $(CLIENT_LIST).append("<li><a client-id='" + index + "' href='#'>" + value.name + "</a></li>");
                    }
               });
               $(CLIENT_LIST + ":last-child").on("click", function(event) {
                    promoObj.setActiveClient($(event.target).attr("client-id"));
                    $(ENTRY_AREA).fadeIn();
                    $(PROMOTION_NAME).focus();
                    $(CLIENT_LIST).parent().parent().fadeOut(400, function() {
                         $(SELECTED_CLIENT)[0].innerHTML = activeClient.name;
                         $(SELECTED_CLIENT).fadeIn();
                    });
               });
          }
     }

     function setupModalEvents() {
          $(PRODUCT_SAVE).on("click", function() {
               // there will only be the one return from this selector but it comes back in an array
               var productName = $(NEW_PRODUCT_NAME)[0].value;

               if ((productName == undefined) || (productName == null) || (productName === "")) {
                    $(NEW_NAME_LABEL).addClass("text-error");
                    $(PRODUCT_ERROR).show();
               } else {
                    $(PRODUCT_SELECT)[0].innerHTML = productName;
                    $(PRODUCT_MODAL).modal('hide');
                    
                    $(PRODUCT_LIST).parent().fadeOut(400, function() {
                         $(PRODUCT_SELECT).fadeIn();
                         $(UNDO_PRODUCT).fadeIn();
                    });
               }
          });

          // When the modal is closed, the contents need to be reset.
          $(PRODUCT_MODAL).on('hidden', function () {
               $(NEW_NAME_LABEL).removeClass("text-error");
               $(PRODUCT_ERROR).hide();
               $(NEW_PRODUCT_NAME)[0].value = "";
          });

          $(MEDIA_SAVE).on("click", function () {
               saveNewMedia();
          });
     }

     function setupCalendars() {
          $(START_CALENDAR).datepicker({
               showButtonPanel: true
          });

          $(START_CALENDAR_ICON).on("click", function() {
               $(START_CALENDAR).datepicker("show");
          });

          $(END_CALENDAR).datepicker({
               showButtonPanel: true
          });

          $(END_CALENDAR_ICON).on("click", function() {
               $(END_CALENDAR).datepicker("show");
          });

          // need to set the zIndex so that it will sit properly with the modal
          $(START_HOUR).ptTimeSelect({zIndex: 1060});
          $(END_HOUR).ptTimeSelect({zIndex: 1060});

     }

     function setupEvents() {
          $(SAVE).on("click", function () {

          });

          $(CANCEL).on("click", function () {
               $(ENTRY_AREA).fadeOut(400, function () {
                    $(PROMOTION_NAME)[0].value = "";
                    $(PRODUCT_SELECT)[0].innerHTML = "";
                    $(PRODUCT_SELECT).hide();
                    activeClient = null;
                    activeProduct = null;
                    $(SELECTED_CLIENT)[0].innerHTML = "";
                    $(SELECTED_CLIENT).fadeOut(400, function () {
                         $(CLIENT_LIST).parent().parent().fadeIn();
                    });

                    $(START_CALENDAR)[0].value = "";
                    $(END_CALENDAR)[0].value = "";

                    $(START_HOUR)[0].value = "";
                    $(END_HOUR)[0].value = "";

                    $(DAY_SELECTION + " .active").removeClass("active");
                    $(RUN_TIMES)[0].innerHTML = "";
                    $(RUN_TIMES).hide();
                    promoTimes = [];
               });
          });

          $(UNDO_PRODUCT).on("click", function() {
               $(PRODUCT_SELECT).fadeOut(400, function() {
                    $(PRODUCT_SELECT)[0].innerHTML = "";
                    activeProduct = undefined;
                    $(MEDIA_AREA).fadeOut(400, function() {
                         $(VIDEO_BOX).hide();
                    });
                    $(PRODUCT_LIST).parent().fadeIn();
               });
               $(UNDO_PRODUCT).fadeOut();
          });
     }

     function saveRunTime() {
          var days = [];
          $(DAY_SELECTION + " .active").each(function() {
               days.push(this.innerHTML);
          });

          promoTimes.push({
               startTime: $(START_HOUR)[0].value,
               endTime: $(END_HOUR)[0].value,
               days: days
          });

          var timeTile =
                    "<div class='well' style='float:left;'>" +
                         "<div>" +
                              "<span class='time'>Start: " + $(START_HOUR)[0].value + "</span><br/>" +
                              "<span class='time'>End: " + $(END_HOUR)[0].value + "</span>" +
                         "</div>";

          timeTile += "<span class='tileDays'>";
          $(DAY_SELECTION + " .active").each(function() {
               timeTile += this.innerHTML + " ";
          });
          timeTile += "</span>";

          var id = "remove" + (promoTimes.length - 1);
          timeTile += "<br/><button id='" + id + "' class='btn btn-mini' type='button'>Remove</button>";
          timeTile += "</div>";

          $(RUN_TIMES).append(timeTile);

          $("#" + id).on("click", function (event) {
               removeRunTime("#" + $(event.target).attr("id"));
          });
     }

     function removeRunTime(id) {
          var index = $(id).parent().parent().index($(id).parent());

          //remove the entry selected. 
          promoTimes.splice(index, 1);
          $(id).parent().remove();

          if (promoTimes.length === 0) {
               $(RUN_TIMES).fadeOut();
          }
     }

     function validatePromoTimes() {
          var seletedDaysCount = $(DAY_SELECTION + " .active").length;
          if (seletedDaysCount === 0) {
               $(DAY_ERROR).show();
               return false;
          }

          $(DAY_ERROR).hide();

          if (($(START_HOUR)[0].value === "") || ($(END_HOUR)[0].value === "")) {
               $(HOUR_ERROR).show();
               return false;
          }

          $(HOUR_ERROR).hide();
          return true;
     }

     function setupRunTime() {

          $(RUN_SAVE).on("click", function () {
               if (validatePromoTimes()) {
                    if (promoTimes.length === 0) {
                         saveRunTime();
                         $(RUN_TIMES).fadeIn();
                    } else {
                         saveRunTime();
                    }

                    $(START_HOUR)[0].value = "";
                    $(END_HOUR)[0].value = "";
                    $(DAY_SELECTION + " .active").removeClass("active");
                    $(HOURS_MODAL).modal('hide');
               }
          });

          $(RUN_CANCEL).on("click", function () {
               $(START_HOUR)[0].value = "";
               $(END_HOUR)[0].value = "";
               $(DAY_SELECTION + " .active").removeClass("active");
               $(HOUR_ERROR).hide();
               $(DAY_ERROR).hide();
          });

     }

     PromoDemo.prototype = {

          constructor: PromoDemo,

          init: function (initData) {
               data = initData;
               setupClientList(this);
               setupModalEvents(this);
               setupCalendars();
               setupEvents();
               setupRunTime();
          },

          getData: function () {
               return data;
          },

          getActiveClient: function () {
               return activeClient;
          },

          setActiveClient: function (index) {
               activeClient = data[index];
               populateProductList(this);
          },

          setActiveProduct: function (index) {
               activeProduct = activeClient.products[index];
          }
     };

     net.PromoDemo = PromoDemo;

}(net, window.jQuery));