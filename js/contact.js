(function () {
  'use strict';
  var EMAIL = 'info@example.com';
  var form = document.getElementById('enquiryForm');
  var msg = document.getElementById('formMsg');
  if (!form) return;

  function data() {
    var f = new FormData(form);
    var g = function (k) { return (f.get(k) || '').toString().trim(); };
    return {
      name: g('name'), company: g('company'), phone: g('phone'), email: g('email'),
      material: g('material'), quantity: g('quantity'), message: g('message')
    };
  }
  function body(d) {
    return [
      'Enquiry for Winlark Mines',
      'Name: ' + d.name,
      'Company: ' + (d.company || '-'),
      'Phone: ' + d.phone,
      'Email: ' + (d.email || '-'),
      'Material required: ' + (d.material || '-'),
      'Quantity / requirement: ' + (d.quantity || '-'),
      'Message: ' + (d.message || '-')
    ].join('\n');
  }
  function valid() {
    var d = data();
    var ok = d.name && d.phone && /^[0-9+()\-\s]{7,}$/.test(d.phone);
    msg.className = 'form-msg' + (ok ? '' : ' err');
    msg.textContent = ok ? '' : 'Please enter your name and a valid phone number.';
    if (!ok) (d.name ? form.elements.phone : form.elements.name).focus();
    return ok ? d : null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = valid();
    if (!d) return;
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Enquiry from ' + d.name) + '&body=' + encodeURIComponent(body(d));
    msg.textContent = 'Opening your email app with the enquiry details.';
  });

  document.getElementById('waSend').addEventListener('click', function () {
    var d = valid();
    if (!d) return;
    window.open('https://wa.me/' + window.WINLARK_WA + '?text=' + encodeURIComponent(body(d)), '_blank', 'noopener');
  });
})();
