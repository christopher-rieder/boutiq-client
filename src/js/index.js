let articulos = [];
let body = document.querySelector('.app');

async function getArticulos () {
  const res = await axios(`http://192.168.0.2:3000/api/rawTables/full_articulos`);
  articulos = res.data;

  articulos.forEach(row => {
    var x = document.createElement('div');
    var t = document.createTextNode(JSON.stringify(row)); // Create a text node
    x.appendChild(t);
    body.appendChild(x);
  });

  console.log(articulos);
}

getArticulos();
