const form        = document.getElementById('apply-form');
const alertOk     = document.getElementById('alert-success');
const alertErr    = document.getElementById('alert-error');
const alertErrMsg = document.getElementById('alert-error-msg');
const submitBtn   = document.getElementById('submit-btn');

function showAlert(el, msg) {
  alertOk.classList.remove('show');
  alertErr.classList.remove('show');
  if (msg && el === alertErr) alertErrMsg.textContent = msg;
  el.classList.add('show');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function val(id)   { return (document.getElementById(id)?.value ?? '').trim(); }
function radio(nm) { return document.querySelector(`input[name="${nm}"]:checked`)?.value ?? ''; }

function setErr(id, msg) {
  const errEl   = document.getElementById(`${id}-error`);
  const inputEl = document.getElementById(id);
  if (errEl)   errEl.textContent = msg;
  if (inputEl) inputEl.classList.toggle('error', !!msg);
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function validate(d) {
  let ok = true;

  if (!d.fullName) { setErr('fullName', 'Full name is required.'); ok = false; }

  if (!d.email) {
    setErr('email', 'Email address is required.'); ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    setErr('email', 'Enter a valid email address.'); ok = false;
  }

  if (!d.gender) {
    document.getElementById('gender-error').textContent = 'Please select a gender.'; ok = false;
  }

  if (!d.occupation) { setErr('occupation', 'Please select your occupation.'); ok = false; }
  if (!d.seminarSession) { setErr('seminarSession', 'Please select a preferred session.'); ok = false; }

  if (!d.agreedToTerms) {
    document.getElementById('terms-error').textContent = 'You must agree to the Terms & Conditions.'; ok = false;
  }

  return ok;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const data = {
    fullName:           val('fullName'),
    email:              val('email'),
    phone:              val('phone') || null,
    dateOfBirth:        val('dateOfBirth') || null,
    gender:             radio('gender'),
    occupation:         val('occupation'),
    industry:           val('industry') || null,
    seminarSession:     val('seminarSession'),
    dietaryRequirement: radio('dietaryRequirement'),
    source:             val('source') || null,
    remarks:            val('remarks') || null,
    agreedToTerms:      document.getElementById('agreedToTerms').checked,
  };

  if (!validate(data)) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  try {
    await submitApplication(data);
    showAlert(alertOk);
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
  } catch (err) {
    showAlert(alertErr, err.message || 'Failed to submit application. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
});
