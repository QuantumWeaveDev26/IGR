/**
 * Main Application Script for IGr CBSE Landing Page
 * Handles interactive sections, video preview modal, grade filtering, FAQ accordions, and Discovery call modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initQuestTabs();
  initGradeSelector();
  initFaqAccordion();
  initVideoModal();
  initDiscoveryModal();
  initEarlyAccessForms();
});

/* Section 4: Gamified Quest Tabs */
function initQuestTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

/* Section 6: CBSE Grade Matrix Selector */
function initGradeSelector() {
  const gradeChips = document.querySelectorAll('.grade-chip');
  const subjectGradeTitles = document.querySelectorAll('.subject-grade-tag');

  gradeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      gradeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const selectedGrade = chip.getAttribute('data-grade');
      
      // Update subject grade tags
      subjectGradeTitles.forEach(el => {
        el.textContent = `Grade ${selectedGrade}`;
      });

      // Update APPU Engine session grade
      if (window.appuEngine) {
        window.appuEngine.session.grade = `Class ${selectedGrade}`;
      }
    });
  });
}

/* Section 9: FAQ Accordions */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other FAQs for clean accordion feel
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* Section 5: Interactive Video Preview Modal */
function initVideoModal() {
  const videoPoster = document.getElementById('videoPosterWrapper');
  const videoModal = document.getElementById('videoModalOverlay');
  const closeVideoBtn = document.getElementById('closeVideoModal');
  const iframeContainer = document.getElementById('videoIframeContainer');

  if (!videoPoster || !videoModal) return;

  videoPoster.addEventListener('click', () => {
    // Render demo video iframe or high quality player preview
    iframeContainer.innerHTML = `
      <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/EE5yKFzgFJI?autoplay=1" title="IGr APPU Demo Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="aspect-ratio: 16/9; border-radius: 12px; width: 100%; border: none;"></iframe>
    `;
    videoModal.classList.add('open');
  });

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => {
      videoModal.classList.remove('open');
      iframeContainer.innerHTML = '';
    });
  }
}

/* Discovery Call & Early Access Modal */
function initDiscoveryModal() {
  const openBtns = document.querySelectorAll('.trigger-discovery-modal');
  const modal = document.getElementById('discoveryModalOverlay');
  const closeBtn = document.getElementById('closeDiscoveryModal');
  const form = document.getElementById('discoveryBookingForm');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('dcName').value.trim();
      const phone = document.getElementById('dcPhone').value.trim();
      const role = document.getElementById('dcRole').value;
      const grade = document.getElementById('dcGrade').value;

      if (!name || !phone) {
        alert('Please fill in your name and WhatsApp number.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Reserving Slot...';

      const bookingPayload = {
        user_name: name,
        user_phone: phone,
        user_role: role,
        grade: grade,
        timestamp: new Date().toISOString()
      };

      const result = await window.n8nClient.submitDiscoveryBooking(bookingPayload);

      submitBtn.disabled = false;
      submitBtn.textContent = '🎉 Slot Confirmed!';

      alert(`Thank you ${name}! 🎉 Your FREE Discovery Call has been booked. Confirmation sent to WhatsApp (${phone}). Appu looks forward to meeting you!`);

      form.reset();
      if (modal) modal.classList.remove('open');
    });
  }
}

/* Early Access Form Ingestion */
function initEarlyAccessForms() {
  const earlyForms = document.querySelectorAll('.early-access-form');
  earlyForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phoneInput = form.querySelector('input[type="tel"]');
      if (!phoneInput || !phoneInput.value.trim()) return;

      const payload = {
        user_phone: phoneInput.value.trim(),
        user_role: 'Early_Access_Applicant',
        source: 'Landing_Page_Section_CTA',
        timestamp: new Date().toISOString()
      };

      await window.n8nClient.submitLeadCapture(payload);

      alert('🚀 Congratulations! You are registered for Early Access to IGr & APPU! Check your WhatsApp for your early invite code.');
      phoneInput.value = '';
    });
  });
}
