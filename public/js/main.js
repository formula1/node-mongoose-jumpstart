(function() {
  $(document).ready(function() {
    var fields, hideFlash, part, parts, queryString, _i, _len;
    $(document).foundation();
    $("#form_login_user [name=remember_me]").click(function(e) {
      var that;
      that = $(this);
      if (that.val() === true) {
        return $("form_login_user").attr("action", "/authenticate/local/setup");
      } else {
        return $("form_login_user").attr("action", "/authenticate/local");
      }
    });
    skrollr.init();
    hideFlash = function() {
      return $(".flashMessage").fadeOut(1000, function() {
        return $(this).remove();
      });
    };
    setTimeout(hideFlash, 3000);
    parts = window.location.search.substr(1).split("&");
    queryString = {};
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      fields = part.split("=");
      if (fields.length === 2) {
        queryString[fields[0]] = decodeURIComponent(fields[1].replace(/\+/g, " "));
      }
    }
    $(".langSwitch").each(function() {
      queryString["setLng"] = this.getAttribute("data-lang");
      return this.href = "?" + $.param(queryString);
    });
    $("#fileupload").fileupload({
      dataType: "json",
      add: function(e, data) {
        data.progressMsg = $("<li/>").text("Uploading file ...").appendTo(".image-list");
        return data.submit();
      },
      done: function(e, data) {
        data.progressMsg.remove();
        return $.each(data.result, function() {
          return $("<li/>").append($("<a/>", {
            "class": "th",
            href: this.url,
            target: "_blank"
          }).append($("<img/>", {
            src: this.thumbnailUrl
          })).append($("<input/>", {
            type: "hidden",
            name: "images",
            value: this.url
          }))).appendTo(".image-list");
        });
      }
    });
    $(".image-list").on("click", "i", function(e) {
      return $(this).closest("li").remove();
    });
    $.tablesorter.addParser({
      id: 'price',
      "is": function(s, table, cell) {
        return false;
      },
      format: function(s, table, cell, cellIndex) {
        return cell.childNodes[0].value;
      },
      type: 'numeric',
      parsed: true
    });
    $('.table-sort').tablesorter({
      headerTemplate: '{icon}{content}'
    }).on('change', 'input', function(e) {
      var jtarget;
      jtarget = $(e.target);
      return jtarget.closest('table').trigger("updateCell", [jtarget.closest('td')]);
    });
    return $("#mobile-menu-icon").click(function() {
      return $('#mobile-menu, #mobile-menu-icon .bar').toggleClass("toggle");
    });
  });

}).call(this);
