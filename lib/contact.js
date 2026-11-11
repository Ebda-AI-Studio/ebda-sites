// Composes a mailto: from the enquiry form. No network calls; the visitor's mail app sends it.
(function () {
  var f = document.getElementById('enquiry');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f);
    var body = String(d.get('name')) + '\n' + String(d.get('contact')) + '\n\n' + String(d.get('message'));
    location.href = 'mailto:' + f.dataset.to + '?subject=' + encodeURIComponent(f.dataset.subject) + '&body=' + encodeURIComponent(body);
  });
})();
