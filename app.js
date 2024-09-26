let keys = '377f07ebbd914411ad5a1a2207404dad';
let consultas = ' llm';
let url = `https://newsapi.org/v2/everything?q=${consultas}&language=es&"country=us&from=2024-09-01&sortBy=popularity&apiKey=${keys}`;
let mostrarNoticias = document.getElementById("news");
fetch(url).then((resp)=> resp.json()).then(dato =>{
    console.log(dato);
    let noticias = (dato.articles)
    noticias.map(function(items){
        let div = document.createElement('news')
        div.innerHTML = `
        
<div class="card">
      <img src="${items.urlToImage}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${items.title}</h5>
        <p class="card-text">${items.description}</p>
        <span><a href="${items.url} ">Ir a la noticia</a></span>
</div>
                          `;
        mostrarNoticias.appendChild(div);                 
    })
    
})
