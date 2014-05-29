function post_redirect(path, parameters) {
    var form = jQuery('<form></form>');

    form.attr("method", "post");
    form.attr("action", path);

    jQuery.each(parameters, function(key, value) {
        var field = jQuery('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
    });

    // The form needs to be a part of the document in
    // order for us to be able to submit it.
    jQuery(document.body).append(form);
    form.submit();
}

function regexify(query, regex){
  $(query).change(function(e){
    that = $(this).parent();
    var field_value = that.attr("value");
    if(field_value == ""){
      that.removeClass("has-warning");
      that.removeClass("has-success");
    }else if(!field_value.match(new RegExp(regex))){
      that.addClass("has-warning");
      that.removeClass("has-success");
    }else{
      that.removeClass("has-warning");
      that.addClass("has-success");
    }
  })
}

function autocomplete(query,url,label,id, dest){
  if(!id)
    id = "_id"
  if(typeof dest == "undefined")
    dest = query
  jQuery( query ).autocomplete({
      source: function( request, response ) {
        ar = {};
        ar.data = {};
        ar.data[label] = request.term;
        ar.url = url;
        jQuery.ajax(ar).done(function( data ) {
            response( $.map( data, function( item ) {
              return {
                label: item[label],
                value: item[id]
              }
            }));
          });
      },
      minLength: 2,
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      },
      select: function( event, ui ) {
        $( query ).val( ui.item.label );
        $( dest ).val( ui.item.value );
        return false;
      }
  });
}

jQuery(function($){
  $("#remember_me").click(function(e){
    that = $(this)
    if(that.is(':checked')){
      $("#password").prop('disabled', true);
      $("#form_login_user").attr("action", "/authenticate/local/setup")
    }else{
      $("#password").prop('disabled', false);
      $("#form_login_user").attr("action", "/authenticate/local")
    }
  });
  
})