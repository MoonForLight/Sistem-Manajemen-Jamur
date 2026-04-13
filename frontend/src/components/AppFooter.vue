<template>
  <footer class="footer-dark">
    <div class="footer-dark-inner">
      <!-- Left col -->
      <div class="footer-brand-col">
        <div class="brand-logo">
          <span style="color: #005F05;">Myco</span><span style="color: #66BB69;">Flow</span>
        </div>
        <p class="brand-desc">
          Kami berkomitmen menyediakan sistem monitoring budidaya jamur yang akurat dan terintegrasi, guna membantu pengelolaan pertumbuhan jamur dari pembibitan hingga panen.
        </p>
        <div class="brand-contact">
          <span class="contact-hl">(+62) 8191-7718-779</span> &nbsp;or&nbsp; <span class="contact-hl">MycoFlow@gmail.com</span>
        </div>
      </div>
      <!-- Right cols wrapper for mobile layout -->
      <div class="footer-links-wrapper">
        <div class="footer-link-col">
          <h4>Bantuan</h4>
          <a href="#">Kontak</a>
          <a href="#">Syarat & Ketentuan</a>
          <a href="#">Kebijakan Privasi</a>
        </div>
        <div class="footer-link-col">
          <h4>Informasi</h4>
          <a href="#">Tentang</a>
          <a href="#">Data Publik</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      MycoFlow © 2025. All Rights Reserved
    </div>
  </footer>
</template>

<style scoped>
.footer-dark {
  background: #1c1c1c;
  color: #d1d5db;
  width: 100%;
  margin-top: auto;
  font-family: inherit;
}

.footer-dark-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  padding: 60px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .footer-dark-inner {
    grid-template-columns: 2fr 1fr;
    padding: 80px 40px 60px;
  }
}

.footer-brand-col {
  max-width: 400px;
}

.brand-logo {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}


.brand-desc {
  font-size: 13px;
  line-height: 1.8;
  color: #9ca3af;
  margin-bottom: 30px;
}

.brand-contact {
  font-size: 13px;
  color: #9ca3af;
}

.contact-hl {
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid #5eb562;
  padding-bottom: 2px;
  transition: color 0.3s;
}

.contact-hl:hover {
  color: #5eb562;
}

.footer-links-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.footer-link-col h4 {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.footer-link-col a {
  display: block;
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;
  transition: color 0.2s;
}

.footer-link-col a:hover {
  color: #5eb562;
}

.footer-bottom {
  border-top: 1px solid #333;
  text-align: center;
  padding: 24px;
  font-size: 12px;
  color: #6b7280;
}
</style>
