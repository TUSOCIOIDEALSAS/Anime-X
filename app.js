/* ══════════════════════════════════
   DATABASE - ANIMES
══════════════════════════════════ */
const DB={
  key:'animex_db',
  getAll(){try{return JSON.parse(localStorage.getItem(this.key))||this.defaults()}catch{return this.defaults()}},
  save(d){localStorage.setItem(this.key,JSON.stringify(d))},
  defaults(){return[
    {id:'ds',emoji:'⚔',cover:'',title:'Demon Slayer: Kimetsu no Yaiba',bg:'#1e0a30',rating:9.1,year:2019,status:'Finalizado',vip:false,genres:['accion'],desc:'Un joven decide convertirse en cazador de demonios para salvar a su hermana y vengar a su familia masacrada.',episodes:[{num:1,season:1,title:'Crueldad',url:''},{num:2,season:1,title:'Esa noche',url:''},{num:3,season:1,title:'Hacha y piedra de afilar',url:''}]},
    {id:'jjk',emoji:'◈',cover:'',title:'Jujutsu Kaisen',bg:'#0a0a2e',rating:9.0,year:2020,status:'En emisión',vip:false,genres:['accion'],desc:'Yuji Itadori traga un dedo de una maldición suprema y se convierte en huésped de Ryomen Sukuna, el Rey de las Maldiciones.',episodes:[{num:1,season:1,title:'Ryomen Sukuna',url:''},{num:2,season:1,title:'Para ti, algún día',url:''}]},
    {id:'op',emoji:'☠',cover:'',title:'One Piece',bg:'#0a1a0a',rating:9.3,year:1999,status:'En emisión',vip:false,genres:['accion','comedia'],desc:'Monkey D. Luffy busca el tesoro más grande del mundo para convertirse en el Rey de los Piratas.',episodes:[{num:1,season:1,title:'Yo soy Luffy',url:''}]},
    {id:'aot',emoji:'⚡',cover:'',title:'Attack on Titan',bg:'#1a0a0a',rating:9.4,year:2013,status:'Finalizado',vip:false,genres:['accion'],desc:'La humanidad vive amurallada ante gigantes que devoran humanos sin motivo aparente.',episodes:[{num:1,season:1,title:'Para ti, 2000 años después',url:''}]},
    {id:'spy',emoji:'◆',cover:'',title:'Spy x Family',bg:'#1a1a0a',rating:8.7,year:2022,status:'En emisión',vip:false,genres:['comedia','accion'],desc:'Un espía, una asesina y una niña telépata forman una familia falsa sin saber los secretos de los demás.',episodes:[{num:1,season:1,title:'Operation Strix',url:''}]},
    {id:'mha',emoji:'▲',cover:'',title:'My Hero Academia',bg:'#000a1a',rating:8.5,year:2016,status:'Finalizado',vip:false,genres:['accion'],desc:'En un mundo donde casi todos tienen superpoderes, Izuku Midoriya nace sin ninguno pero sueña con ser el mejor héroe.',episodes:[{num:1,season:1,title:'Quiero convertirme en héroe',url:''}]},
    {id:'nb',emoji:'◉',cover:'',title:'Naruto Shippuden',bg:'#1a0800',rating:8.7,year:2007,status:'Finalizado',vip:false,genres:['accion'],desc:'Naruto Uzumaki continúa su entrenamiento y enfrenta nuevas amenazas.',episodes:[{num:1,season:1,title:'El regreso de Naruto',url:''}]},
  ]}
};

/* ══════════════════════════════════
   DATABASE - USUARIOS
══════════════════════════════════ */
const UserDB={
  key:'animex_users',
  sessionKey:'animex_session',
  getAll(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]}},
  save(u){localStorage.setItem(this.key,JSON.stringify(u))},
  register(username,email,pass){
    const users=this.getAll();
    if(users.find(u=>u.username.toLowerCase()===username.toLowerCase()))return{ok:false,msg:'Ese usuario ya existe'};
    if(users.find(u=>u.email.toLowerCase()===email.toLowerCase()))return{ok:false,msg:'Ese email ya está registrado'};
    const user={id:'u_'+Date.now(),username,email,pass,vip:false,vipExpiry:null,avatar:username[0].toUpperCase(),joined:Date.now()};
    users.push(user);this.save(users);return{ok:true,user};
  },
  login(username,pass){
    const users=this.getAll();
    const u=users.find(u=>u.username.toLowerCase()===username.toLowerCase()&&u.pass===pass);
    if(!u)return{ok:false,msg:'Usuario o contraseña incorrectos'};
    return{ok:true,user:u};
  },
  getSession(){try{return JSON.parse(localStorage.getItem(this.sessionKey))}catch{return null}},
  setSession(user){localStorage.setItem(this.sessionKey,JSON.stringify(user))},
  clearSession(){localStorage.removeItem(this.sessionKey)},
  updateUser(updated){
    const users=this.getAll();
    const idx=users.findIndex(u=>u.id===updated.id);
    if(idx>=0){users[idx]=updated;this.save(users);}
    this.setSession(updated);
  }
};

/* ══════════════════════════════════
   DATABASE - COMUNIDAD
══════════════════════════════════ */
const CommDB={
  key:'animex_comm',
  getAll(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]}},
  save(p){localStorage.setItem(this.key,JSON.stringify(p))},
  add(animeId,userId,username,avatar,text){
    const posts=this.getAll();
    posts.unshift({id:'p_'+Date.now(),animeId,userId,username,avatar,text,date:Date.now(),likes:[]});
    this.save(posts);
  },
  getForAnime(animeId){return this.getAll().filter(p=>p.animeId===animeId)},
  toggleLike(postId,userId){
    const posts=this.getAll();
    const p=posts.find(x=>x.id===postId);
    if(!p)return;
    if(p.likes.includes(userId))p.likes=p.likes.filter(x=>x!==userId);
    else p.likes.push(userId);
    this.save(posts);
  },
  delete(postId,userId){
    let posts=this.getAll();
    posts=posts.filter(p=>!(p.id===postId&&p.userId===userId));
    this.save(posts);
  }
};

