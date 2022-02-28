var search={};
window.location.search.slice(1).split("&").forEach(value=>search[value.split("=")[0]]=value.split("=")[1]);
function toggleSidebar(){
  const sidebar=document.getElementById("sidebar");
  const hamburger=document.getElementById("hamburger-content");
  if(sidebar.classList.contains("open")){
    sidebar.classList.remove("open");
    hamburger.classList.remove("cross");
    sidebar.classList.add("close");
    hamburger.classList.add("burger");
  }else{
    sidebar.classList.add("open");
    hamburger.classList.add("cross");
    sidebar.classList.remove("close");
    hamburger.classList.remove("burger");
  };
};

function category(cat){
  if(cat==0)return"thing";
  if(cat==1)return"user";
  if(cat==3)return"lyc";
  if(cat==4)return"prot";
  if(cat==5)return"type";
  return cat;
};
var tags=search.tags?.length?`&tags=${search.tags}`:"";
const pages=[];
window.onload=()=>{
  document.getElementById("search-bar").value=decodeURIComponent(search.tags?.replace(/\+/g," ")||"");
  var page=search.page?Number(search.page):1;
  var count=0;
  const el=5;
  var min=page-Math.floor(el/2);
  if(min<1)min=1;
  var max=min+el;
  for(let i=min;i<max;i++){
    if(i>1e3||i<1)continue;
    count++;
    fetch(`https://yande.re/post.json?page=${i}&limit=50${tags}`)
    .then(res=>res.json())
    .then(data=>{
      if(data.length)pages.push(i);
      else count--;
      if(count==pages.length){
        const minNum=Math.min(...pages);
        const eq=el-pages.length;
        for(let j=0;j<eq;j++){
          if(minNum-j-1<1)break;
          pages.unshift(minNum-j-1);
        };
        document.getElementById("pages").innerHTML=pages.sort((a,b)=>a-b).map(p=>`<a class="page${page==p?" current-page":""}" onclick="setPage(${p})">${p}</a>`).join("");
      };
    });
  };
  fetch(`https://yande.re/post.json?page=${page}&limit=50${tags}`)
  .then(res=>res.json())
  .then(data=>{
    const tags={};
    data.forEach(image=>{
      image.tags.split(" ").forEach(t=>{
        if(!tags[t])tags[t]=1;
        else tags[t]++;
      });
    });
    const tagsElem=document.getElementById("main-tags");
    const images=document.getElementById("images");
    tagsElem.innerHTML=Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,15).map(e=>`<a class="tag" onclick="setTag('${e[0]}')"><p class="tag-name thing">${e[0]}</p><p class="tag-usage">${e[1]}</p></a>`).join("");
    images.innerHTML=data.map(e=>{
      if(!e?.preview_url)return"";
      return`<img src="${e.preview_url}" alt="${e.id}" class="image" onclick="window.location.href='yandere/post?id=${e.id}'">`;
    }).join("");
  });
};
function setPage(page){
  if(!pages.includes(page))return;
  search.page=page;
  delete search[""];
  if(search.tags=="")delete search.tags;
  window.location.search="?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
};
function sendTags(input){
  const tags=input.value.trim().split(/ +/).map(t=>encodeURIComponent(t)).join("+");
  search.tags=tags;
  delete search[""];
  if(search.tags=="")delete search.tags;
  if(search.page)delete search.page;
  window.location.search="?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
};
function predict(input){
  const predictions=document.getElementById("predictions");
  const value=input.value.split(/ +/)[input.value.split(/ +/).length-1];
  if(!input.value.length||!value.length)return predictions.innerHTML="";
  fetch(`https://yande.re/tag.json?name=${encodeURIComponent(value)}&order=count`)
  .then(res=>res.json())
  .then(displayPredictions);
};
function displayPredictions(data){
  predictions.innerHTML=data.slice(0,10).map(t=>{
    if(t.name.length>20)t.name=t.name.slice(0,17)+" ...";
    return`
    <div class="prediction" onclick="complete('${t.name}')"><p class="tag-name ${category(t.type)}">${t.name}</p><p class="post-count">${t.count.toLocaleString()}</p></div>
    `;
  }).join("");
};
function setTag(tag){
  const searchBar=document.getElementById("search-bar");
  searchBar.value=tag;
  sendTags(searchBar);
};
function complete(prediction){
  const searchBar=document.getElementById("search-bar");
  const values=searchBar.value.trim().split(/ +/);
  const last=values.splice(values.length-1,1);
  searchBar.value=searchBar.value.replace(last,prediction)+" ";
  searchBar.focus();
  predict(searchBar);
};
window.onkeydown=({code})=>{
  if(code=="Enter"&&document.activeElement.id=="search-bar"){
    sendTags(document.activeElement);
  };
};
function nextPage(){
  if(!search.page)search.page=2;
  else search.page=Number(search.page)+1;
  if(!pages.includes(search.page))return search.page--;
  delete search[""];
  if(search.tags=="")delete search.tags;
  window.location.search="?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
};
function prevPage(){
  if(!search.page||Number(search.page)==1)return;
  else search.page=Number(search.page)-1;
  delete search[""];
  if(!search.page)return delete search.page;
  if(search.tags=="")delete search.tags;
  window.location.search="?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
};
