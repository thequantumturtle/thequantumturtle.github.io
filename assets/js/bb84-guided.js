/* BB84 guided learning lab. This is an idealized classical simulation, NOT secure QKD. */
(() => {
"use strict";
const $ = id => document.getElementById(id);
const PROJECT = "https://mzwzbhfnuurruyaoynmr.supabase.co";
const PUBLIC_KEY = "sb_publishable_Dkj7DX0XUlBeYnIte-IrKw_I-_9Y31T";
const rand = () => crypto.getRandomValues(new Uint32Array(1))[0] & 1;
const roomToken = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2,"0")).join("");
const validRoom = value => /^[a-f0-9]{32}$/.test(value);
function parseRoom(input) {
 const value = String(input||"").trim().toLowerCase();
 if(validRoom(value))return value;
 try {
  const url = new URL(value);
  if(url.origin !== location.origin || !/^\/learn\/bb84\/?$/.test(url.pathname))return "";
  const code = url.searchParams.get("room")||"";
  return validRoom(code)?code:"";
 }catch(e){return "";}
}
let mode="solo", role="alice", room="", channel=null, client=null, connected=false;
let n=8, phase="setup", turn=0, eve=false;
let aliceBits=[], aliceBases=[], bobBases=[], bobBits=[], publishedAliceBases=false, publishedBobBases=false, tested=[];
const show = (id,on=true) => $(id).classList.toggle("hidden",!on);
const text = (id,value) => {$(id).textContent=String(value);};
const say = (message,warning=false)=>{$("bb-notice").textContent=message;$("bb-notice").className="bb-notice"+(warning?" warning":"");};
function updateHeader(){
 text("bb-phase", phase==="setup"?"Set up":phase==="sending"?"Send and measure":phase==="sifting"?"Compare bases":phase==="testing"?"Check errors":"Keep the key");
 text("bb-round", phase==="sending"?"Qubit "+(turn+1)+" of "+n:n+" qubits");
 text("bb-role",mode==="solo"?"Solo · switch roles":role==="alice"?"Alice · sender":"Bob · receiver");
}
function view() {
 updateHeader();
 show("bb-setup",phase==="setup");
 show("bb-work",phase!=="setup");
 show("bb-alice",phase==="sending"&&(mode==="solo"?["alice-prepare","alice-next"].includes(step):role==="alice"));
 show("bb-bob",phase==="sending"&&(mode==="solo"?["bob-measure","bob-next"].includes(step):role==="bob"));
 show("bb-sift",phase==="sifting");
 show("bb-check",phase==="testing");
 show("bb-final",phase==="done");
 show("bb-alice-prepare",step==="alice-prepare");
 show("bb-alice-next",step==="alice-next");
 show("bb-bob-measure",step==="bob-measure");
 show("bb-bob-next",step==="bob-next");
 $("bb-alice-send").disabled=step!=="alice-prepare";
 $("bb-bob-plus").disabled=step!=="bob-measure";
 $("bb-bob-cross").disabled=step!=="bob-measure";
 text("bb-bob-message",step==="bob-measure"?"Alice has sent a hidden qubit. Pick a measurement basis.":step==="bob-next"?"Measured "+bobBits[turn]+". Now move to the next qubit.":"Wait for Alice to prepare the next qubit.");
 renderHistory();
}
let step="alice-prepare";
function reset(count=8,attack=false) {
 n=count;eve=attack;turn=0;phase="sending";step="alice-prepare";
 aliceBits=[];aliceBases=[];bobBits=[];bobBases=[];publishedAliceBases=false;publishedBobBases=false;tested=[];
 if(mode==="solo"||role==="alice"){say("Alice: pick a bit and a basis for qubit 1.");}
 else{step="waiting";say("Waiting for Alice to prepare qubit 1.");}
 view();
}
function transition(event,payload={}) {
 if(mode==="solo"){receive(event,{...payload});return Promise.resolve(true);}
 if(!connected||!channel){say("Connection lost. Wait for the room to reconnect.",true);return Promise.resolve(false);}
 return channel.send({type:"broadcast",event,payload:{v:3,room,...payload}}).then(x=>{if(x!=="ok"){say("Message was not confirmed. Try again.",true);return false;}return true;}).catch(()=>{say("Couldn't send. Check the connection.",true);return false;});
}
function measure(bit,sourceBasis,chosenBasis) {
 let b=bit, basis=sourceBasis;
 if(eve) {const e=rand()===0?"+":"×";b=e===basis?b:rand();basis=e;}
 return chosenBasis===basis?b:rand();
}
async function sendQubit(){
 if(phase!=="sending"||step!=="alice-prepare")return;
 const bit=Number(document.querySelector('input[name="bb-bit"]:checked').value);
 const basis=document.querySelector('input[name="bb-basis"]:checked').value;
 aliceBits.push(bit);aliceBases.push(basis);
 step="waiting";view();
 const ok=await transition("prepared",{i:turn});
 if(!ok&&mode==="live"){aliceBits.pop();aliceBases.pop();step="alice-prepare";view();return;}
 say("Qubit "+(turn+1)+" sent. Bob chooses a measurement basis without seeing Alice's choice.");
}
async function chooseBasis(b){
 if(phase!=="sending"||step!=="bob-measure")return;
 bobBases.push(b);step="waiting";view();
 const ok=await transition("chosen",{i:turn,basis:b});
 if(!ok&&mode==="live"){bobBases.pop();step="bob-measure";view();}
}
async function nextRound(){
 if(phase!=="sending"||step!=="bob-next")return;
 step="waiting";view();
 const ok=await transition("advance",{i:turn});
 if(!ok&&mode==="live"){step="bob-next";view();}
}
function finishRounds(){
 phase="sifting";step="sift";
 say("Now Alice and Bob can publicly compare their bases. Do not reveal the bits.");
 renderSifting();view();
}
function receive(event,p) {
 if(!p||p.v!==3&&mode==="live"||mode==="live"&&p.room!==room)return;
 if(event==="hello"&&role==="alice"&&connected){transition("welcome",{n,eve,phase,turn,step});return;}
 if(event==="welcome"&&role==="bob"&&phase==="setup"){
   reset(p.n,p.eve);say("Joined Alice's room. Waiting for qubit 1.");return;
 }
 if(event==="start"&&role==="bob"){reset(p.n,p.eve);return;}
 if(event==="prepared"&&((mode==="solo")||role==="bob")&&phase==="sending"&&p.i===turn){
   step="bob-measure";say("Qubit "+(turn+1)+" arrived. Bob: choose + or ×.");view();return;
 }
 if(event==="chosen"&&((mode==="solo")||role==="alice")&&phase==="sending"&&p.i===turn&&["+", "×"].includes(p.basis)&&bobBits.length===turn){
   const value=measure(aliceBits[turn],aliceBases[turn],p.basis);
   // In solo, Bob's basis was already stored by chooseBasis.
   if(mode!=="solo")bobBases.push(p.basis);
   bobBits.push(value);step="waiting";view();
   transition("measured",{i:turn,bit:value});
   return;
 }
 if(event==="measured"&&((mode==="solo")||role==="bob")&&phase==="sending"&&p.i===turn&&(p.bit===0||p.bit===1)){
   if(mode!=="solo")bobBits.push(p.bit);
   step="bob-next";say("Bob measured "+p.bit+". Alice's bit and basis are still secret.");view();return;
 }
 if(event==="advance"&&((mode==="solo")||role==="alice")&&phase==="sending"&&p.i===turn){
   if(turn+1===n){transition("rounds-finished");finishRounds();}
   else{turn++;step="alice-prepare";transition("next-ready",{i:turn});say("Alice: prepare qubit "+(turn+1)+".");view();}
   return;
 }
 if(event==="next-ready"&&role==="bob"&&phase==="sending"&&p.i===turn+1){turn++;step="waiting";view();return;}
 if(event==="rounds-finished"&&role==="bob"){finishRounds();return;}
 if(event==="bob-bases"&&((mode==="solo")||role==="alice")&&phase==="sifting"&&validBases(p.bases)){
   if(mode!=="solo")bobBases=p.bases.slice();
   publishedBobBases=true;renderSifting();say("Bob has shared his bases. Alice can share hers.");view();return;
 }
 if(event==="alice-bases"&&((mode==="solo")||role==="bob")&&phase==="sifting"&&validBases(p.bases)){
   if(mode!=="solo")aliceBases=p.bases.slice();
   publishedAliceBases=true;renderSifting();say("Both basis lists are public. Keep only the matching rounds.");view();return;
 }
 if(event==="sample"&&((mode==="solo")||role==="bob")&&phase==="testing"&&Array.isArray(p.indices)&&Array.isArray(p.bits)){
   const allowed=matchingIndices();
   if(p.indices.length!==p.bits.length||p.indices.some((x,i)=>!Number.isInteger(x)||!allowed.includes(x)||p.indices.indexOf(x)!==i||![0,1].includes(p.bits[i])))return;
   tested=p.indices.slice();renderSample(p.indices,p.bits);return;
 }
 if(event==="complete"&&role==="bob"&&phase==="testing"){finishKey();return;}
}
function validBases(v){return Array.isArray(v)&&v.length===n&&v.every(b=>b==="+"||b==="×");}
function matchingIndices(){return Array.from({length:n},(_,i)=>i).filter(i=>aliceBases[i]===bobBases[i]);}
function renderHistory(){
 const target=$("bb-history");target.replaceChildren();
 const rows=mode==="solo"?Math.min(aliceBits.length,bobBases.length):role==="alice"?aliceBits.length:bobBases.length;
 text("bb-progress",rows+" / "+n+" qubits");
 for(let i=0;i<n;i++){
   const tile=document.createElement("span");tile.className="bb-dot"+(i<rows?" completed":"")+(i===turn&&phase==="sending"?" active":"");
   tile.textContent=String(i+1);target.append(tile);
 }
}
function renderSifting(){
 text("bb-basis-status",publishedBobBases?(publishedAliceBases?"Both basis lists are public.":"Bob has shared bases; waiting for Alice."):"Bob shares bases first, then Alice.");
 show("bb-share-bob",!publishedBobBases&&(mode==="solo"||role==="bob"));
 show("bb-share-alice",publishedBobBases&&!publishedAliceBases&&(mode==="solo"||role==="alice"));
 show("bb-sift-continue",publishedBobBases&&publishedAliceBases&&(mode==="solo"||role==="alice"));
 const target=$("bb-basis-table");target.replaceChildren();
 if(!(publishedBobBases&&publishedAliceBases))return;
 const table=document.createElement("table");table.innerHTML="<thead><tr><th>Qubit</th><th>Alice basis</th><th>Bob basis</th><th>Keep?</th></tr></thead>";
 const body=document.createElement("tbody");for(let i=0;i<n;i++){const tr=document.createElement("tr");const match=aliceBases[i]===bobBases[i];tr.className=match?"keep":"drop";for(const x of [i+1,aliceBases[i],bobBases[i],match?"Yes":"No"]){const td=document.createElement("td");td.textContent=x;tr.append(td)}body.append(tr)}table.append(body);target.append(table);
 text("bb-sift-count",matchingIndices().length+" of "+n+" bases matched.");
}
async function publishBob(){
 if(phase!=="sifting"||publishedBobBases||bobBases.length!==n)return;
 publishedBobBases=true;renderSifting();
 await transition("bob-bases",{bases:bobBases.slice()});
 if(mode==="solo"){receive("bob-bases",{bases:bobBases.slice()});}
}
async function publishAlice(){
 if(phase!=="sifting"||!publishedBobBases||publishedAliceBases||aliceBases.length!==n)return;
 publishedAliceBases=true;renderSifting();
 await transition("alice-bases",{bases:aliceBases.slice()});
 if(mode==="solo"){receive("alice-bases",{bases:aliceBases.slice()});}
}
function startTesting(){if(!publishedAliceBases||!publishedBobBases||phase!=="sifting")return;phase="testing";renderSampleChooser();view();transition("test-start");say("Choose some matching-basis rounds to check for errors. Checked bits are discarded.");}
function renderSampleChooser(){
 const holder=$("bb-sample-choices");holder.replaceChildren();
 const matched=matchingIndices();
 text("bb-matches",matched.length+" matching-basis rounds");
 for(const i of matched){const label=document.createElement("label");label.className="bb-sample-option";const chk=document.createElement("input");chk.type="checkbox";chk.value=i;chk.name="bb-sample";const s=document.createElement("span");s.textContent="Qubit "+(i+1);label.append(chk,s);holder.append(label);}
 show("bb-sample-controls",mode==="solo"||role==="alice");
 show("bb-sample-report",false);
 if(!matched.length){text("bb-sample-instructions","No bases matched. Start over to try again.");$("bb-publish-sample").disabled=true;}
 else {text("bb-sample-instructions","Alice: select one or more matching rounds to reveal. These bits will not be used in the key.");$("bb-publish-sample").disabled=false;}
}
function renderSample(indices,bits){
 tested=indices.slice();
 const rows=indices.map((i,k)=>({i,a:bits[k],b:bobBits[i]}));
 const errors=rows.filter(x=>x.a!==x.b).length;
 text("bb-sample-report-text",indices.length+" tested bits · "+errors+" mismatches · "+Math.round(100*errors/indices.length)+"% sample error.");
 show("bb-sample-report");
 show("bb-sample-controls",false);
 show("bb-finish",mode==="solo"||role==="alice");
 say("Error check complete. Tested bits are discarded. The remaining matching rounds are candidate key bits.");
}
async function publishSample(){
 const checked=Array.from(document.querySelectorAll('input[name="bb-sample"]:checked'),x=>Number(x.value));
 if(!checked.length){say("Choose at least one matching round to test.",true);return;}
 const bits=checked.map(i=>aliceBits[i]);
 renderSample(checked,bits);
 await transition("sample",{indices:checked,bits});
}
function finishKey(){
 phase="done";view();
 const usable=matchingIndices().filter(i=>!tested.includes(i));
 const source=mode==="solo"?"both":role;
 text("bb-key-label",source==="both"?"Alice's and Bob's remaining bits":source==="alice"?"Alice's remaining bits":"Bob's remaining bits");
 text("bb-key",usable.length?(source==="bob"?usable.map(i=>bobBits[i]).join(""):usable.map(i=>aliceBits[i]).join("")):"No candidate bits remain.");
 if(source==="both")text("bb-key-extra","Bob: "+(usable.length?usable.map(i=>bobBits[i]).join(""):"(none)")+". Compare the two lists. If they differ, the key must not be used.");
 else text("bb-key-extra","Only your own remaining bits are shown. A real protocol needs error correction, privacy amplification, and authentication.");
 text("bb-final-count",usable.length+" unrevealed, matching-basis bits remain.");
 say("Finished! You followed all four learning stages of BB84.");
}
async function connect(kind, id){
 if(!window.supabase?.createClient){say("Live connection library failed to load. Try reloading.",true);return;}
 await leave(false);
 mode="live";role=kind;room=id;connected=false;phase="setup";step="waiting";
 text("bb-invite",location.origin+location.pathname+"?room="+room);
 show("bb-setup",false);show("bb-live-invite",kind==="alice");show("bb-work",true);
 updateHeader();say("Connecting...");
 if(!client)client=window.supabase.createClient(PROJECT,PUBLIC_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 channel=client.channel("bb84-guided-"+room,{config:{broadcast:{ack:true,self:false}}});
 for(const evt of ["hello","welcome","start","prepared","chosen","measured","advance","next-ready","rounds-finished","bob-bases","alice-bases","test-start","sample","complete"]){
  channel.on("broadcast",{event:evt},({payload})=>{
   if(!payload||payload.v!==3||payload.room!==room)return;
   if(evt==="test-start"&&role==="bob"&&phase==="sifting"){phase="testing";renderSampleChooser();show("bb-sample-controls",false);view();say("Alice is picking a sample of matching rounds.");return;}
   receive(evt,payload);
  });
 }
 channel.subscribe(async status=>{
  if(status==="SUBSCRIBED"){
   connected=true;
   if(role==="alice"){reset(Number($("bb-count").value),$("bb-eve").checked);say("Room ready. Share the invitation and choose Alice's first qubit.");}
   else{say("Connected. Waiting for Alice.");await transition("hello");}
  } else if(["CHANNEL_ERROR","TIMED_OUT","CLOSED"].includes(status)){
   connected=false;say("Connection interrupted. Reload and start a new room if it does not recover.",true);
  }
 });
}
async function leave(resetView=true){
 if(channel&&client){await client.removeChannel(channel);channel=null;}
 connected=false;room="";
 if(resetView){phase="setup";mode="solo";role="alice";show("bb-live-invite",false);view();say("Select Solo or Live to start.");}
}
$("bb-solo").onclick=()=>{leave(false);mode="solo";role="alice";show("bb-live-invite",false);reset(Number($("bb-count").value),$("bb-eve").checked);};
$("bb-create").onclick=()=>connect("alice",roomToken());
$("bb-join").onclick=()=>{const id=parseRoom($("bb-room").value);if(!id){say("Paste a valid invitation link or room code.",true);return;}connect("bob",id);};
$("bb-copy").onclick=async()=>{try{await navigator.clipboard.writeText($("bb-invite").textContent);say("Invitation copied. Send it to Bob.");}catch(e){say("Select and copy the link manually.",true);}};
$("bb-leave").onclick=()=>leave();
$("bb-alice-send").onclick=sendQubit;
$("bb-bob-plus").onclick=()=>chooseBasis("+");
$("bb-bob-cross").onclick=()=>chooseBasis("×");
$("bb-next").onclick=nextRound;
$("bb-share-bob").onclick=publishBob;
$("bb-share-alice").onclick=publishAlice;
$("bb-sift-continue").onclick=startTesting;
$("bb-publish-sample").onclick=publishSample;
$("bb-finish").onclick=async()=>{finishKey();await transition("complete");};
$("bb-again").onclick=()=>{if(mode==="live")leave();else reset(Number($("bb-count").value),$("bb-eve").checked);};
const invitation=new URLSearchParams(location.search).get("room");
if(invitation&&validRoom(invitation.toLowerCase())){$("bb-room").value=invitation.toLowerCase();say("Invitation loaded. Click Join as Bob.");}
view();
})();