/* ══════════════════════════════════
   DATABASE - VIP CODES
══════════════════════════════════ */
const CodesDB={
  key:'animex_vip_codes',
  getAll(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]}},
  save(c){localStorage.setItem(this.key,JSON.stringify(c))},
  add(code,days){
    const codes=this.getAll();
    const expiry=Date.now()+(days*24*60*60*1000);
    codes.push({code,days,expiry,created:Date.now(),used:false});
    this.save(codes);
    return expiry;
  },
  validate(code){
    const codes=this.getAll();
    const c=codes.find(x=>x.code===code.toUpperCase());
    if(!c)return{ok:false,msg:'Código inválido. Verifica tu compra.'};
    if(c.used)return{ok:false,msg:'Este código ya fue utilizado.'};
    if(c.expiry<Date.now())return{ok:false,msg:'Este código ha caducado.'};
    return{ok:true,days:c.days,expiry:c.expiry};
  },
  markUsed(code){
    const codes=this.getAll();
    const c=codes.find(x=>x.code===code.toUpperCase());
    if(c){c.used=true;this.save(codes);}
  },
  delete(code){
    const codes=this.getAll().filter(x=>x.code!==code);
    this.save(codes);
  }
};

/* ══════════════════════════════════
   DATABASE - DESTACADOS
══════════════════════════════════ */
const FeaturedDB={
  key:'animex_featured',
  get(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]}},
  save(ids){localStorage.setItem(this.key,JSON.stringify(ids))}
};

/* ══════════════════════════════════
   DATABASE - NEWS BANNER
══════════════════════════════════ */
const NewsDB={
  key:'animex_news',
  get(){try{return JSON.parse(localStorage.getItem(this.key))||null}catch{return null}},
  save(n){localStorage.setItem(this.key,JSON.stringify(n))},
  clear(){localStorage.removeItem(this.key)}
};

/* ══════════════════════════════════
   STATE
══════════════════════════════════ */
let animes=[];
let currentAnime=null;
let currentEpIdx=null;
let currentSeason=1;
let watched={};
let editingId=null;
let tempEps=[];
let currentUser=null;
let commAnimeFilter=null;

const ADMIN_CREDS={user:'hector12',pass:'hector12'};
const THIS_YEAR=new Date().getFullYear();

/* ══════════════════════════════════
   INIT
══════════════════════════════════ */
function init(){
  animes=DB.getAll();
  try{watched=JSON.parse(localStorage.getItem('animex_w')||'{}')}catch{}
  currentUser=UserDB.getSession();
  updateNavUser();
  renderHero();
  renderGrid('mainGrid',animes);
  renderFeatured();
  renderNewsBanner();
}

function saveWatched(){localStorage.setItem('animex_w',JSON.stringify(watched))}

/* ══════════════════════════════════
   MOBILE MENU
══════════════════════════════════ */
function toggleMobileMenu(){
  const m=document.getElementById('mobileMenu');
  const o=document.getElementById('mobileMenuOverlay');
  const open=m.classList.contains('open');
  if(open){closeMobileMenu();}
  else{m.classList.add('open');o.classList.add('open');}
}
function closeMobileMenu(){
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('mobileMenuOverlay').classList.remove('open');
}

/* ══════════════════════════════════
   NAV USER STATE
══════════════════════════════════ */
function updateNavUser(){
  const area=document.getElementById('nav-user-area');
  if(currentUser){
    const vipBadge=currentUser.vip?`<span class="nav-vip-badge">VIP</span>`:'';
    area.innerHTML=`
      <div class="nav-avatar" onclick="showPage('profile')">${currentUser.avatar}${vipBadge}</div>
      <button class="nav-user-btn" onclick="showPage('profile')">${currentUser.username}</button>
      <button class="nav-user-btn logout-btn" onclick="logout()">Salir</button>`;
  }else{
    area.innerHTML=`
      <button class="nav-user-btn" onclick="openAuthModal('login')">Entrar</button>
      <button class="nav-user-btn nav-register-btn" onclick="openAuthModal('register')">Registrarse</button>`;
  }
}

function logout(){
  UserDB.clearSession();currentUser=null;updateNavUser();showPage('home');toast('Sesión cerrada');
}

/* ══════════════════════════════════
   NEWS BANNER
══════════════════════════════════ */
function renderNewsBanner(){
  const news=NewsDB.get();
  const banner=document.getElementById('newEpBanner');
  if(!news||!news.title){banner.style.display='none';return;}
  banner.style.display='block';
  document.getElementById('newEpBannerTitle').textContent=news.title;
  const btn=document.getElementById('newEpBannerBtn');
  if(news.animeId){
    btn.style.display='';
    btn.onclick=()=>openDetail(news.animeId);
  }else{
    btn.style.display='none';
  }
}

