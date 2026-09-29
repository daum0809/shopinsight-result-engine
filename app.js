import {buildResult} from "./result-engine.js";
const API_URL="https://hpuwvtekmzujixvzgdeo.supabase.co/functions/v1/analyze-shop";
const DATA=[
{date:"2026-08-01",product:"원피스A",channel:"Instagram",ad_spend:900000,impressions:80000,clicks:4000,visits:3500,add_to_cart:420,purchases:126,revenue:7560000},
{date:"2026-08-01",product:"티셔츠B",channel:"Naver",ad_spend:700000,impressions:65000,clicks:3200,visits:2800,add_to_cart:392,purchases:118,revenue:5900000},
{date:"2026-08-01",product:"가방C",channel:"Google",ad_spend:900000,impressions:72000,clicks:4100,visits:3700,add_to_cart:388,purchases:116,revenue:8740000},
{date:"2026-09-01",product:"원피스A",channel:"Instagram",ad_spend:1000000,impressions:90000,clicks:4500,visits:4000,add_to_cart:400,purchases:80,revenue:6400000},
{date:"2026-09-01",product:"티셔츠B",channel:"Naver",ad_spend:800000,impressions:70000,clicks:3500,visits:3000,add_to_cart:420,purchases:126,revenue:6300000},
{date:"2026-09-01",product:"가방C",channel:"Google",ad_spend:1200000,impressions:100000,clicks:5600,visits:5000,add_to_cart:300,purchases:60,revenue:5400000}
];
const won=n=>n==null?"-":Math.round(n).toLocaleString("ko-KR")+"원";
const pct=n=>n==null?"-":(n*100).toFixed(1)+"%";
const multiple=n=>n==null?"-":n.toFixed(2)+"배";
const delta=n=>n==null?"-":(n>=0?"+":"")+n.toFixed(1)+"%";
async function render(){
 const btn=document.querySelector("#run"); btn.disabled=true; btn.textContent="AI 분석 중...";
 const r=buildResult(DATA),m=r.current;
 document.querySelector("#period").textContent=`${r.previousPeriod} → ${r.currentPeriod}`;
 const cards=[["매출",won(m.revenue),delta(r.changes.revenue)],["광고비",won(m.ad_spend),delta(r.changes.ad_spend)],["ROAS",multiple(m.roas),delta(r.changes.roas)],["CVR",pct(m.cvr),delta(r.changes.cvr)],["CPA",won(m.cpa),delta(r.changes.cpa)],["AOV",won(m.aov),delta(r.changes.aov)]];
 document.querySelector("#cards").innerHTML=cards.map(x=>`<article><small>${x[0]}</small><strong>${x[1]}</strong><span>${x[2]} 전월 대비</span></article>`).join("");
 document.querySelector("#json").textContent=JSON.stringify(r,null,2);
 document.querySelector("#analysis").innerHTML="<h3>OpenAI 분석 결과</h3><p>계산 완료 KPI를 OpenAI가 해석하고 있습니다...</p>";
 try{
   const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({result:r})});
   const data=await res.json();
   if(!res.ok) throw new Error(data?.detail?.error?.message||data?.error||"AI 분석 요청 실패");
   document.querySelector("#analysis").innerHTML=`<h3>OpenAI 분석 결과</h3><pre class="ai">${escapeHtml(data.analysis||"응답이 비어 있습니다.")}</pre>`;
 }catch(e){
   document.querySelector("#analysis").innerHTML=`<h3>OpenAI 분석 오류</h3><p>${escapeHtml(e.message)}</p><p>계산 엔진 결과는 정상 생성되었습니다.</p>`;
 }finally{btn.disabled=false;btn.textContent="샘플 데이터 분석";}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
document.querySelector("#run").addEventListener("click",render);
