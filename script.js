const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

window.addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("hide"),500));

// Birthday countdown — Philippines time (Asia/Manila, UTC+8).
function philippinesYear(){
  return Number(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',year:'numeric'}).format(new Date()));
}
function birthdayInstant(year){
  // September 20, 00:00:00 in Manila = September 19, 16:00:00 UTC.
  return new Date(Date.UTC(year,8,20,0,0,0)-8*60*60*1000);
}
function nextBirthday(){
  const now=new Date();
  const year=philippinesYear();
  let target=birthdayInstant(year);
  if(now>=target) target=birthdayInstant(year+1);
  return target;
}
function pad(n){return String(n).padStart(2,'0')}
function updateCountdown(){
  const diff=Math.max(0,nextBirthday()-new Date());
  const s=Math.floor(diff/1000), days=Math.floor(s/86400), hours=Math.floor(s%86400/3600), mins=Math.floor(s%3600/60), secs=s%60;
  document.querySelector('#days').textContent=pad(days);
  document.querySelector('#hours').textContent=pad(hours);
  document.querySelector('#minutes').textContent=pad(mins);
  document.querySelector('#seconds').textContent=pad(secs);
}
updateCountdown();setInterval(updateCountdown,1000);

// Scroll reveals.
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(e=>observer.observe(e));

// Floating particle field.
const canvas=$("#particles"),ctx=canvas.getContext("2d");let W,H,pts=[];
function resize(){W=canvas.width=innerWidth*devicePixelRatio;H=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";pts=Array.from({length:Math.min(80,Math.floor(innerWidth/12))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+0.4,a:Math.random(),v:Math.random()*.18+.04}))}
function draw(){ctx.clearRect(0,0,W,H);for(const p of pts){p.y-=p.v*devicePixelRatio;if(p.y<0)p.y=H;ctx.globalAlpha=.15+p.a*.35;ctx.fillStyle="#ffd8e8";ctx.beginPath();ctx.arc(p.x,p.y,p.r*devicePixelRatio,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}
addEventListener("resize",resize);resize();draw();

// Confetti.
function confetti(count=120){
  const box=$("#confetti");
  for(let i=0;i<count;i++){
    const el=document.createElement("i");el.className="confetti-piece";
    el.style.left=Math.random()*100+"vw";el.style.setProperty("--x",(Math.random()*240-120)+"px");
    el.style.animationDuration=(2.2+Math.random()*2.4)+"s";el.style.animationDelay=(Math.random()*.35)+"s";
    el.style.background=`hsl(${Math.floor(Math.random()*360)} 90% 70%)`;
    el.style.transform=`rotate(${Math.random()*360}deg)`;
    box.appendChild(el);setTimeout(()=>el.remove(),5000);
  }
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2800)}
$("#celebrateBtn").onclick=()=>{confetti();toast("Make a wish. The universe is listening. ✨")};
$("#modalCelebrate").onclick=()=>{confetti(180);toast("One more sparkle for the birthday star. 💗")};

// Letter modal + typewriter.
const message=`Shainalyn,

Happy Birthday! 🎂✨

Even though we only became friends very recently, I’m really glad we ended up in the same MLBB squad. We haven’t even played together yet, but I’m already looking forward to our first game. 🎮

Thank you for being so friendly and easy to talk to. I’ve really enjoyed getting to know you, and I hope we get to have plenty of fun conversations and good moments ahead.

May your birthday be filled with happiness, good health, laughter, and everything that makes you smile. I hope this new year of your life brings you many beautiful moments and wonderful opportunities.

Happy Birthday once again, Shainalyn! 💗
I hope we get our first MLBB game soon. 😂🎮✨

— Your MLBB squadmate`

let typingTimer;
function openLetter(){
  $("#letterModal").hidden=false;document.body.classList.add("modal-open");
  const target=$("#letterText");target.textContent="";let i=0;clearInterval(typingTimer);
  typingTimer=setInterval(()=>{target.textContent+=message[i++]||"";if(i>=message.length)clearInterval(typingTimer)},24);
  setTimeout(()=>$("#closeLetter").focus(),30);
}
function closeLetter(){clearInterval(typingTimer);$("#letterModal").hidden=true;document.body.classList.remove("modal-open")}
$("#openLetter").onclick=openLetter;$("#openLetterTop").onclick=openLetter;$("#closeLetter").onclick=closeLetter;
$(".modal-backdrop").onclick=closeLetter;document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#letterModal").hidden)closeLetter()});

// Original birthday ambience.
// Uses a bundled audio file instead of Web Audio synthesis, which is more reliable
// across mobile browsers and GitHub Pages. Playback still requires a user gesture.
const birthdayAudio=$("#birthdayAudio");
const musicBtn=$("#musicBtn");
let playing=false;

async function startMusic(){
  try{
    birthdayAudio.volume=0.35;
    await birthdayAudio.play();
    playing=true;
    musicBtn.classList.add("playing");
    musicBtn.setAttribute("aria-pressed","true");
    $("#musicText").textContent="On";
  }catch(err){
    playing=false;
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-pressed","false");
    $("#musicText").textContent="Tap again";
    toast("Tap the Music button once more to start the music 🎵");
  }
}
function stopMusic(){
  birthdayAudio.pause();
  playing=false;
  musicBtn.classList.remove("playing");
  musicBtn.setAttribute("aria-pressed","false");
  $("#musicText").textContent="Music";
}
musicBtn.addEventListener("click",()=>playing?stopMusic():startMusic());
birthdayAudio.addEventListener("ended",()=>{playing=false;musicBtn.classList.remove("playing");$("#musicText").textContent="Music"});

// First interaction celebrates subtly.
let first=true;document.addEventListener("click",()=>{if(first){first=false;confetti(45)}},{once:true});