/* ══════════════════════════════════
   FEATURED
══════════════════════════════════ */
function renderFeatured(){
  const ids=FeaturedDB.get();
  const featured=ids.map(id=>animes.find(a=>a.id===id)).filter(Boolean);
  const section=document.getElementById('featuredSection');
  const row=document.getElementById('featuredRow');
  if(!featured.length){section.style.display='none';return;}
  section.style.display='block';
  row.innerHTML=featured.map(a=>{
    const imgContent=a.cover&&a.cover.trim()
      ?`<img src="${a.cover}" alt="${a.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="fc-emoji" style="display:none;background:${a.bg||'#0a0a2e'}">${a.emoji||'◈'}</span>`
      :`<span class="fc-emoji" style="background:${a.bg||'#0a0a2e'}">${a.emoji||'◈'}</span>`;
    return`<div class="featured-card" onclick="openDetail('${a.id}')">
      <div class="featured-card-img" style="background:${a.bg||'#0a0a2e'}">${imgContent}</div>
      <div class="featured-card-info">
        <div class="featured-card-title">${a.title}</div>
        <div class="featured-card-sub">★ ${a.rating} · ${a.episodes.length} eps</div>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════
   AUTH MODAL
══════════════════════════════════ */
function openAuthModal(tab='login'){
  document.getElementById('auth-modal').classList.remove('hidden');
  switchAuthTab(tab);clearAuthErrors();
}
function closeAuthModal(){document.getElementById('auth-modal').classList.add('hidden');clearAuthErrors();}
function switchAuthTab(tab){
  document.querySelectorAll('.auth-tab').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('on'));
  document.getElementById('auth-tab-'+tab).classList.add('on');
  document.getElementById('auth-form-'+tab).classList.add('on');
}
function clearAuthErrors(){document.querySelectorAll('.auth-err').forEach(e=>{e.textContent='';e.style.display='none'})}

function doRegister(){
  const username=document.getElementById('reg-username').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value;
  const pass2=document.getElementById('reg-pass2').value;
  const err=document.getElementById('reg-err');
  if(!username||!email||!pass){err.textContent='Todos los campos son obligatorios';err.style.display='block';return}
  if(pass.length<4){err.textContent='La contraseña debe tener al menos 4 caracteres';err.style.display='block';return}
  if(pass!==pass2){err.textContent='Las contraseñas no coinciden';err.style.display='block';return}
  const res=UserDB.register(username,email,pass);
  if(!res.ok){err.textContent=res.msg;err.style.display='block';return}
  currentUser=res.user;UserDB.setSession(res.user);closeAuthModal();updateNavUser();
  toast('¡Bienvenido a AnimeX, '+username+'!');
}

function doUserLogin(){
  const username=document.getElementById('login-username').value.trim();
  const pass=document.getElementById('login-pass-user').value;
  const err=document.getElementById('login-user-err');
  if(!username||!pass){err.textContent='Completa todos los campos';err.style.display='block';return}
  const res=UserDB.login(username,pass);
  if(!res.ok){err.textContent=res.msg;err.style.display='block';return}
  currentUser=res.user;UserDB.setSession(res.user);closeAuthModal();updateNavUser();
  toast('¡Bienvenido de vuelta, '+res.user.username+'!');
}

/* ══════════════════════════════════
   VIP
══════════════════════════════════ */
function openVipModal(){
  if(!currentUser){openAuthModal('login');toast('Inicia sesión para activar VIP',true);return}
  document.getElementById('vip-modal').classList.remove('hidden');
  document.getElementById('vip-code-input').value='';
  document.getElementById('vip-err').style.display='none';
}
function closeVipModal(){document.getElementById('vip-modal').classList.add('hidden')}

function activateVip(){
  if(!currentUser){openAuthModal('login');toast('Inicia sesión primero',true);return}
  const input=document.getElementById('vip-code-input');
  const err=document.getElementById('vip-err');
  const code=input.value.trim().toUpperCase();
  err.style.display='none';
  const res=CodesDB.validate(code);
  if(!res.ok){err.textContent=res.msg;err.style.display='block';return}
  CodesDB.markUsed(code);
  const updated={...currentUser,vip:true,vipExpiry:res.expiry};
  UserDB.updateUser(updated);currentUser=updated;updateNavUser();
  closeVipModal();toast('¡VIP activado por '+res.days+' días! ♛');
}

function activateVipFromPage(){
  if(!currentUser){openAuthModal('login');toast('Inicia sesión primero',true);return}
  const input=document.getElementById('vip-page-code-input');
  const err=document.getElementById('vip-page-err');
  const code=input.value.trim().toUpperCase();
  err.style.display='none';
  const res=CodesDB.validate(code);
  if(!res.ok){err.textContent=res.msg;err.style.display='block';return}
  CodesDB.markUsed(code);
  const updated={...currentUser,vip:true,vipExpiry:res.expiry};
  UserDB.updateUser(updated);currentUser=updated;updateNavUser();
  input.value='';toast('¡VIP activado por '+res.days+' días! ♛');
  renderVipPage();renderProfile();
}

function isVip(){return currentUser&&currentUser.vip&&(!currentUser.vipExpiry||currentUser.vipExpiry>Date.now())}

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
function isNew(anime){return anime.year>=THIS_YEAR-1}

function coverHTML(a,fallbackSize='48px'){
  if(a.cover&&a.cover.trim()){
    return`<img src="${a.cover}" alt="${a.title}" style="width:100%;height:100%;object-fit:cover"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <span style="font-size:${fallbackSize};display:none;position:absolute;inset:0;align-items:center;justify-content:center;background:${a.bg||'#0a0a2e'}">${a.emoji||'◈'}</span>`;
  }
  return`<span style="font-size:${fallbackSize}">${a.emoji||'◈'}</span>`;
}

function getSeasons(anime){
  const s=new Set((anime.episodes||[]).map(e=>e.season||1));
  return[...s].sort((a,b)=>a-b);
}

function timeAgo(ts){
  const d=(Date.now()-ts)/1000;
  if(d<60)return'ahora';
  if(d<3600)return Math.floor(d/60)+'m';
  if(d<86400)return Math.floor(d/3600)+'h';
  return Math.floor(d/86400)+'d';
}

/* ══════════════════════════════════
   HERO
══════════════════════════════════ */
function renderHero(){
  if(!animes.length)return;
  // Buscar el primero que esté en destacados, si no el primero general
  const featuredIds=FeaturedDB.get();
  let a=featuredIds.length?animes.find(x=>x.id===featuredIds[0]):null;
  if(!a)a=animes[0];
  const c=document.getElementById('heroCover');
  c.style.background=a.bg||'#0a0a2e';
  c.innerHTML=coverHTML(a,'56px');
  document.getElementById('heroTitle').textContent=a.title;
  document.getElementById('heroDesc').textContent=a.desc;
  document.getElementById('heroBtn').onclick=()=>openDetail(a.id);
  document.getElementById('heroListBtn').onclick=()=>openDetail(a.id);
}

/* ══════════════════════════════════
   GRID
══════════════════════════════════ */
function renderGrid(id,list){
  document.getElementById(id).innerHTML=list.length
    ?list.map(a=>{
      const newBadge=isNew(a)?`<div class="new-badge">NUEVO</div>`:'';
      const vipBadge=a.vip?`<div class="vip-card-badge">VIP</div>`:'';
      const locked=a.vip&&!isVip();
      return`<div class="card ${locked?'card-locked':''}" onclick="${locked?'openVipModal()':'openDetail(\''+a.id+'\')'}">
        <div class="card-img" style="background:${a.bg||'#0a0a2e'}">${coverHTML(a,'40px')}${newBadge}${vipBadge}${locked?'<div class="card-lock-overlay"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>':''}</div>
        <div class="card-body">
          <div class="card-title">${a.title}</div>
          <div class="card-row"><span class="epb">Ep. ${a.episodes.length}</span><span class="ratb">★ ${a.rating}</span></div>
        </div>
      </div>`;
    }).join('')
    :'<p class="empty">No se encontraron resultados.</p>';
}

/* ══════════════════════════════════
   PAGES
══════════════════════════════════ */
function showPage(id){
  if((id==='community'||id==='profile'||id==='vip')&&!currentUser){
    openAuthModal('login');toast('Inicia sesión para acceder',true);return;
  }
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  document.querySelectorAll('.nav-links button').forEach(b=>b.classList.remove('on'));
  const nb=document.getElementById('nb-'+id);
  if(nb)nb.classList.add('on');
  if(id==='catalog')renderGrid('catGrid',animes);
  if(id==='community')renderCommunity();
  if(id==='profile')renderProfile();
  if(id==='vip')renderVipPage();
  window.scrollTo({top:0,behavior:'smooth'});
}

function filterGenre(el,genre){
  document.querySelectorAll('.gtag').forEach(g=>g.classList.remove('on'));
  el.classList.add('on');
  const list=genre==='todos'?animes:animes.filter(a=>(a.genres||[]).includes(genre));
  renderGrid('mainGrid',list);
}

function filterCards(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  const list=animes.filter(a=>a.title.toLowerCase().includes(q));
  const page=document.getElementById('catalog').classList.contains('on')?'catGrid':'mainGrid';
  renderGrid(page,list);
}

/* ══════════════════════════════════
   DETAIL
══════════════════════════════════ */
function openDetail(id){
  const a=animes.find(x=>x.id===id);
  if(!a)return;
  if(a.vip&&!isVip()){openVipModal();return}
  currentAnime=a;currentEpIdx=null;
  const c=document.getElementById('dCover');
  c.style.background=a.bg||'#0a0a2e';
  c.innerHTML=coverHTML(a,'72px');
  document.getElementById('dTitle').textContent=a.title;
  document.getElementById('dDesc').textContent=a.desc;
  document.getElementById('dEps').textContent=a.episodes.length;
  document.getElementById('dRating').textContent=a.rating;
  document.getElementById('dYear').textContent=a.year;
  document.getElementById('dStatus').textContent=a.status;
  document.getElementById('dTags').innerHTML=(a.genres||[]).map(g=>`<span class="gpill">${g}</span>`).join('');
  if(a.vip)document.getElementById('dTags').innerHTML+=`<span class="gpill vip-pill">VIP</span>`;
  document.getElementById('playerWrap').style.display='none';
  const seasons=getSeasons(a);
  currentSeason=seasons[0]||1;
  renderSeasonBar(seasons);
  renderEpsList();
  document.getElementById('detail-comm-btn').onclick=()=>{showPage('community');filterCommByAnime(id)};
  showPage('detail');
}

/* ══════════════════════════════════
   SEASON BAR
══════════════════════════════════ */
function renderSeasonBar(seasons){
  const bar=document.getElementById('seasonBar');
  if(seasons.length<=1){bar.style.display='none';return}
  bar.style.display='flex';
  bar.innerHTML=`<span class="season-bar-label">Temporada:</span>`+
    seasons.map(s=>`<button class="season-btn${s===currentSeason?' on':''}" onclick="selectSeason(${s})">T${s}</button>`).join('');
}

function selectSeason(s){
  currentSeason=s;
  document.querySelectorAll('.season-btn').forEach(b=>b.classList.toggle('on',b.textContent.trim()==='T'+s));
  document.getElementById('playerWrap').style.display='none';
  currentEpIdx=null;renderEpsList();
}

/* ══════════════════════════════════
   EPISODES LIST — con miniatura de portada
══════════════════════════════════ */
function renderEpsList(){
  if(!currentAnime)return;
  const w=watched[currentAnime.id]||[];
  const allEps=currentAnime.episodes;
  const seasons=getSeasons(currentAnime);
  const filtered=seasons.length>1?allEps.filter(ep=>(ep.season||1)===currentSeason):allEps;
  const globalIdxMap=filtered.map(ep=>allEps.indexOf(ep));
  const a=currentAnime;

  // Mini portada para los episodios
  const miniCover=a.cover&&a.cover.trim()
    ?`<img src="${a.cover}" alt="" style="width:52px;height:36px;object-fit:cover;border-radius:5px;flex-shrink:0" onerror="this.style.display='none'">`
    :`<span style="font-size:18px;flex-shrink:0">${a.emoji||'◈'}</span>`;

  document.getElementById('epsList').innerHTML=filtered.length
    ?filtered.map((ep,i)=>{
      const gi=globalIdxMap[i];
      return`<div class="ep-row ${w.includes(gi)?'watched':''} ${currentEpIdx===gi?'playing':''}" onclick="playEpByGlobalIdx(${gi})">
        ${miniCover}
        <span class="ep-num">Ep. ${ep.num}</span>
        <span class="ep-name">${ep.title||'Episodio '+ep.num}</span>
        ${ep.url?`<span class="ep-play-badge">▶ Ver</span>`:`<span class="ep-nourl">Sin link</span>`}
      </div>`;
    }).join('')
    :'<p style="color:var(--dim);font-size:13px">Sin episodios en esta temporada.</p>';
}

/* ══════════════════════════════════
   PLAYER
══════════════════════════════════ */
function playEpById(i){playEpByGlobalIdx(i)}

function playEpByGlobalIdx(gi){
  if(!currentAnime||!currentAnime.episodes[gi])return;
  if(!currentUser){openAuthModal('login');toast('Inicia sesión para ver episodios',true);return}
  const ep=currentAnime.episodes[gi];
  currentEpIdx=gi;
  if(!watched[currentAnime.id])watched[currentAnime.id]=[];
  if(!watched[currentAnime.id].includes(gi))watched[currentAnime.id].push(gi);
  saveWatched();
  const wrap=document.getElementById('playerWrap');
  const box=document.getElementById('playerBox');
  wrap.style.display='block';
  document.getElementById('playerLabel').textContent=`T${ep.season||1} · Ep ${ep.num} — ${ep.title||''}`;
  box.innerHTML='';
  if(ep.url&&ep.url.trim()){
    const ifr=document.createElement('iframe');
    ifr.src=ep.url.trim();
    ifr.allowFullscreen=true;
    ifr.allow='autoplay; fullscreen';
    ifr.style.cssText='width:100%;height:100%;border:none;display:block';
    box.appendChild(ifr);
  }else{
    box.innerHTML=`<div class="player-placeholder">
      <div class="play-circle"><svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg></div>
      <p class="no-url-msg">Sin link de video.<br>Agrégalo desde el <a href="#" onclick="showLoginAdmin();return false;" style="color:var(--pl)">panel admin</a>.</p>
    </div>`;
  }
  renderEpsList();
  wrap.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ══════════════════════════════════
   COMUNIDAD
══════════════════════════════════ */
function filterCommByAnime(id){commAnimeFilter=id;renderCommunity()}

function renderCommunity(){
  const posts=commAnimeFilter?CommDB.getForAnime(commAnimeFilter):CommDB.getAll();
  const anime=commAnimeFilter?animes.find(a=>a.id===commAnimeFilter):null;
  document.getElementById('comm-filter-label').textContent=anime?`Comentarios: ${anime.title}`:'Toda la comunidad';
  document.getElementById('comm-clear-filter').style.display=commAnimeFilter?'inline-flex':'none';
  document.getElementById('comm-anime-select').innerHTML=
    `<option value="">Todos los animes</option>`+
    animes.map(a=>`<option value="${a.id}"${a.id===commAnimeFilter?' selected':''}>${a.title}</option>`).join('');
  document.getElementById('comm-posts').innerHTML=posts.length
    ?posts.map(p=>{
      const liked=currentUser&&p.likes.includes(currentUser.id);
      const isOwn=currentUser&&p.userId===currentUser.id;
      const animeName=animes.find(a=>a.id===p.animeId)?.title||'';
      return`<div class="comm-post">
        <div class="comm-post-header">
          <div class="comm-avatar">${p.avatar}</div>
          <div class="comm-post-meta">
            <span class="comm-username">${p.username}</span>
            ${animeName&&!commAnimeFilter?`<span class="comm-anime-tag" onclick="filterCommByAnime('${p.animeId}')">${animeName}</span>`:''}
            <span class="comm-time">${timeAgo(p.date)}</span>
          </div>
          ${isOwn?`<button class="comm-del" onclick="deletePost('${p.id}')">✕</button>`:''}
        </div>
        <p class="comm-text">${escapeHtml(p.text)}</p>
        <div class="comm-actions">
          <button class="comm-like${liked?' liked':''}" onclick="likePost('${p.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${liked?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${p.likes.length}
          </button>
        </div>
      </div>`;
    }).join('')
    :'<p class="comm-empty">Sé el primero en comentar.</p>';
}

function escapeHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function submitPost(){
  if(!currentUser){openAuthModal('login');return}
  const text=document.getElementById('comm-input').value.trim();
  const animeId=document.getElementById('comm-anime-select').value;
  if(!text)return toast('Escribe algo primero',true);
  if(!animeId)return toast('Selecciona un anime',true);
  CommDB.add(animeId,currentUser.id,currentUser.username,currentUser.avatar,text);
  document.getElementById('comm-input').value='';
  commAnimeFilter=animeId;renderCommunity();
}

function likePost(id){
  if(!currentUser){openAuthModal('login');return}
  CommDB.toggleLike(id,currentUser.id);renderCommunity();
}

function deletePost(id){
  if(!currentUser)return;
  CommDB.delete(id,currentUser.id);renderCommunity();
}

function clearCommFilter(){commAnimeFilter=null;renderCommunity()}

/* ══════════════════════════════════
   PERFIL
══════════════════════════════════ */
function renderProfile(){
  if(!currentUser)return;
  const vipActive=isVip();
  const watched_count=Object.values(watched).reduce((s,arr)=>s+arr.length,0);
  const posts=CommDB.getAll().filter(p=>p.userId===currentUser.id);
  document.getElementById('profile-content').innerHTML=`
    <div class="profile-card">
      <div class="profile-avatar">${currentUser.avatar}${vipActive?'<div class="profile-vip-crown">♛</div>':''}
      </div>
      <div class="profile-info">
        <h2>${currentUser.username} ${vipActive?'<span class="vip-inline-badge">VIP</span>':''}</h2>
        <p style="color:var(--muted);font-size:13px">${currentUser.email}</p>
        <p style="color:var(--dim);font-size:12px;margin-top:4px">Miembro desde ${new Date(currentUser.joined).toLocaleDateString('es')}</p>
      </div>
    </div>
    <div class="profile-stats">
      <div class="pstat"><div class="pstat-val">${watched_count}</div><div class="pstat-lbl">Vistos</div></div>
      <div class="pstat"><div class="pstat-val">${posts.length}</div><div class="pstat-lbl">Comentarios</div></div>
      <div class="pstat"><div class="pstat-val">${vipActive?'Activo':'Free'}</div><div class="pstat-lbl">Plan</div></div>
    </div>
    ${!vipActive?`<button class="btn btn-vip" onclick="showPage('vip')" style="margin-top:16px">♛ Obtener VIP</button>`:`
      <div class="vip-active-banner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        VIP activo hasta ${new Date(currentUser.vipExpiry).toLocaleDateString('es')}
      </div>`}`;
}

/* ══════════════════════════════════
   VIP PAGE
══════════════════════════════════ */
function renderVipPage(){
  const vipAnimes=animes.filter(a=>a.vip);
  document.getElementById('vip-anime-count').textContent=vipAnimes.length;
}

/* ══════════════════════════════════
   LOGIN ADMIN
══════════════════════════════════ */
function showLoginAdmin(){
  document.getElementById('admin-auth-modal').classList.remove('hidden');
  document.getElementById('admin-login-user').value='';
  document.getElementById('admin-login-pass').value='';
  document.getElementById('admin-login-err').style.display='none';
  setTimeout(()=>document.getElementById('admin-login-user').focus(),100);
}

function doAdminLogin(){
  const u=document.getElementById('admin-login-user').value.trim();
  const p=document.getElementById('admin-login-pass').value.trim();
  const err=document.getElementById('admin-login-err');
  if(u===ADMIN_CREDS.user&&p===ADMIN_CREDS.pass){
    document.getElementById('admin-auth-modal').classList.add('hidden');
    openAdmin();
  }else{
    err.style.display='block';
    document.getElementById('admin-login-pass').value='';
    document.getElementById('admin-login-pass').focus();
  }
}

/* ══════════════════════════════════
   ADMIN: OPEN / CLOSE
══════════════════════════════════ */
function openAdmin(){
  animes=DB.getAll();
  renderAdminList();
  document.getElementById('admin-overlay').classList.add('on');
  document.body.style.overflow='hidden';
}

function closeAdmin(){
  document.getElementById('admin-overlay').classList.remove('on');
  document.body.style.overflow='';
  animes=DB.getAll();
  renderHero();renderFeatured();renderNewsBanner();
  renderGrid('mainGrid',animes);
  if(currentAnime){
    const fresh=animes.find(x=>x.id===currentAnime.id);
    if(fresh){currentAnime=fresh;renderSeasonBar(getSeasons(fresh));renderEpsList();}
  }
}

function switchATab(t){
  document.querySelectorAll('.atab-content').forEach(el=>el.classList.remove('on'));
  document.querySelectorAll('.atab').forEach(b=>b.classList.remove('on'));
  document.getElementById('atab-'+t).classList.add('on');
  const tabs=['alist','aadd','afeatured','acodes','anews','astats'];
  const idx=tabs.indexOf(t);
  document.querySelectorAll('.atab')[idx].classList.add('on');
  if(t==='astats')renderStats();
  if(t==='afeatured')renderFeaturedAdmin();
  if(t==='acodes')renderCodesAdmin();
  if(t==='anews')renderNewsAdmin();
}

/* ══════════════════════════════════
   ADMIN: LIST
══════════════════════════════════ */
function renderAdminList(){
  document.getElementById('adminAnimeList').innerHTML=animes.length
    ?animes.map(a=>{
      const seasons=getSeasons(a);
      const seasonInfo=seasons.length>1?` · ${seasons.length} temps`:'';
      const vipMark=a.vip?` · <span style="color:#f59e0b">VIP</span>`:'';
      const thumbHTML=a.cover&&a.cover.trim()
        ?`<img src="${a.cover}" alt="${a.title}" onerror="this.style.display='none'">`
        :`<span style="font-size:26px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${a.emoji||'◈'}</span>`;
      return`<div class="aitem">
        <div class="aitem-cover" style="background:${a.bg||'#0a0a2e'}">${thumbHTML}</div>
        <div class="aitem-info">
          <div class="aitem-title">${a.title}</div>
          <div class="aitem-meta">★ ${a.rating} · ${a.year} · ${a.status} · ${a.episodes.length} eps${seasonInfo}${vipMark}</div>
        </div>
        <div class="aitem-actions">
          <button class="btn btn-o btn-sm" onclick="startEdit('${a.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar
          </button>
          <button class="btn btn-r btn-sm" onclick="deleteAnime('${a.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`;
    }).join('')
    :'<p style="color:var(--dim);font-size:14px">Catálogo vacío.</p>';
}

