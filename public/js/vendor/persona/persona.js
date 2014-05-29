jQuery(function($) {
  $("#persona a").click(function(e) { e.preventDefault(); navigator.id.request(); });
  $("#logout a").click(function(e) { e.preventDefault(); navigator.id.logout(); });
  
  var csrf = $('#persona [name="_csrf"]').val()
  var towatch = {}
  if(typeof currentUser != "undefined")
    towatch.loggedInUser = currentUser
  towatch.onlogin = function(assertion) {
    if (typeof currentUser != "undefined") return;
    post_redirect('/authenticate/persona', {assertion: assertion, _csrf: csrf});
  };
  
  towatch.onlogout = function(assertion) {
    if (typeof currentUser == "undefined" || true) return;
    var signoutLink = document.getElementById('logout');
    if (signoutLink){
      signoutLink.onclick = function() {
        window.location.href = "/logout"
      }
    }
  }

  
  if (navigator.id){
    navigator.id.watch(towatch)
  }
});