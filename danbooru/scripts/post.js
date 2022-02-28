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
  fetch(`https://danbooru.donmai.us/posts/${search.id}.json`)
  .then(res=>res.json())
  .then(data=>{
    imageId=data.id;
    const tags=data.tag_string_general.split(" ");
    const artists=data.tag_string_artist.split(" ");
    const characters=data.tag_string_character.split(" ");
    const copyrights=data.tag_string_copyright.split(" ");
    const meta=data.tag_string_meta.split(" ");
    if(data.file_ext=="mp4"){
      document.getElementById("file").innerHTML=`<video alt="post" id="image" class="image" src="${data.file_url}" controls autoplay loop></video>`;
    }else{
      document.getElementById("file").innerHTML=`<img alt="post" id="image" class="image" src="${data.file_url}">`;
    };
    document.getElementById("rating").innerHTML=rating(data.rating);
    document.getElementById("size").innerHTML=`${data.image_width} x ${data.image_height}`;
    document.getElementById("id").innerHTML=data.id;
    document.getElementById("created-at").innerHTML=new Date(data.created_at).toDateString();
    document.getElementById("fav-count").innerHTML=data.fav_count.toLocaleString();
    document.getElementById("score").innerHTML=`${data.score.toLocaleString()} (<i class="fas fa-caret-up"></i> ${data.up_score.toLocaleString()} / <i class="fas fa-caret-down"></i> ${(Math.abs(data.down_score)).toLocaleString()})`;
    fetch(`https://danbooru.donmai.us/users/${data.uploader_id}.json`)
    .then(res=>res.json())
    .then(user=>{
      document.getElementById("uploader").innerHTML=user.name;
    });
    document.getElementById("global").innerHTML=tags.map(tag=>{
      return`<a class="tag-obj" onclick="setTag('${tag}')"><p class="tag-name thing">${tag}</p></a>`
    }).join("");
    document.getElementById("artists").innerHTML=artists.map(tag=>{
      return`<a class="tag-obj" onclick="setTag('${tag}')"><p class="tag-name user">${tag}</p></a>`
    }).join("");
    document.getElementById("characters").innerHTML=characters.map(tag=>{
      return`<a class="tag-obj" onclick="setTag('${tag}')"><p class="tag-name prot">${tag}</p></a>`
    }).join("");
    document.getElementById("copyrights").innerHTML=copyrights.map(tag=>{
      return`<a class="tag-obj" onclick="setTag('${tag}')"><p class="tag-name lyc">${tag}</p></a>`
    }).join("");
    document.getElementById("meta").innerHTML=meta.map(tag=>{
      return`<a class="tag-obj" onclick="setTag('${tag}')"><p class="tag-name type">${tag}</p></a>`
    }).join("");
    fetch(`https://danbooru.donmai.us/recommended_posts.json?search[post_id]=${data.id}&limit=20`)
    .then(res=>res.json())
    .then(posts=>{
      if(!posts.length){
        document.getElementById("recommendations").innerHTML="No posts found...";
      }else{
        document.getElementById("recommendations").innerHTML=posts.map(({post})=>`<img src="${post.preview_file_url}" alt="${post.id}" onclick="setImage(${post.id})">`).join("");
      };
    });
    fetch(`https://danbooru.donmai.us/artist_commentary_versions.json?search[post_id]=${data.id}`)
    .then(res=>res.json())
    .then(commentary=>{
      if(commentary.length){
        var content=commentary[0].original_description.replace(/(\[\/?t(r|d|h|able|body)\])\n/g,(_,b)=>b).replace(/"(.*?[^""])":\[(.*?[^\[\]])\]/g,(_,label,link)=>{
          if(link.startsWith("/"))return`<b>${label}</b>`;
          return`<a href="${link}">${label}</a>`;
        });
        content=content.replace(/\r/g,"").replace(/\n/g,"<br>").replace(/\[/g,"<").replace(/\]/g,">");
        document.getElementById("commentary").innerHTML=content;
      }else{
        document.getElementById("commentary").innerHTML="No commentary...";
      };
    });
  });
  fetch(`https://danbooru.donmai.us/comments.json?search[post_id]=${search.id}&search[order]=score`)
  .then(res=>res.json())
  .then(data=>{
    document.getElementById("comments").innerHTML=data.map(comment=>{
      fetch(`https://danbooru.donmai.us/users/${comment.updater_id}.json`)
      .then(res=>res.json())
      .then(user=>{
        document.getElementById(`user-${comment.id}`).innerHTML=user.name;
      });
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
            <p class="comment-user" id="user-${comment.id}">Unknown</p>
            <p class="comment-date">${new Date(comment.updated_at).toDateString()}</p>
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
  fetch("https://danbooru.donmai.us/posts/random.json")
  .then(res=>res.json())
  .then(data=>{
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
  if(value.startsWith("pool:")){
    fetch(`https://danbooru.donmai.us/pools.json?search[name_matches]=${encodeURIComponent(value.slice(5))}*&search[order]=count&search[hide_empty]=t`)
    .then(res=>res.json())
    .then(displayPredictions);
  }else{
    fetch(`https://danbooru.donmai.us/tags.json?search[name_matches]=${encodeURIComponent(value)}*&search[order]=count&search[hide_empty]=t`)
    .then(res=>res.json())
    .then(displayPredictions);
  };
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
  window.location.href="../danbooru?"+Object.entries(search).map(e=>`${e[0]}=${e[1]}`).join("&");
};