/* ══════════════════════════════════
   ADMIN: EDIT
══════════════════════════════════ */
function startEdit(id){
  const a=animes.find(x=>x.id===id);
  if(!a)return;
  editingId=id;
  tempEps=JSON.parse(JSON.stringify(a.episodes));
  document.getElementById('editLabel').textContent='Editando: '+a.title;
  document.getElementById('e-title').value=a.title;
  document.getElementById('e-emoji').value=a.emoji;
  document.getElementById('e-cover').value=a.cover||'';
  document.getElementById('e-rating').value=a.rating;
  document.getElementById('e-year').value=a.year;
  document.getElementById('e-bg').value=a.bg;
  document.getElementById('e-status').value=a.status;
  document.getElementById('e-desc').value=a.desc;
  document.getElementById('e-vip').checked=!!a.vip;
  document.querySelectorAll('#e-genres .atag').forEach(el=>el.classList.toggle('on',(a.genres||[]).includes(el.dataset.g)));
  renderEpsAdmin();
  document.getElementById('editSection').style.display='block';
  document.getElementById('editSection').scrollIntoView({behavior:'smooth'});
}

function cancelEdit(){editingId=null;tempEps=[];document.getElementById('editSection').style.display='none'}

function saveEdit(){
  const idx=animes.findIndex(x=>x.id===editingId);
  if(idx<0)return;
  const a=animes[idx];
  a.title=document.getElementById('e-title').value.trim()||a.title;
  a.emoji=document.getElementById('e-emoji').value.trim()||a.emoji;
  a.cover=document.getElementById('e-cover').value.trim();
  a.rating=parseFloat(document.getElementById('e-rating').value)||a.rating;
  a.year=parseInt(document.getElementById('e-year').value)||a.year;
  a.bg=document.getElementById('e-bg').value;
  a.status=document.getElementById('e-status').value;
  a.desc=document.getElementById('e-desc').value;
  a.vip=document.getElementById('e-vip').checked;
  const gs=Array.from(document.querySelectorAll('#e-genres .atag.on')).map(el=>el.dataset.g);
  if(gs.length)a.genres=gs;
  DB.save(animes);renderAdminList();toast('Anime actualizado');
}

