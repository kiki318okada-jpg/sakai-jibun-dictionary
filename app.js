const CFG=window.JIBUN_CONFIG,PARAMS=new URLSearchParams(location.search),SCHOOL=(PARAMS.get("school")||"unknown"),K="sakai_jibun_v2_"+SCHOOL;if(PARAMS.get("reset")==="1"){localStorage.removeItem(K);history.replaceState(null,"",location.pathname+"?school="+encodeURIComponent(SCHOOL))}const blank={step:0,w1:{person:"",reasonType:"",reason:""},w2:{interest:"",like:"",experience:"",moyamoya:""},w3:{key:"",why1:""},w4:{why2:""},final:{statement:""}};let s;try{s=JSON.parse(localStorage.getItem(K)||"{}")}catch(e){s={}};s={...blank,...s,w1:{...blank.w1,...(s.w1||{})},w2:{...blank.w2,...(s.w2||{})},w3:{...blank.w3,...(s.w3||{})},w4:{...blank.w4,...(s.w4||{})},final:{...blank.final,...(s.final||{})}};if(!s.w4.why2&&s.w3.why2)s.w4.why2=s.w3.why2;if(!s.w4.why2&&s.w4.discovery)s.w4.why2=s.w4.discovery;
const L={interest:"気になる",like:"好き・詳しい",experience:"経験",moyamoya:"モヤモヤ"},P=["レンタルなんもしない人","香り演出家｜郡 香苗さん","腸内細菌研究者｜菅沼 名津季さん","共有するセルフケアアプリ運営者｜森本 陽加里さん","寿司リーマン｜瀧本 伸哉さん","アートとまちの仕掛け人 × 一級建築士｜田村 晟一朗さん","映像クリエイター｜立花 駿さん","浅煎りコーヒー×教育の社会起業家｜中村 千尋さん","吹奏楽の未来をつくるプロデューサー｜伊東 結菜さん","水辺のいのちを守る活動家｜すがわらえみさん"],R=["やっていること","考え方","生き方・働き方","自分と似ているところ","自分にはないところ","なんとなく"],e=x=>(x||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
let syncTimer=null,syncInFlight=false,syncQueued=false;
async function syncNow(){
  if(syncTimer){clearTimeout(syncTimer);syncTimer=null}
  if(syncInFlight){syncQueued=true;return}
  syncInFlight=true;
  try{await saveRemote(s)}
  catch(err){console.warn(err)}
  finally{
    syncInFlight=false;
    if(syncQueued){syncQueued=false;syncSoon()}
  }
}
function syncSoon(){
  if(syncTimer)clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{syncTimer=null;syncNow()},1500)
}
function save(){
  localStorage.setItem(K,JSON.stringify(s));
  syncSoon();
  let x=document.querySelector("#status");
  if(x){x.textContent="この端末に保存しました ✓";setTimeout(()=>x.textContent="この端末に自動保存されます",900)}
}function field(a,b,v){s[a][b]=v;save()}
function validationMessage(){let m="";
 if(s.step===1&&!s.w1.person)m="「なぜか気になる人」を1人選んでください。";
 else if(s.step===1&&!s.w1.reasonType)m="気になった理由に近いものを1つ選んでください。";
 else if(s.step===2&&!Object.values(s.w2).some(v=>String(v||"").trim()))m="4つのうち、どれか1つ以上書いてみてください。";
 else if(s.step===3&&!s.w3.key)m="「もう少し考えてみたい」ものを1つ選んでください。";
 else if(s.step===3&&!String(s.w3.why1||"").trim())m="選んだものについて「なんで？」を1つ書いてください。";
 else if(s.step===4&&!String(s.w4.why2||"").trim())m="相手にもう一度「なんで？」と聞かれて答えたことを書いてください。";
 else if(s.step===5&&!String(s.final.statement||"").trim())m="最後に「私って、もしかすると…」を自分の言葉で書いてみてください。";
 return m}
