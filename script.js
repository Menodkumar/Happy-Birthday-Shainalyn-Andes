const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

window.addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("hide"),500));

// Next birthday countdown: September 20.
function nextBirthday(){
  const now=new Date(), year=now.getFullYear();
  let d=new Date(year,8,20,0,0,0);
  if(d<=now)d=new Date(year+1,7,23,0,0,0);
  return d;
}
function pad(n){return String(n).padStart(2,"0")}
function updateCountdown(){
  const diff=Math.max(0,nextBirthday()-new Date());
  const s=Math.floor(diff/1000), days=Math.floor(s/86400), hours=Math.floor(s%86400/3600), mins=Math.floor(s%3600/60), secs=s%60;
  $("#days").textContent=pad(days);$("#hours").textContent=pad(hours);$("#minutes").textContent=pad(mins);$("#seconds").textContent=pad(secs);
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

Happy birthday! 🎂✨

It’s kinda funny how an MLBB match can introduce two people who were complete strangers, and somehow turn that random game into a genuine friendship.

I’m really glad we met. From random matches and silly moments to all the conversations in between, you’ve become a friend I’m genuinely happy to have.

On your birthday, I hope you get plenty of happiness, good health, good vibes, and of course… plenty of Chicken Dinners—wait, wrong game. 😂

Keep being yourself, keep smiling, and keep chasing the things you want. May this new year of your life bring you lots of good memories and fewer frustrating teammates. 😭😂

Happy Birthday, Shainalyn! Have an amazing day, MLBB friend. 💗🎮✨`;

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

// Gentle built-in WebAudio "birthday ambience" so there is no copyrighted music bundled.
// Browsers require a user gesture before sound can begin.
let audioCtx=null,master=null,playing=false,timer=null;
const notes=[261.63,329.63,392,523.25,392,329.63,293.66,349.23,440,523.25,440,349.23];
function startMusic(){
  if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();master=audioCtx.createGain();master.gain.value=.045;master.connect(audioCtx.destination)}
  if(playing)return;playing=true;$("#musicBtn").classList.add("playing");$("#musicBtn").setAttribute("aria-pressed","true");$("#musicText").textContent="On";
  let i=0;
  const tick=()=>{if(!playing)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=notes[i++%notes.length];g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.12,audioCtx.currentTime+.05);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.9);o.connect(g).connect(master);o.start();o.stop(audioCtx.currentTime+1);timer=setTimeout(tick,650)};
  tick();
}
function stopMusic(){playing=false;clearTimeout(timer);$("#musicBtn").classList.remove("playing");$("#musicBtn").setAttribute("aria-pressed","false");$("#musicText").textContent="Music"}
$("#musicBtn").onclick=()=>{playing?stopMusic():startMusic()};

// First interaction celebrates subtly.
let first=true;document.addEventListener("click",()=>{if(first){first=false;confetti(45)}},{once:true});