function deleteAnime(id){
  if(!confirm('¿Eliminar?'))return;
  animes=animes.filter(x=>x.id!==id);
  DB.save(animes);
  if(editingId===id)cancelEdit();
  renderAdminList();toast('Eliminado');
}

/* ══════════════════════════════════
   ADMIN: ADD
══════════════════════════════════ */
function addAnime(){
  const title=document.getElementById('a-title').value.trim();
  if(!title)return toast('El título es obligatorio',true);
  const count=parseInt(document.getElementById('a-epcount').value)||0;
  const id=title.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8)+'_'+Date.now().toString(36);
  const gs=Array.from(document.querySelectorAll('#a-genres .atag.on')).map(el=>el.dataset.g);
  const eps=Array.from({length:count},(_,i)=>({num:i+1,season:1,title:'Episodio '+(i+1),url:''}));
  animes.push({
    id,emoji:document.getElementById('a-emoji').value||'◈',
    cover:document.getElementById('a-cover').value.trim()||'',
    title,bg:document.getElementById('a-bg').value||'#0a0a2e',
    rating:parseFloat(document.getElementById('a-rating').value)||8.0,
    year:parseInt(document.getElementById('a-year').value)||2024,
    status:document.getElementById('a-status').value,
    vip:document.getElementById('a-vip').checked,
    genres:gs.length?gs:['accion'],
    desc:document.getElementById('a-desc').value||'Descripción próximamente.',
    episodes:eps
  });
  DB.save(animes);
  ['a-title','a-desc','a-cover'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('a-emoji').value='◈';
  document.getElementById('a-epcount').value='12';
  document.getElementById('a-vip').checked=false;
  document.querySelectorAll('#a-genres .atag').forEach(el=>el.classList.remove('on'));
  renderAdminList();switchATab('alist');toast('"'+title+'" agregado');
}

