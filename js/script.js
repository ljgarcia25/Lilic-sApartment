// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ---- Form handling via Formspree ----
  // Both the contact form and the testimonial form POST to Formspree,
  // which emails the submission to the property owner. Each <form> carries
  // its own endpoint in its `action` attribute (see the HTML). Until a real
  // Formspree ID is filled in, submissions show a setup reminder instead.
  var PLACEHOLDER = 'YOUR_FORMSPREE_ID';

  function handleFormspreeForm(formId, noteId, successMsg) {
    var form = document.getElementById(formId);
    var note = document.getElementById(noteId);
    if (!form || !note) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute('action') || '';

      // Not configured yet — don't pretend it sent.
      if (endpoint.indexOf(PLACEHOLDER) !== -1) {
        note.textContent = 'This form isn’t connected yet. (Owner: add your Formspree form ID to activate email delivery.)';
        note.classList.add('visible');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      note.textContent = 'Sending…';
      note.classList.add('visible');

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          note.textContent = successMsg;
          form.reset();
        } else {
          response.json().then(function (data) {
            var msg = (data && data.errors)
              ? data.errors.map(function (er) { return er.message; }).join(', ')
              : 'Something went wrong. Please try again or contact us directly.';
            note.textContent = msg;
          }).catch(function () {
            note.textContent = 'Something went wrong. Please try again or contact us directly.';
          });
        }
      }).catch(function () {
        note.textContent = 'Network error. Please check your connection and try again.';
      }).then(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  handleFormspreeForm(
    'contact-form',
    'form-note',
    'Thanks! We’ve received your message and will get back to you within one business day.'
  );

  handleFormspreeForm(
    'testimonial-form',
    'testimonial-note',
    'Thank you for sharing your experience! Your remarks have been sent and will be posted after a quick review.'
  );

  // Hide the "no remarks yet" note once approved testimonials are present
  var testimonialList = document.getElementById('testimonial-list');
  var testimonialEmpty = document.getElementById('testimonial-empty');
  if (testimonialList && testimonialEmpty) {
    var hasPublished = testimonialList.querySelector('.testimonial');
    testimonialEmpty.style.display = hasPublished ? 'none' : 'block';
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
