const crops=[
{name:"Rice",soil:["Alluvial","Clay","Loamy"],season:["Kharif","Rabi"],rain:[900,2500],water:["High","Moderate"],note:"Needs dependable moisture; avoid unsuitable drainage."},
{name:"Maize",soil:["Alluvial","Red","Loamy","Black"],season:["Kharif","Rabi","Summer"],rain:[500,1200],water:["Moderate","High"],note:"Well-drained soil and timely water are important."},
{name:"Ragi (Finger millet)",soil:["Red","Laterite","Sandy","Loamy"],season:["Kharif","Rabi"],rain:[400,1000],water:["Low","Moderate"],note:"A hardy millet option under suitable local conditions."},
{name:"Groundnut",soil:["Red","Sandy","Loamy"],season:["Kharif","Rabi","Summer"],rain:[500,1000],water:["Low","Moderate"],note:"Requires good drainage; avoid waterlogging."},
{name:"Jowar (Sorghum)",soil:["Black","Red","Loamy"],season:["Kharif","Rabi","Summer"],rain:[300,800],water:["Low","Moderate"],note:"Relatively drought-resilient compared with water-intensive crops."},
{name:"Green gram",soil:["Red","Sandy","Loamy","Black"],season:["Kharif","Summer"],rain:[300,800],water:["Low","Moderate"],note:"A pulse option; local varieties and planting windows matter."},
{name:"Wheat",soil:["Alluvial","Black","Loamy"],season:["Rabi"],rain:[300,900],water:["Moderate","High"],note:"Cool-season suitability depends on regional climate."},
{name:"Cotton",soil:["Black","Alluvial"],season:["Kharif"],rain:[500,1200],water:["Low","Moderate"],note:"Drainage, pests and local crop calendars are important."},
{name:"Seasonal vegetables",soil:["Alluvial","Red","Loamy","Laterite"],season:["Kharif","Rabi","Summer"],rain:[400,1200],water:["Moderate","High"],note:"Choose the specific vegetable based on local climate and market."},
{name:"Coconut",soil:["Laterite","Sandy","Loamy","Alluvial"],season:["Year-round"],rain:[1000,3000],water:["Moderate","High"],note:"Perennial crop for suitable humid tropical locations."}
];
function recommend(i){return crops.map(c=>{let score=0,reasons=[];
if(c.soil.includes(i.soilType)){score+=35;reasons.push("Soil type is within the broad suitability range.");}
if(c.season.includes(i.season)){score+=25;reasons.push("Season matches a listed growing season.");}
if(i.rainfall>=c.rain[0]&&i.rainfall<=c.rain[1]){score+=25;reasons.push(`Rainfall falls in the broad ${c.rain[0]}–${c.rain[1]} mm range.`);}
else if(Math.min(Math.abs(i.rainfall-c.rain[0]),Math.abs(i.rainfall-c.rain[1]))<=250){score+=10;reasons.push("Rainfall is near the reference range; check local conditions.");}
if(c.water.includes(i.waterAvailability)){score+=15;reasons.push("Water availability matches the listed requirement.");}
return {...c,score,reasons};}).filter(c=>c.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(c=>({...c,suitability:c.score>=75?"Strong match":c.score>=50?"Possible match":"Review locally"}));}
module.exports={recommend};
