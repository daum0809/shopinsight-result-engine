import {buildResult} from "./result-engine.js";
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
function insight(r){
 const c=r.changes;
 const facts=[`매출은 전월 대비 ${delta(c.revenue)} 변했습니다.`,`광고비는 ${delta(c.ad_spend)}, 구매수는 ${delta(c.purchases)} 변했습니다.`,`구매전환율은 ${pct(r.previous.cvr)}에서 ${pct(r.current.cvr)}로 변했습니다.`];
 let hypothesis="현재 데이터만으로 원인을 확정할 수 없습니다.";
 if(c.cvr<0) hypothesis="방문 이후 구매 전환 구간의 악화가 매출 변화와 함께 관찰됩니다.";
 const action=c.cvr<0?"상품·채널별 CVR을 분해해 하락 구간부터 확인하세요.":"ROAS가 낮은 채널부터 광고 효율을 비교하세요.";
 return {summary:facts[0],facts,hypothesis,action};
}
function render(){
 const r=buildResult(DATA), m=r.current, i=insight(r);
 document.querySelector("#period").textContent=`${r.previousPeriod} → ${r.currentPeriod}`;
 const cards=[["매출",won(m.revenue),delta(r.changes.revenue)],["광고비",won(m.ad_spend),delta(r.changes.ad_spend)],["ROAS",multiple(m.roas),delta(r.changes.roas)],["CVR",pct(m.cvr),delta(r.changes.cvr)],["CPA",won(m.cpa),delta(r.changes.cpa)],["AOV",won(m.aov),delta(r.changes.aov)]];
 document.querySelector("#cards").innerHTML=cards.map(x=>`<article><small>${x[0]}</small><strong>${x[1]}</strong><span>${x[2]} 전월 대비</span></article>`).join("");
 document.querySelector("#analysis").innerHTML=`<h3>AI 분석에 전달할 결과</h3><p><b>요약</b> ${i.summary}</p><p><b>확인된 사실</b><br>${i.facts.join("<br>")}</p><p><b>원인 후보</b><br>${i.hypothesis}</p><p><b>다음 액션</b><br>${i.action}</p>`;
 document.querySelector("#json").textContent=JSON.stringify(r,null,2);
}
document.querySelector("#run").addEventListener("click",render);
