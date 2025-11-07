
  (function ($) {
  
  "use strict";

    // MENU
    $('#sidebarMenu .nav-link').on('click',function(){
      $("#sidebarMenu").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });
  
  })(window.jQuery);

// Dynamic current year in footer
document.addEventListener('DOMContentLoaded', function () {
  var year = new Date().getFullYear();
  document.querySelectorAll('.js-current-year').forEach(function(el){
    el.textContent = year;
  });

  // Sidebar expand/retract via burger
  var burger = document.querySelector('.navbar-toggler');
  if (burger) {
    burger.addEventListener('click', function (e) {
      document.body.classList.toggle('sidebar-collapsed');
    });
  }

  function sanitizeValue(v){
    if(!v) return v;
    v = v.replace(/<\s*script/gi, '').replace(/<\s*\/\s*script\s*>/gi,'');
    v = v.replace(/[\u0000-\u001F\u007F]/g,'');
    v = v.replace(/["'`]/g, '');
    return v;
  }

  function hasMaliciousPattern(v){
    if(!v) return false;
    var s = v.toLowerCase();
    var patterns = [
      /\bunion\b\s+\bselect\b/,
      /\bdrop\b\s+\btable\b/,
      /\binsert\b\s+\binto\b/,
      /\bupdate\b\s+\bset\b/,
      /\bdelete\b\s+\bfrom\b/,
      /--|;|\/\*/,
      /\bor\b\s+1\s*=\s*1/,
      /<\s*img[^>]*onerror/,
      /javascript:/
    ];
    return patterns.some(function(rx){return rx.test(s);});
  }

  function getCsrfToken(){
    var k = 'csrf_token_v1';
    var t = sessionStorage.getItem(k);
    if(!t){
      t = (Math.random().toString(36).slice(2)+Date.now().toString(36));
      sessionStorage.setItem(k,t);
    }
    return t;
  }

  function ensureCsrfInput(form){
    var name = 'csrf_token';
    var input = form.querySelector('input[name="'+name+'"]');
    if(!input){
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      form.appendChild(input);
    }
    input.value = getCsrfToken();
  }

  function attachSanitizers(form){
    var fields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea');
    fields.forEach(function(f){
      f.addEventListener('input', function(){
        var v = sanitizeValue(f.value);
        if(v !== f.value) f.value = v;
      });
    });
  }

  function validateForm(form){
    var ok = true;
    var fields = form.querySelectorAll('input, textarea');
    fields.forEach(function(f){
      var v = (f.value||'');
      if(hasMaliciousPattern(v)) ok = false;
    });
    var token = form.querySelector('input[name="csrf_token"]');
    if(!token || token.value !== getCsrfToken()) ok = false;
    return ok;
  }

  document.querySelectorAll('form').forEach(function(form){
    ensureCsrfInput(form);
    attachSanitizers(form);
    form.addEventListener('submit', function(e){
      if(!validateForm(form)){
        e.preventDefault();
        alert('Form blocked due to invalid or unsafe input.');
      }
    });
  });
});