/* ══════════════════════════════════
   ADMIN: EPISODES
══════════════════════════════════ */
function renderEpsAdmin(){
  const maxSeason=tempEps.length?Math.max(...tempEps.map(e=>e.season||1)):1;
  document.getElementById('epsAdminList').innerHTML=tempEps.length
    ?tempEps.map((ep,i)=>{
      let opts='';for(let s=1;s<=Math.max(maxSeason,4);s++)opts+=`<option value="${s}"${(ep.season||1)===s?' selected':''}>T${s}</option>`;
      return`<div class="ep-admin-row">
        <span class="ep-num-b">Ep ${ep.num}</span>
        <select class="ep-season-sel">${opts}</select>
        <input class="ep-in ep-name-in" type="text" value="${ep.title||''}" placeholder="Nombre">
        <input class="ep-in ep-url-in" type="text" value="${ep.url||''}" placeholder="URL del video">
        <button class="ep-del" onclick="removeEp(${i})">✕</button>
      </div>`;
    }).join('')
    :'<p style="color:var(--dim);font-size:12px;padding:8px 0">Sin episodios.</p>';
}

function addEpRow(){
  const lastSeason=tempEps.length?(tempEps[tempEps.length-1].season||1):1;
  tempEps.push({num:tempEps.length+1,season:lastSeason,title:'',url:''});renderEpsAdmin();
}
function removeEp(i){tempEps.splice(i,1);tempEps.forEach((ep,j)=>ep.num=j+1);renderEpsAdmin()}

