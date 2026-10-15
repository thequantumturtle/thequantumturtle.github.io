/* BB84 real-time classroom role-play. Public room broadcasts are not cryptographically private. */
(() => {
"use strict";
const $ = (id) => document.getElementById(id);
const N = 16;
const PROJECT = "https://mzwzbhfnuurruyaoynmr.supabase.co";
const KEY = "sb_publishable_Dkj7DX0XUlBeYnIte-IrKw_I-_9Y31T";
let client, channel, role = "", room = "", state = "idle", alice = null;
let bobBases = [], bobResults = [], round = 0, lastResponse = -1, inviteTimer = null;
const randomBit = () => crypto.getRandomValues(new Uint8Array(1))[0] & 1;
const randomBasis = () => randomBit() ? "+" : "×";
const newRoom = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2,"0")).join("");
const validRoom = (x) => /^[a-f0-9]{32}$/.test(x);
function parseRoom(value) {
 const input = String(value || "").trim();
 if (validRoom(input.toLowerCase())) return input.toLowerCase();
 try {
  const url = new URL(input);
  if (url.origin !== location.origin || !/^\/learn\/bb84\/?$/.test(url.pathname)) return "";
  const code = (url.searchParams.get("room") || "").toLowerCase();
  return validRoom(code) ? code : "";
 } catch (e) { return ""; }
}
const message = (s, warn = false) => { $("live-status").textContent = s; $("live-status").className = "status" + (warn ? " warn" : ""); };
const show = (id, yes = true) => $(id).classList.toggle("hidden", !yes);
const setText = (id, text) => { $(id).textContent = text; };
function prepare() {
 alice = { bits: Array.from({length:N},randomBit), bases: Array.from({length:N},randomBasis), eve:$("live-eve").checked };
 bobBases = []; bobResults = []; round = 0; lastResponse = -1;
 show("live-alice-ready"); show("live-results",false);
 setText("live-alice-progress","0 / 16 measurements");
}
function measure(index, basisChoice) {
 let preparedBit = alice.bits[index], preparedBasis = alice.bases[index];
 if (alice.eve) {
   const eveBasis = randomBasis();
   preparedBit = preparedBasis === eveBasis ? preparedBit : randomBit();
   preparedBasis = eveBasis;
 }
 return basisChoice === preparedBasis ? preparedBit : randomBit();
}
function teardown() {
 if (inviteTimer) { clearInterval(inviteTimer); inviteTimer = null; }
 if (channel && client) client.removeChannel(channel);
 channel = null; state = "idle"; role = ""; room = "";
 show("live-alice-ready",false); show("live-bob-ready",false); show("live-results",false);
 show("live-join-controls",true);
 $("live-create").disabled = false; $("live-join").disabled = false;
 $("live-leave").disabled = true;
}
async function transmit(event, payload = {}) {
 if (!channel || state === "connecting" || state === "idle") return false;
 try {
  const result = await channel.send({type:"broadcast",event,payload:{...payload,room,v:1}});
  if (result !== "ok") { message("Message was not confirmed. Check the connection and retry.",true); return false; }
  return true;
 } catch (e) { message("Connection interrupted. Try reconnecting.",true); return false; }
}
function resetBob() {
 bobBases = []; bobResults = []; round = 0;
 setText("live-bob-round","1"); setText("live-bob-feedback","Waiting for Alice to send the first qubit.");
 $("live-plus").disabled = true; $("live-cross").disabled = true;
 show("live-bob-ready"); show("live-results",false); setText("live-bob-progress","0 / 16 measured");
}
async function begin(kind, roomId) {
 if (!validRoom(roomId)) { message("The room link is invalid. Ask Alice for a new link.",true); return; }
 if (!window.supabase || !window.supabase.createClient) { message("The live connection library did not load. Try reloading the page.",true); return; }
 teardown();
 role = kind; room = roomId; state = "connecting";
 $("live-create").disabled = true; $("live-join").disabled = true; $("live-leave").disabled = false;
 show("live-join-controls",false);
 if (role === "alice") { prepare(); setText("live-room-link",location.origin+location.pathname+"?room="+room); }
 else { resetBob(); }
 message("Connecting to the live room...");
 if (!client) client = window.supabase.createClient(PROJECT,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 channel = client.channel("bb84-classroom-"+room,{config:{broadcast:{ack:true,self:false}}});
 channel.on("broadcast",{event:"hello"},async ({payload:p}) => {
  if(role !== "alice" || p.room!==room || state!=="ready")return;
  await transmit("ready",{count:N}); message("Bob joined. Send qubits as Bob chooses each basis.");
 }).on("broadcast",{event:"ready"},({payload:p}) => {
  if(role!=="bob" || p.room!==room || state!=="ready" || bobBases.length) return;
  if(inviteTimer){clearInterval(inviteTimer);inviteTimer=null;}
  setText("live-bob-feedback","Alice is ready. Choose a basis for qubit 1.");
  $("live-plus").disabled = false; $("live-cross").disabled = false;
  message("Connected to Alice. Choose a basis for each qubit.");
 }).on("broadcast",{event:"choice"},async ({payload:p}) => {
  if (role!=="alice" || state!=="ready" || p.room!==room || !alice || p.i!==bobBases.length || !["+", "×"].includes(p.basis))return;
  const result=measure(p.i,p.basis);
  bobBases.push(p.basis);bobResults.push(result);
  setText("live-alice-progress",bobBases.length+" / 16 measurements");
  const ok=await transmit("outcome",{i:p.i,bit:result});
  if(ok && bobBases.length===N){
    await transmit("reveal",{aliceBits:alice.bits,aliceBases:alice.bases,bobBases,bobResults,eve:alice.eve});
    render(alice.bits,alice.bases,bobBases,bobResults);
    message("Experiment complete. Review the results below.");
  }
 }).on("broadcast",{event:"outcome"},({payload:p}) => {
  if(role!=="bob" || state!=="ready" || p.room!==room || p.i!==round || (p.bit!==0&&p.bit!==1) || bobBases.length!==round+1)return;
  bobResults.push(p.bit);
  setText("live-bob-feedback","Measured bit "+p.bit+". Alice's basis is still hidden.");
  setText("live-bob-progress",bobResults.length+" / 16 measured");
  if(round<N-1){round++;setText("live-bob-round",String(round+1));$("live-plus").disabled=false;$("live-cross").disabled=false;}
  else {setText("live-bob-feedback","All qubits measured. Waiting for Alice to compare bases.");message("All measurements complete. Waiting for Alice's results.");}
 }).on("broadcast",{event:"reveal"},({payload:p}) => {
  if(role!=="bob" || state!=="ready" || p.room!==room || !validBits(p.aliceBits) || !validBases(p.aliceBases) || !validBases(p.bobBases) || !validBits(p.bobResults) || p.bobBases.some((b,i)=>b!==bobBases[i]) || p.bobResults.some((b,i)=>b!==bobResults[i]))return;
  if(inviteTimer){clearInterval(inviteTimer);inviteTimer=null;}
  render(p.aliceBits,p.aliceBases,bobBases,bobResults);
  message("Experiment complete. Compare your bases with Alice's.");
 }).subscribe(async (status) => {
   if(status==="SUBSCRIBED"){
      state="ready";
      if(role==="bob"){
        message("Connected. Asking Alice to begin...");
        const hello=()=>transmit("hello");
        await hello();
        if(inviteTimer)clearInterval(inviteTimer);
        inviteTimer=setInterval(()=>{if(state==="ready"&&role==="bob"&&bobBases.length===0)hello();},4000);
      }else{ message("Room created. Share the link with Bob, then keep this tab open."); }
   }else if(status==="CHANNEL_ERROR"||status==="TIMED_OUT"||status==="CLOSED"){
     state="connecting";$("live-plus").disabled=true;$("live-cross").disabled=true;
     message("Live connection lost or unavailable. Check Supabase Realtime settings and reload.",true);
   }
 });
}
const validBits = a => Array.isArray(a)&&a.length===N&&a.every(b=>b===0||b===1);
const validBases = a => Array.isArray(a)&&a.length===N&&a.every(b=>b==="+"||b==="×");
async function choose(b) {
 if(role!=="bob"||state!=="ready"||bobBases.length!==round||bobResults.length!==round)return;
 $("live-plus").disabled=true; $("live-cross").disabled=true;
 setText("live-bob-feedback","Measuring with "+b+" basis...");
 bobBases.push(b);
 const ok=await transmit("choice",{i:round,basis:b});
 if(!ok){bobBases.pop();$("live-plus").disabled=false;$("live-cross").disabled=false;setText("live-bob-feedback","Send failed. Choose your basis again.");}
}
function render(bits, aliceBases, bases, results) {
 let kept=0, errors=0, key="";
 const tbl=$("live-result-table");tbl.replaceChildren();
 const table=document.createElement("table");
 const head=document.createElement("tr");
 for(const value of ["#","Alice bit","Alice basis","Bob basis","Bob result","Decision"]){const th=document.createElement("th");th.textContent=value;head.append(th);}
 table.append(head);
 for(let i=0;i<N;i++){
  const match=aliceBases[i]===bases[i];
  if(match){kept++;key+=results[i];if(bits[i]!==results[i])errors++;}
  const tr=document.createElement("tr");tr.className=match?"keep":"drop";
  for(const cell of [i+1,bits[i],aliceBases[i],bases[i],results[i],match?"Keep":"Discard"]){const td=document.createElement("td");td.textContent=String(cell);tr.append(td);}
  table.append(tr);
 }
 tbl.append(table);
 const rate=kept?Math.round(100*errors/kept):0;
 setText("live-kept",kept+" / 16 bases matched");setText("live-errors",errors+" errors ("+rate+"%)");
 setText("live-key",key||"No matching bases this time");
 show("live-results");$("live-results").scrollIntoView({behavior:"smooth",block:"nearest"});
}
$("live-create").addEventListener("click",()=>begin("alice",newRoom()));
$("live-join").addEventListener("click",()=>begin("bob",parseRoom($("live-room-code").value)));
$("live-plus").addEventListener("click",()=>choose("+"));
$("live-cross").addEventListener("click",()=>choose("×"));
$("live-leave").addEventListener("click",()=>{teardown();message("You left the room. Create or join a new experiment.");history.replaceState(null,"",location.pathname);});
$("live-copy").addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText($("live-room-link").textContent);message("Room link copied. Send it to Bob.");}
 catch(e){message("Select and copy the room link manually.",true);}
});
const query = new URLSearchParams(location.search).get("room");
if(query && validRoom(query.toLowerCase())){ $("live-room-code").value=query.toLowerCase(); message("You have a room invitation. Click Join as Bob to connect."); }
window.addEventListener("pagehide",()=>{if(channel&&client)client.removeChannel(channel);});
})();