gsap.registerPlugin(ScrollToPlugin);

let scenes = gsap.utils.toArray(".scene");
let currentIndex = 0;
let isAnimating = false;

// 1. SCROLL LOGIC
function goToScene(index) {
    if (index >= 0 && index < scenes.length && !isAnimating) {
        isAnimating = true;
        currentIndex = index;
        const progress = (currentIndex / (scenes.length - 1)) * 100;
        document.getElementById("myBar").style.width = progress + "%";
        gsap.to(window, {
            scrollTo: { y: scenes[currentIndex], autoKill: false },
            duration: 1.2, ease: "power2.inOut",
            onComplete: () => { isAnimating = false; }
        });
        animateContent(scenes[currentIndex]);
    }
}

window.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (isAnimating) return;
    e.deltaY > 0 ? goToScene(currentIndex + 1) : goToScene(currentIndex - 1);
}, { passive: false });

function animateContent(scene) {
    gsap.fromTo(scene.querySelector(".content"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 });
    if (scene.querySelector(".skill-card")) {
        gsap.to(scene.querySelectorAll(".skill-card"), { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 });
    }
}

// 2. MAGNETIC & PREVIEW LOGIC
const cursor = document.querySelector('.cursor-follower');
const overlay = document.getElementById('previewOverlay');
const pTitle = document.getElementById('pTitle');
const pDesc = document.getElementById('pDesc');
const pVisual = document.getElementById('pVisual');

const projects = {
    audio: { title: "Audio Mastery", desc: "Tuning IEM untuk kejernihan vokal dan instrumen tinggi.", color: "#ff0077" },
    web: { title: "NASIHUY Digital", desc: "Arsitektur web responsif dengan performa optimal.", color: "#00f2ff" },
    scent: { title: "Scent Library", desc: "Kurasi wewangian dari koleksi luxury internasional.", color: "#ffcc00" }
};

document.querySelectorAll('.interactive-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const data = projects[card.dataset.type];
        pTitle.innerText = data.title;
        pDesc.innerText = data.desc;
        pVisual.style.background = `linear-gradient(45deg, #000, ${data.color}44)`;
        overlay.style.opacity = "1";
        gsap.to(cursor, { scale: 3 });
    });
    card.addEventListener('mouseleave', () => {
        overlay.style.opacity = "0";
        gsap.to(cursor, { scale: 1 });
    });
});

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15 });
    gsap.to(overlay, { x: e.clientX, y: e.clientY, duration: 0.4 });
});

// MAGNETIC BUTTON
const mBtn = document.querySelector('.magnetic');
mBtn.addEventListener('mousemove', (e) => {
    const rect = mBtn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width/2) * 0.4;
    const y = (e.clientY - rect.top - rect.height/2) * 0.4;
    gsap.to(mBtn, { x, y, duration: 0.3 });
});
mBtn.addEventListener('mouseleave', () => gsap.to(mBtn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out" }));

// 3. CANVAS PARTICLES
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

let particles = Array.from({length: 40}, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: Math.random() * 0.4 - 0.2, vy: Math.random() * 0.4 - 0.2
}));

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle = '#00f2ff';
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x<0 || p.x>canvas.width) p.vx*=-1; if(p.y<0 || p.y>canvas.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
}
draw();
animateContent(scenes[0]);