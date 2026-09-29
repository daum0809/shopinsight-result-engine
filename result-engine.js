export const safeDivide=(a,b)=>b>0?a/b:null;
export const percentChange=(a,b)=>b>0?((a-b)/b)*100:null;

export function calculateKPIs(rows){
  const sum=k=>rows.reduce((s,r)=>s+(Number(r[k])||0),0);
  const ad_spend=sum("ad_spend"), impressions=sum("impressions"), clicks=sum("clicks"),
    visits=sum("visits"), add_to_cart=sum("add_to_cart"), purchases=sum("purchases"), revenue=sum("revenue");
  return {
    ad_spend,impressions,clicks,visits,add_to_cart,purchases,revenue,
    ctr:safeDivide(clicks,impressions),
    cvr:safeDivide(purchases,visits),
    cart_rate:safeDivide(add_to_cart,visits),
    cart_to_purchase_rate:safeDivide(purchases,add_to_cart),
    roas:safeDivide(revenue,ad_spend),
    cpc:safeDivide(ad_spend,clicks),
    cpa:safeDivide(ad_spend,purchases),
    aov:safeDivide(revenue,purchases)
  };
}
export function groupBy(rows,key){return rows.reduce((o,r)=>{(o[r[key]||"unknown"]??=[]).push(r);return o},{})}
export function buildResult(rows){
  const months=rows.reduce((o,r)=>{const k=String(r.date).slice(0,7);(o[k]??=[]).push(r);return o},{});
  const keys=Object.keys(months).sort(), currentPeriod=keys.at(-1), previousPeriod=keys.at(-2);
  const current=calculateKPIs(months[currentPeriod]||[]), previous=previousPeriod?calculateKPIs(months[previousPeriod]):null;
  const changes={};
  if(previous) for(const k of ["revenue","ad_spend","visits","purchases","roas","cvr","cpa","aov"]) changes[k]=percentChange(current[k],previous[k]);
  const currentRows=months[currentPeriod]||[];
  const breakdown=dimension=>Object.entries(groupBy(currentRows,dimension)).map(([name,a])=>({name,...calculateKPIs(a)}));
  return {schema_version:"1.0",currentPeriod,previousPeriod,current,previous,changes,channels:breakdown("channel"),products:breakdown("product")};
}
