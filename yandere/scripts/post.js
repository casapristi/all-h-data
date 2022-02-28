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
function rating(r){
  if(r=="s")return"Safe";
  if(r=="q")return"Questionnable";
  if(r=="e")return"Explicit";
  return"Unknown";
};
var imageId;
window.onload=()=>{
  fetch(`https://yande.re/post.json?tags=id%3A${search.id}`)
  .then(res=>res.json())
  .then(([data])=>{
    console.log(data);
    imageId=data.id;
    const tags=data.tags.split(" ");
    document.getElementById("file").innerHTML=`<img alt="post" id="image" class="image" src="${data.file_url}">`;
    document.getElementById("rating").innerHTML=rating(data.rating);
    document.getElementById("size").innerHTML=`${data.width} x ${data.height}`;
    document.getElementById("id").innerHTML=data.id;
    document.getElementById("created-at").innerHTML=new Date(data.created_at).toDateString();
    document.getElementById("score").innerHTML=`${data.score.toLocaleString()}`;
    document.getElementById("uploader").innerHTML=data.source;
    document.getElementById("global").innerHTML=tags.map(tag=>{
      return`<a class="tag-obj" onclick="setTag('${tag}')"><p class="tag-name thing">${tag}</p></a>`
    }).join("");
    document.getElementById("artists").innerHTML=`<a class="tag-obj" onclick="setTag('${data.author}')"><p class="tag-name user">${data.author}</p></a>`;
  });
  fetch(`https://yande.re/comment.json?post_id=${search.id}`)
  .then(res=>res.json())
  .then(data=>{
    console.log(data);
    document.getElementById("comments").innerHTML=data.map(comment=>{
      comment.body=comment.body.replace(/(\[\/?t(r|d|h|able|body)\])\n/g,(_,b)=>b).replace(/"(.*?[^""])":\[(.*?[^\[\]])\]/g,(_,label,link)=>{
        if(link.startsWith("/"))return`<b>${label}</b>`;
        return`<a href="${link}">${label}</a>`;
      });
      const quote=comment.body.split(/\[quote\]/)?.[1]?.split(/\[\/quote\]/)[0];
      var content=comment.body;
      if(quote!=undefined)content=comment.body.split(/\[\/quote\]/)[1];
      content=content.replace(/\r/g,"").replace(/\n/g,"<br>").replace(/\[/g,"<").replace(/\]/g,">");
      return`<div class="comment">
        <div class="comment-content">
          ${quote?`<p class="quote">${quote}</p>`:""}
          <div class="comment-info">
            <p class="comment-user">${comment.creator}</p>
            <p class="comment-date">${new Date(comment.created_at).toDateString()}</p>
          </div>
          <p class="comment-body">${content}</p>
        </div>
        <p class="comment-score">${comment.score}</p>
      </div>`
    }).join("");
  });
};
function setImage(postId){
  search.id=postId;
  delete search[""];
  window.location.search="?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
};
async function downloadImage(){
  const file=document.getElementById("image").src;
  const fileName=file.split("/")[file.split("/").length-1];
  const image=await fetch(file);
  const imageBlog=await image.blob();
  const imageURL=URL.createObjectURL(imageBlog);
  const link=document.createElement("a");
  link.href=imageURL;
  link.download=imageId+"-"+fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
function randomPost(){
  fetch("https://yande.re/post.json?tags=order%3Arandom")
  .then(res=>res.json())
  .then(([data])=>{
    search.id=data.id;
    delete search[""];
    window.location.search="?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
  });
};
function operatePost(num){
  search.id=Number(search.id)+num;
  delete search[""];
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
    <div class="prediction" onclick="complete('${t.post_ids?`pool:${t.id}`:t.name}')"><p class="tag-name ${category(t.category)}">${t.name}</p><p class="post-count">${t.post_count.toLocaleString()}</p></div>
    `;
  }).join("");
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
function setTag(tag){
  const searchBar=document.getElementById("search-bar");
  searchBar.value=tag;
  sendTags(searchBar);
};
function sendTags(input){
  const tags=input.value.trim().split(/ +/).map(t=>encodeURIComponent(t)).join("+");
  search.tags=tags;
  delete search[""];
  delete search.id;
  window.location.href="../yandere?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
};
