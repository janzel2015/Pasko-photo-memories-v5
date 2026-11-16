
// =====================================
// MOBILE NAVIGATION
// =====================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =====================================
// HELP BUTTON / TOAST
// =====================================
const toast = document.getElementById('toast');
const helpButton = document.getElementById('helpButton');
let toastTimer;

if (toast && helpButton) {
  helpButton.addEventListener('click', () => {
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  });
}

// =====================================
// FAQ ACCORDION
// Only one answer open at a time
// =====================================
document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-list details').forEach(other => {
        if (other !== item) {
          other.open = false;
        }
      });
    }
  });
});

// =====================================
// CHRISTMAS TEMPLATE CAROUSEL
// =====================================
const track = document.querySelector('.template-track');
const slides = [...document.querySelectorAll('.template-slide')];
const dotsContainer = document.querySelector('.slide-dots');
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

if (track && slides.length && dotsContainer) {

  // CREATE NAVIGATION DOTS
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');

    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to Christmas style ${index + 1}`);

    dot.addEventListener('click', () => {
      const trackRect = track.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();

      const target =
        track.scrollLeft +
        slideRect.left -
        trackRect.left -
        (track.clientWidth - slideRect.width) / 2;

      track.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    });

    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.children];

  // UPDATE ACTIVE DOT
  function updateDots() {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + track.clientWidth / 2;

    let activeIndex = 0;
    let shortestDistance = Infinity;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(center - slideCenter);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        activeIndex = index;
      }
    });

    dots.forEach((dot, index) => {
      const active = index === activeIndex;

      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  // NEXT SLIDE
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const amount = slides[0].offsetWidth + gap;

      track.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
    });
  }

  // PREVIOUS SLIDE
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const amount = slides[0].offsetWidth + gap;

      track.scrollBy({
        left: -amount,
        behavior: 'smooth'
      });
    });
  }

  // TRACK POSITION CHANGES
  track.addEventListener('scroll', updateDots, {
    passive: true
  });

  window.addEventListener('resize', updateDots);

  // INITIAL STATE
  updateDots();
}

// ===== CHECKOUT FLOW (checkout.html) =====
let selectedTpl="Binibining Gabi ❤️", selectedPlan="Basic Magic — ₱99 — No Music", selectedPrice="99", selectedPay="GCash";
function goStep(n){document.querySelectorAll(".order-step").forEach(s=>s.classList.toggle("active",s.dataset.step==String(n)));document.querySelectorAll("#stepper span").forEach(s=>s.classList.toggle("active",s.dataset.step==String(n)));}
const pi=document.getElementById("photoInput");
if(pi){pi.addEventListener("change",e=>{const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{const img=document.getElementById("previewImg"); img.src=ev.target.result; img.style.display="block"; document.getElementById("photoName").textContent="Uploaded: "+f.name; try{localStorage.setItem("ppm_photo",ev.target.result); localStorage.setItem("ppm_photo_name",f.name);}catch(_){}}; r.readAsDataURL(f);});}
document.querySelectorAll("#tplGrid button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#tplGrid button").forEach(x=>x.classList.remove("selected")); b.classList.add("selected"); selectedTpl=b.dataset.tpl; document.getElementById("tplPicked").textContent="Selected: "+selectedTpl;}));
document.querySelectorAll(".pay-opt").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".pay-opt").forEach(x=>x.classList.remove("selected")); b.classList.add("selected"); selectedPlan=b.dataset.plan; selectedPrice=b.dataset.price;}));
document.querySelectorAll("#payMethods button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#payMethods button").forEach(x=>x.classList.remove("selected")); b.classList.add("selected"); selectedPay=b.textContent;}));
function submitOrder(){
  const name=document.getElementById("custName").value.trim()||"Customer";
  const ref=document.getElementById("custRef").value.trim()||"(no ref yet)";
  const order={name,ref,template:selectedTpl,plan:selectedPlan,price:selectedPrice,pay:selectedPay,time:new Date().toLocaleString()};
  try{localStorage.setItem("ppm_order",JSON.stringify(order));}catch(_){}
  window.location.href="success.html";
}
// Pre-select plan from URL ?plan=99 or ?plan=149
(function(){const p=new URLSearchParams(location.search).get("plan"); if(p){document.querySelectorAll(".pay-opt").forEach(b=>{if(b.dataset.price===p) b.click();});} if(location.pathname.includes("checkout")) goStep(1);})();
// ===== SUCCESS PAGE (success.html) =====
(function(){const el=document.getElementById("orderSummary"); if(!el) return; try{const o=JSON.parse(localStorage.getItem("ppm_order")||"null"); const photo=localStorage.getItem("ppm_photo"); if(o){el.innerHTML="<b>Name:</b> "+o.name+"<br><b>Template:</b> "+o.template+"<br><b>Package:</b> "+o.plan+"<br><b>Payment:</b> "+o.pay+"<br><b>Reference:</b> "+o.ref+"<br><b>Status:</b> ⏳ Waiting for payment verification";} if(photo){const img=document.getElementById("successPreview"); if(img){img.src=photo; img.style.display="block";}}}catch(_){}})();