async function next(){const m=validationMessage();if(m){const x=document.querySelector("#validation");if(x){x.textContent=m;x.scrollIntoView({behavior:"smooth",block:"center"})}return}await syncNow();step(s.step+1)}
function step(n){s.step=n;save();render();scrollTo(0,0)}
function back(){if(s.step>0)step(s.step-1)}
function person(x){s.w1.person=x;save();render()}
function reasonType(x){s.w1.reasonType=x;save();render()}
function deep(x){s.w3.key=x;save();render()}
function btn(){return '<div id="validation" class="validation"></div><button class="primary" onclick="next()">保存して次へ →</button>'}
function home(){return '<div class=k>WELCOME</div><h1>自分の知らなかった<br>「自分」を集めよう。</h1><p class=lead>今日は、将来の夢や進路を決める日ではありません。いろんな人の生き方をヒントに、自分の中にある材料を集めて「ジブン辞典」の最初の1ページをつくります。</p><div class=card><b>このページについて</b><p>回答はこの端末の同じブラウザから、いつでも見直し・修正できます。名前やメールアドレスの入力はありません。</p></div><button class=primary onclick="step(1)">ジブン辞典をはじめる →</button>'}
function w1(){return '<div class=k>WORK 01</div><h1>「なぜか気になる人」を<br>1人探す。</h1><p class=lead>10人すべてをじっくり読む必要はありません。まずはざっと眺めて、「ん？」「なんか気になる」と思った人を探してみよう。</p><a class=secondary target="_blank" href="'+(CFG.links.casebook||'#')+'">働き方事例集をひらく ↗</a><label>Q1｜「なぜか気になる人」は？</label><div class=grid>'+P.map(x=>'<button class="choice '+(s.w1.person===x?'sel':'')+'" onclick=\'person('+JSON.stringify(x)+')\'>'+e(x)+'</button>').join("")+'</div><label>Q2｜なぜ、その人が気になった？</label><p class=hint>いちばん近いものを1つ選んでください。</p><div class=grid>'+R.map(x=>'<button class="choice '+(s.w1.reasonType===x?'sel':'')+'" onclick=\'reasonType('+JSON.stringify(x)+')\'>'+e(x)+'</button>').join("")+'</div><label>Q3｜もう少しだけ教えてください。なぜそう思った？</label><p class=hint>うまく言葉にできなくても大丈夫。「なんとなく○○だと思った」でもOK。</p><textarea oninput="field(\'w1\',\'reason\',this.value)">'+e(s.w1.reason)+'</textarea>'+btn()}
function w2(){let q=[["interest","① 気になる","最近、つい見たり調べたりしてしまうことは？","たとえば：ゲーム、服、音楽、スポーツ、動画、食べ物……。「最近なんとなく見てる」でもOK"],["like","② 好き・詳しい","好きでよくやること、気づいたらちょっと詳しくなっていることは？","たとえば：ゲームの攻略、絵を描く、メイク、電車、音楽、友達の相談を聞く……。人よりすごくなくてOK"],["experience","③ 経験","今まで、続けてきたこと・頑張ったこと・よくやってきたことは？","たとえば：部活を続けた、文化祭で役割を担当した、毎日絵を描いている、家で弟や妹の面倒を見る……。学校以外でもOK"],["moyamoya","④ モヤモヤ","「なんでこうなの？」「もっとこうだったらいいのに」と思うことは？","たとえば：朝が早い、ゴミが多い、予定が合わない、使いにくいものがある……。小さなことでOK"]];return '<div class=k>WORK 02</div><h1>自分の中にある<br>4つの材料を集める。</h1><p class=lead>「すごいこと」は書かなくてOK。普通すぎて、自分では気づいていないことが大事。</p>'+q.map(([k,t,p,h])=>'<div class=card><label>'+t+'</label><p>'+p+'</p><p class=hint>'+h+'</p><textarea oninput="field(\'w2\',\''+k+'\',this.value)">'+e(s.w2[k])+'</textarea></div>').join("")+'<p class=hint>全部きれいに埋まらなくても大丈夫です。</p>'+btn()}
function w3(){let o=Object.keys(L).filter(k=>s.w2[k]),k=s.w3.key,ch=k?s.w2[k]:"";return '<div class=k>WORK 03</div><h1>ひとつ選んで、<br>もう少し深ぼる。</h1><p class=lead>4つの中から「もう少し考えてみたい」ものを1つ選ぼう。一番すごいものを選ばなくてOK。なんとなく気になるものでもOK。</p><div class=grid>'+o.map(x=>'<button class="choice '+(k===x?'sel':'')+'" onclick="deep(\''+x+'\')"><small>'+L[x]+'</small><br><b>'+e(s.w2[x])+'</b></button>').join("")+'</div>'+(ch?'<div class=card><div class=answer>'+e(ch)+'</div><label>なんで？</label><p class=hint>例：「ゲームが好き」→「攻略するのが楽しいから」</p><textarea oninput="field(\'w3\',\'why1\',this.value)">'+e(s.w3.why1)+'</textarea></div>':'')+btn()}
function w4(){let chosen=s.w3.key?s.w2[s.w3.key]:"";return '<div class=k>WORK 04</div><h1>隣の人に、<br>もう一回聞いてもらう。</h1><div class=card><p><b>①</b> 自分が選んだものと、「なんで？」の答えを伝える<br><b>②</b> 相手はもう一度だけ「それって、なんで？」と聞く<br><b>③</b> 思ったことを、そのまま答える</p><p class=hint>1人2分 → 交代</p></div><div class=answer><small>選んだもの</small>'+e(chosen)+'</div><div class=answer><small>自分で考えた「なんで？」</small>'+e(s.w3.why1)+'</div><label>相手にもう一度「なんで？」と聞かれて、何と答えた？</label><p class=hint>例：「できなかったことが、できるようになるのが嬉しいからかも」</p><textarea oninput="field(\'w4\',\'why2\',this.value)">'+e(s.w4.why2)+'</textarea>'+btn()}
function finalp(){let chosen=s.w3.key?s.w2[s.w3.key]:"";return '<div class=k>MY ジブン辞典</div><h1>今日見つけた、<br>自分の材料。</h1><div class=card><h2>なぜか気になった人</h2><b>'+e(s.w1.person)+'</b><div class=answer><small>気になった理由</small>'+e(s.w1.reasonType)+'</div><p>'+e(s.w1.reason)+'</p></div><div class=card><h2>自分の中にあった4つ</h2>'+Object.keys(L).map(k=>'<div class=answer><small>'+L[k]+'</small>'+e(s.w2[k])+'</div>').join("")+'</div><div class=card><h2>深ぼって見つけたこと</h2><div class=answer><small>選んだもの</small>'+e(chosen)+'</div><div class=answer><small>なんで？</small>'+e(s.w3.why1)+'</div><div class=answer><small>もう一度「なんで？」</small>'+e(s.w4.why2)+'</div></div><div class=card><h2>ジブン辞典</h2><p class=hint>最初に書いたものと、「なんで？」を重ねた答えを見てみよう。</p><label>私って、もしかすると……</label><input value="'+e(s.final.statement)+'" oninput="field(\'final\',\'statement\',this.value)" placeholder="＿＿＿＿＿＿が好き／気になる人かも"></div>'+btn()}
function nextp(){return '<div class=k>NEXT</div><h1>「自分を知る」から、<br>「自分を使ってみる」へ。</h1><div class=card><a class=primary target="_blank" href="'+(CFG.links.twoDayFlyer||'#')+'">2DAY PROGRAMを見る ↗</a></div><div class=card><a class=secondary target="_blank" href="'+(CFG.links.survey||'#')+'">アンケートに回答する ↗</a></div>'}
function render(){
  const view=[home,w1,w2,w3,w4,finalp,nextp][s.step]||home;
  const bar=document.querySelector("#bar");
  const backBtn=document.querySelector("#backButton");
  const app=document.querySelector("#app");
  if(bar)bar.style.width=(s.step/6*100)+"%";
  if(backBtn)backBtn.style.visibility=s.step?"visible":"hidden";
  if(app)app.innerHTML=view();
}
window.JIBUN_START=function(){step(1)};
document.querySelector("#backButton")?.addEventListener("click",back);
if(s.step>0)render();
function keepInputVisible(el){
  if(!el||!el.matches("textarea,input"))return;
  setTimeout(()=>{try{el.scrollIntoView({behavior:"smooth",block:"center"})}catch(e){}},250);
  setTimeout(()=>{try{el.scrollIntoView({behavior:"smooth",block:"center"})}catch(e){}},650);
}
document.addEventListener("focusin",e=>keepInputVisible(e.target));
if(window.visualViewport){
  let lastH=window.visualViewport.height;
  window.visualViewport.addEventListener("resize",()=>{
    const h=window.visualViewport.height;
    document.documentElement.style.setProperty("--vvh",h+"px");
    if(h<lastH-80){
      const el=document.activeElement;
      if(el&&el.matches("textarea,input"))keepInputVisible(el);
    }
    lastH=h;
  });
}
