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

  // Contact form (front-end only demo)
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.textContent = "Thanks! We've received your message and will get back to you within one business day.";
      note.classList.add('visible');
      form.reset();
    });
  }

  // Testimonial submission (stored locally in this browser)
  var testimonialForm = document.getElementById('testimonial-form');
  var testimonialNote = document.getElementById('testimonial-note');
  var testimonialList = document.getElementById('testimonial-list');
  var STORAGE_KEY = 'lilics-testimonials';

  function initials(name) {
    return name.trim().charAt(0).toUpperCase() || '?';
  }

  function renderTestimonials() {
    if (!testimonialList) return;
    var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    testimonialList.innerHTML = '';
    stored.slice().reverse().forEach(function (t) {
      var card = document.createElement('div');
      card.className = 'testimonial';
      card.innerHTML =
        '<p class="quote">"' + t.message + '"</p>' +
        '<div class="author">' +
        '<div class="avatar">' + initials(t.name) + '</div>' +
        '<div><strong>' + t.name + '</strong>' +
        '<span>' + t.unit + ' &middot; ' + '★'.repeat(Number(t.rating)) + '</span></div>' +
        '</div>';
      testimonialList.appendChild(card);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (testimonialForm && testimonialNote) {
    renderTestimonials();
    testimonialForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.push({
        name: escapeHtml(document.getElementById('t-name').value),
        unit: document.getElementById('t-unit').value,
        rating: document.getElementById('t-rating').value,
        message: escapeHtml(document.getElementById('t-message').value)
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      renderTestimonials();
      testimonialNote.textContent = 'Thank you for sharing your experience!';
      testimonialNote.classList.add('visible');
      testimonialForm.reset();
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
