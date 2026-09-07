const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const lock = $("#lock");
const main = $("#main");
const input = $("#codeInput");
const btn = $("#unlockBtn");
const message = $("#codeMessage");
const boxes = $$("#codeBoxes span");

input.addEventListener("input", () => {
  const v = input.value.replace(/\D/g,"").slice(0,6);
  input.value = v;
  boxes.forEach((b,i)=>b.textContent = v[i] ? "●" : "•");
});

function unlock(){
  if(input.value === "300911"){
    lock.classList.add("success");
    message.textContent = "Unlocked ♡";
    message.style.color = "#6e3047";
    setTimeout(()=>{
      lock.style.display="none";
      main.classList.remove("hidden");
      const surprise = $("#surprise");
      surprise.classList.remove("hidden");
      surprise.setAttribute("aria-hidden","false");
      startHearts();
      observeReveals();
    },650);
  }else{
    message.textContent = "Hmm... coba lagi. Hint: tanggal spesial 🎂";
    message.style.color = "#9b4f64";
    lock.classList.remove("shake"); void lock.offsetWidth; lock.classList.add("shake");
  }
}
btn.addEventListener("click",unlock);
input.addEventListener("keydown",e=>{if(e.key==="Enter")unlock()});

const surprise = $("#surprise");
const giftBox = $("#giftBox");
const giftHint = $("#giftHint");
let giftOpened = false;
function openGift(){
  if(giftOpened) return;
  giftOpened = true;
  giftBox.classList.add("open");
  giftHint.textContent = "A little something, made just for you ♡";
  confetti(80);
  setTimeout(()=>{
    surprise.classList.add("fade-out");
    setTimeout(()=>{
      surprise.classList.add("hidden");
      surprise.setAttribute("aria-hidden","true");
      window.scrollTo(0,0);
    },900);
  },1150);
}
giftBox.addEventListener("click",openGift);
giftBox.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openGift()}});

$$("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));

$("#bouquetBtn").addEventListener("click",()=>{
  toast("Buketnya sampai 🌷 Semoga harimu manis!");
  confetti(35);
});

$$(".memory-card").forEach(card=>{
  card.addEventListener("click",()=>{
    $("#lightboxImg").src = card.querySelector("img").src;
    $("#lightboxCaption").textContent = card.querySelector("figcaption").textContent;
    $("#lightbox").classList.add("show");
    $("#lightbox").setAttribute("aria-hidden","false");
  });
});
function closeBox(){
  $("#lightbox").classList.remove("show");
  $("#lightbox").setAttribute("aria-hidden","true");
}
$("#closeLightbox").addEventListener("click",closeBox);
$("#lightbox").addEventListener("click",e=>{if(e.target.id==="lightbox")closeBox()});

$("#envelope").addEventListener("click",()=>{
  const env=$("#envelope");
  env.classList.toggle("open");
  setTimeout(()=>$("#letterPaper").classList.toggle("show",env.classList.contains("open")),350);
});

const audioPlayer = $("#audioPlayer");
const nowPlaying = $("#nowPlaying");
const tracks = [
  { file: "audio/perfect.mp3", title: "Perfect — Ed Sheeran" },
  { file: "audio/a-thousand-years.mp3", title: "A Thousand Years — Christina Perri" },
  { file: "audio/kamu-cantik-kamu-baik.mp3", title: "Kamu Cantik Kamu Baik" }
];

$$(".song").forEach(song=>{
  song.addEventListener("click",()=>{
    const index = Number(song.dataset.song);
    $$(".song").forEach(s=>s.classList.remove("active"));
    song.classList.add("active");

    if(audioPlayer.src.endsWith(tracks[index].file) && !audioPlayer.paused){
      audioPlayer.pause();
      song.querySelector(".play-icon").textContent = "▶";
      nowPlaying.textContent = "Paused — " + tracks[index].title;
      return;
    }

    audioPlayer.src = tracks[index].file;
    audioPlayer.play().then(()=>{
      $$(".song .play-icon").forEach(i=>i.textContent="▶");
      song.querySelector(".play-icon").textContent = "Ⅱ";
      nowPlaying.textContent = "Now playing — " + tracks[index].title;
    }).catch(()=>{
      nowPlaying.textContent = "Tekan tombol play lagi untuk memulai musik.";
    });
  });
});

audioPlayer.addEventListener("ended",()=>{
  const active = $(".song.active");
  const current = active ? Number(active.dataset.song) : 0;
  const next = (current + 1) % tracks.length;
  const nextSong = $(`.song[data-song="${next}"]`);
  nextSong.click();
});

let shakes=0;
const messages=[
  "Semoga selalu dikelilingi hal-hal baik. ♡",
  "Jangan lupa bangga sama dirimu sendiri.",
  "Semoga mimpi-mimpi kecilmu tumbuh jadi nyata.",
  "Keep smiling. Your smile is precious.",
  "Happy Birthday, Tasya. ✨"
];
$("#jarBtn").addEventListener("click",()=>{
  const jar=$("#jarBtn");
  jar.classList.remove("wobble"); void jar.offsetWidth; jar.classList.add("wobble");
  shakes=Math.min(5,shakes+1);
  $("#jarHint").textContent=`${shakes} / 5`;
  if(shakes===5){
    $("#jarMessage").textContent=messages[Math.floor(Math.random()*messages.length)];
    confetti(50);
    toast("Pesan rahasia berhasil keluar ✨");
  }
});

function observeReveals(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}});
  },{threshold:.12});
  $$(".reveal").forEach(el=>io.observe(el));
}
observeReveals();

function toast(t){
  const x=$("#toast"); x.textContent=t; x.classList.add("show");
  setTimeout(()=>x.classList.remove("show"),2400);
}
function confetti(n=25){
  for(let i=0;i<n;i++){
    const s=document.createElement("span");
    s.textContent=["✦","♡","•","✿"][Math.floor(Math.random()*4)];
    s.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-20px;z-index:70;color:${["#f0c9ba","#e8b7c0","#d9ad78","#fff"][Math.floor(Math.random()*4)]};font-size:${10+Math.random()*18}px;pointer-events:none;animation:fall ${2+Math.random()*2}s linear forwards;`;
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),4500);
  }
}
const style=document.createElement("style");
style.textContent="@keyframes fall{to{transform:translateY(110vh) rotate(500deg);opacity:0}}";
document.head.appendChild(style);

function startHearts(){
  const host=$("#hearts");
  setInterval(()=>{
    const h=document.createElement("span");
    h.textContent=Math.random()>.5?"♡":"✦";
    h.style.cssText=`position:fixed;left:${Math.random()*100}vw;bottom:-20px;color:rgba(255,220,210,.25);font-size:${10+Math.random()*15}px;z-index:1;pointer-events:none;animation:heartFloat ${5+Math.random()*5}s linear forwards`;
    host.appendChild(h);
    setTimeout(()=>h.remove(),10000);
  },900);
}
const hs=document.createElement("style");
hs.textContent="@keyframes heartFloat{to{transform:translateY(-110vh) translateX(40px);opacity:0}}";
document.head.appendChild(hs);