function bulkAdd(){
  const n=parseInt(document.getElementById('bulkCount').value)||0;
  const s=parseInt(document.getElementById('bulkSeason').value)||1;
  if(n<1)return toast('Ingresa un número',true);
  const start=tempEps.length+1;
  for(let i=0;i<n;i++)tempEps.push({num:start+i,season:s,title:'Episodio '+(start+i),url:''});
  renderEpsAdmin();toast(n+' episodios en T'+s);
}

function saveEps(){
  const idx=animes.findIndex(x=>x.id===editingId);
  if(idx<0)return;
  const rows=document.querySelectorAll('#epsAdminList .ep-admin-row');
  animes[idx].episodes=Array.from(rows).map((row,i)=>({
    num:i+1,
    season:parseInt(row.querySelector('.ep-season-sel').value)||1,
    title:row.querySelector('.ep-name-in').value.trim()||'Episodio '+(i+1),
    url:row.querySelector('.ep-url-in').value.trim()
  }));
  tempEps=JSON.parse(JSON.stringify(animes[idx].episodes));
  DB.save(animes);renderAdminList();toast('Episodios guardados');
}

/* ══════════════════════════════════
   ADMIN: DESTACADOS
══════════════════════════════════ */
function renderFeaturedAdmin(){
  const currentIds=FeaturedDB.get();
  document.getElementById('featured-admin-list').innerHTML=animes.map(a=>{
    const checked=currentIds.includes(a.id)?'checked':'';
    const thumbContent=a.cover&&a.cover.trim()
      ?`<img src="${a.cover}" alt="" onerror="this.style.display='none'">`
      :`<span>${a.emoji||'◈'}</span>`;
    return`<label class="featured-check-item">
      <input type="checkbox" value="${a.id}" ${checked} />
      <div class="fc-mini-img" style="background:${a.bg||'#0a0a2e'}">${thumbContent}</div>
      <span>${a.title}</span>
    </label>`;
  }).join('');
}

