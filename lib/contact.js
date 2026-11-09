// Composes a mailto: from the enquiry form. No network calls; the visitor's mail app sends it.
(function () {
  var f = document.getElementById('enquiry');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f);
    var body = String(d.get('name')) + '\n' + String(d.get('contact')) + '\n' + String(d.get('topic') || '') + '\n\n' + String(d.get('message'));
    var s = document.getElementById('sent');
    if (s) s.textContent = s.dataset.msg;
    location.href = 'mailto:' + f.dataset.to + '?subject=' + encodeURIComponent(f.dataset.subject) + '&body=' + encodeURIComponent(body);
  });
})();