function saveFeatured(){
  const ids=Array.from(document.querySelectorAll('#featured-admin-list input[type=checkbox]:checked')).map(cb=>cb.value);
  FeaturedDB.save(ids);
  toast('Destacados guardados');
}

/* ══════════════════════════════════
   ADMIN: CÓDIGOS VIP
══════════════════════════════════ */
function generateVipCode(){
  const prefix=(document.getElementById('code-prefix').value.trim().toUpperCase()||'ANIMEX').replace(/[^A-Z0-9]/g,'');
  const days=parseInt(document.getElementById('code-days').value)||30;
  if(days<1||days>365)return toast('Días inválidos (1-365)',true);
  // Generar código aleatorio: PREFIX-XXXXXX
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand='';for(let i=0;i<6;i++)rand+=chars[Math.floor(Math.random()*chars.length)];
  const code=`${prefix}-${rand}`;
  CodesDB.add(code,days);
  renderCodesAdmin();
  toast('Código generado: '+code);
}

function renderCodesAdmin(){
  const codes=CodesDB.getAll();
  const container=document.getElementById('codes-list');
  if(!codes.length){container.innerHTML='<p style="color:var(--dim);font-size:13px">No hay códigos generados.</p>';return}
  container.innerHTML=codes.slice().reverse().map(c=>{
    const expired=c.expiry<Date.now();
    const used=c.used;
    let statusLabel='Activo';
    let statusClass='active';
    if(used){statusLabel='Usado';statusClass='expired';}
    else if(expired){statusLabel='Caducado';statusClass='expired';}
    return`<div class="code-item">
      <span class="code-val">${c.code}</span>
      <span class="code-expiry">Vence: ${new Date(c.expiry).toLocaleDateString('es')} · ${c.days}d</span>
      <span class="code-status ${statusClass}">${statusLabel}</span>
      <button class="code-del" onclick="deleteCode('${c.code}')" title="Eliminar">✕</button>
    </div>`;
  }).join('');
}

function deleteCode(code){
  if(!confirm('¿Eliminar código '+code+'?'))return;
  CodesDB.delete(code);renderCodesAdmin();toast('Código eliminado');
}

/* ══════════════════════════════════
   ADMIN: ANUNCIOS / NEWS BANNER
══════════════════════════════════ */
function renderNewsAdmin(){
  const news=NewsDB.get();
  // Populate anime select
  document.getElementById('news-anime-sel').innerHTML=
    `<option value="">— Sin enlace —</option>`+
    animes.map(a=>`<option value="${a.id}"${news&&news.animeId===a.id?' selected':''}>${a.title}</option>`).join('');
  if(news){
    document.getElementById('news-title').value=news.title||'';
  }
}

function saveNewsBanner(){
  const title=document.getElementById('news-title').value.trim();
  const animeId=document.getElementById('news-anime-sel').value||null;
  if(!title)return toast('Escribe el texto del anuncio',true);
  NewsDB.save({title,animeId});
  toast('Anuncio publicado');
}

function clearNewsBanner(){
  NewsDB.clear();
  document.getElementById('news-title').value='';
  toast('Banner eliminado');
}

/* ══════════════════════════════════
   ADMIN: STATS
══════════════════════════════════ */
function renderStats(){
  const totalEps=animes.reduce((s,a)=>s+a.episodes.length,0);
  const withUrl=animes.reduce((s,a)=>s+a.episodes.filter(e=>e.url).length,0);
  const avg=animes.length?(animes.reduce((s,a)=>s+a.rating,0)/animes.length).toFixed(1):0;
  const users=UserDB.getAll();
  const vipUsers=users.filter(u=>u.vip).length;
  const codes=CodesDB.getAll();
  const activeCodes=codes.filter(c=>!c.used&&c.expiry>Date.now()).length;
  document.getElementById('statsGrid').innerHTML=`
    <div class="scard"><div class="scard-val">${animes.length}</div><div class="scard-lbl">Animes</div></div>
    <div class="scard"><div class="scard-val">${totalEps}</div><div class="scard-lbl">Episodios</div></div>
    <div class="scard"><div class="scard-val">${withUrl}</div><div class="scard-lbl">Con video</div></div>
    <div class="scard"><div class="scard-val">${users.length}</div><div class="scard-lbl">Usuarios</div></div>
    <div class="scard"><div class="scard-val">${vipUsers}</div><div class="scard-lbl">VIP activos</div></div>
    <div class="scard"><div class="scard-val">★ ${avg}</div><div class="scard-lbl">Rating prom.</div></div>
    <div class="scard"><div class="scard-val">${codes.length}</div><div class="scard-lbl">Códigos totales</div></div>
    <div class="scard"><div class="scard-val">${activeCodes}</div><div class="scard-lbl">Códigos activos</div></div>`;
}

function resetDB(){
  if(!confirm('¿Resetear toda la base de datos?'))return;
  localStorage.removeItem('animex_db');
  animes=DB.getAll();renderAdminList();toast('Reseteada');
}

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
function toggleATag(el){el.classList.toggle('on')}

function toast(msg,err=false){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.className='toast'+(err?' err':'')+' on';
  setTimeout(()=>t.classList.remove('on'),2600);
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('admin-auth-modal').classList.add('hidden');
    document.getElementById('vip-modal').classList.add('hidden');
    if(document.getElementById('admin-overlay').classList.contains('on'))closeAdmin();
    closeMobileMenu();
  }
});

init();
