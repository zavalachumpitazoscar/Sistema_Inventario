const navGroups=[
  {label:"GESTIÓN",items:[["dashboard","▦","Panel de control"],["products","□","Productos"],["movements","⇄","Movimientos"],["purchases","↓","Compras"],["sales","↑","Ventas"]]},
  {label:"ORGANIZACIÓN",items:[["partners","♙","Proveedores y clientes"],["catalogs","◇","Categorías y marcas"],["reports","▤","Reportes"]]},
  {label:"ADMINISTRACIÓN",items:[["users","♟","Usuarios y permisos"],["audit","◷","Auditoría"],["settings","⚙","Configuración"]]}
];
const initial={
  products:[
    {code:"PRD-001",name:"Laptop empresarial 14″",category:"Tecnología",brand:"Lenovo",stock:18,min:5,cost:2150,price:2690},
    {code:"PRD-002",name:"Mouse inalámbrico",category:"Accesorios",brand:"Logitech",stock:4,min:8,cost:58,price:89},
    {code:"PRD-003",name:"Monitor IPS 24″",category:"Tecnología",brand:"Samsung",stock:0,min:4,cost:520,price:699},
    {code:"PRD-004",name:"Silla ergonómica",category:"Mobiliario",brand:"ErgoPro",stock:11,min:3,cost:340,price:489},
    {code:"PRD-005",name:"Tóner láser negro",category:"Suministros",brand:"HP",stock:6,min:10,cost:210,price:285}
  ],
  movements:[
    {date:"07/09/2026, 15:42",type:"Entrada",document:"OC-00128",product:"Laptop empresarial 14″",qty:"+ 10",user:"Administrador"},
    {date:"07/09/2026, 14:10",type:"Salida",document:"V-00451",product:"Mouse inalámbrico",qty:"− 3",user:"Administrador"},
    {date:"06/09/2026, 17:25",type:"Transferencia",document:"TR-00019",product:"Monitor IPS 24″",qty:"5",user:"Almacén"}
  ],
  partners:[
    {type:"Proveedor",doc:"RUC-DEMO-001",name:"Proveedor de Demostración S.A.C.",contact:"Contacto de ejemplo",phone:"900 000 001"},
    {type:"Cliente",doc:"RUC-DEMO-002",name:"Cliente de Demostración S.A.C.",contact:"Contacto de ejemplo",phone:"900 000 002"}
  ],
  purchases:[{date:"06/09/2026",document:"F001-00258",partner:"Proveedor de Demostración S.A.C.",total:21500,status:"Completada"}],
  sales:[{date:"07/09/2026",document:"B001-00451",partner:"Cliente de Demostración S.A.C.",total:267,status:"Completada"}],
  users:[{name:"Usuario administrador",email:"admin@example.com",role:"Administrador",status:"Activo"},{name:"Usuario de almacén",email:"almacen@example.com",role:"Almacén",status:"Activo"}],
  audit:[{date:"07/09/2026, 15:42",user:"Usuario administrador",action:"Registró una entrada",detail:"OC-00128 · 10 unidades"},{date:"07/09/2026, 14:10",user:"Usuario administrador",action:"Registró una venta",detail:"B001-00451"}]
};
const state=JSON.parse(localStorage.getItem("inventario-demo"))||structuredClone(initial);
let route="dashboard";
const money=n=>new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN"}).format(n);
const save=()=>localStorage.setItem("inventario-demo",JSON.stringify(state));
const nav=document.querySelector("#mainNav"),content=document.querySelector("#content"),title=document.querySelector("#pageTitle"),eyebrow=document.querySelector("#sectionEyebrow");
nav.innerHTML=navGroups.map(g=>`<div class="nav-label">${g.label}</div>${g.items.map(i=>`<button class="nav-btn" data-route="${i[0]}"><span class="nav-icon">${i[1]}</span>${i[2]}</button>`).join("")}`).join("");
nav.addEventListener("click",e=>{const b=e.target.closest("[data-route]");if(!b)return;route=b.dataset.route;render();closeMenu()});
document.querySelector("#menuBtn").onclick=()=>{document.querySelector("#sidebar").classList.add("open");document.querySelector("#backdrop").classList.add("show")};
document.querySelector("#backdrop").onclick=closeMenu;
function closeMenu(){document.querySelector("#sidebar").classList.remove("open");document.querySelector("#backdrop").classList.remove("show")}
const routeMeta={dashboard:["RESUMEN GENERAL","Panel de control"],products:["CATÁLOGO","Productos"],movements:["OPERACIONES","Entradas, salidas y transferencias"],purchases:["ABASTECIMIENTO","Compras"],sales:["COMERCIAL","Ventas y comprobantes"],partners:["DIRECTORIO","Proveedores y clientes"],catalogs:["ORGANIZACIÓN","Categorías y marcas"],reports:["ANÁLISIS","Reportes"],users:["SEGURIDAD","Usuarios y permisos"],audit:["CONTROL","Auditoría de actividad"],settings:["EMPRESA","Configuración"]};
function render(){
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.route===route));
  [eyebrow.textContent,title.textContent]=routeMeta[route];
  document.querySelector("#quickAction").textContent=route==="products"?"＋ Nuevo producto":route==="sales"?"＋ Nueva venta":route==="purchases"?"＋ Nueva compra":"＋ Nuevo movimiento";
  content.innerHTML=route==="dashboard"?dashboard():route==="products"?products():route==="movements"?tablePage("Historial de movimientos",state.movements,["date","type","document","product","qty","user"],["Fecha","Tipo","Documento","Producto","Cantidad","Usuario"]):route==="partners"?tablePage("Directorio comercial",state.partners,["type","doc","name","contact","phone"],["Tipo","Documento","Razón social","Contacto","Teléfono"]):route==="purchases"?docsPage("Órdenes y comprobantes de compra",state.purchases):route==="sales"?docsPage("Ventas y comprobantes emitidos",state.sales):route==="catalogs"?catalogs():route==="users"?tablePage("Accesos del sistema",state.users,["name","email","role","status"],["Usuario","Correo","Rol","Estado"]):route==="audit"?tablePage("Registro de actividad",state.audit,["date","user","action","detail"],["Fecha","Usuario","Acción","Detalle"]):route==="reports"?reports():settings();
  bindSearch();
}
function dashboard(){
 const value=state.products.reduce((a,p)=>a+p.stock*p.cost,0),low=state.products.filter(p=>p.stock<=p.min).length;
 return `<div class="metric-grid">
  ${metric("Valor del inventario",money(value),"Costo valorizado actual")}
  ${metric("Productos registrados",state.products.length,"En catálogo")}
  ${metric("Stock bajo o agotado",low,"Requieren atención","warn")}
  ${metric("Movimientos del mes",state.movements.length,"Entradas y salidas")}
 </div><div class="dashboard-grid">
 <section class="panel"><div class="panel-head"><h2>Productos que requieren atención</h2><button class="text-btn" data-go="products">Ver inventario</button></div>
 ${state.products.filter(p=>p.stock<=p.min).map(p=>`<div class="stock-item"><div><strong>${p.name}</strong><small>${p.code} · Mínimo ${p.min}</small></div><div class="progress"><span style="width:${Math.min(100,p.stock/p.min*100)}%"></span></div><span class="status ${p.stock?"low":"out"}">${p.stock?p.stock+" unidades":"Agotado"}</span></div>`).join("")}</section>
 <section class="panel"><div class="panel-head"><h2>Actividad reciente</h2><button class="text-btn" data-go="movements">Ver todo</button></div>
 ${state.movements.map(m=>`<div class="activity"><span class="activity-dot"></span><div><p><strong>${m.type}</strong> de ${m.product}</p><small>${m.date} · ${m.user}</small></div></div>`).join("")}</section>
 <section class="panel full"><div class="panel-head"><h2>Estado del inventario</h2><span class="status ok">Actualizado</span></div>${productTable(state.products.slice(0,5))}</section></div>`;
}
function metric(label,value,note,cls=""){return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span>↗</span></div><strong>${value}</strong><span class="trend ${cls}">${note}</span></article>`}
function products(){return `<section class="panel"><div class="toolbar"><input class="search" placeholder="Buscar por código, producto, categoría o marca…" aria-label="Buscar productos"><button class="secondary-btn">Importar Excel</button></div><div id="tableResult">${productTable(state.products)}</div></section>`}
function productTable(rows){return `<div class="table-wrap"><table><thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Marca</th><th>Stock</th><th>Costo</th><th>Precio</th><th>Estado</th></tr></thead><tbody>${rows.map(p=>`<tr><td>${p.code}</td><td><strong>${p.name}</strong></td><td>${p.category}</td><td>${p.brand}</td><td>${p.stock}</td><td>${money(p.cost)}</td><td>${money(p.price)}</td><td><span class="status ${p.stock===0?"out":p.stock<=p.min?"low":"ok"}">${p.stock===0?"Agotado":p.stock<=p.min?"Stock bajo":"Disponible"}</span></td></tr>`).join("")}</tbody></table></div>`}
function tablePage(heading,rows,keys,labels){return `<section class="panel"><div class="panel-head"><h2>${heading}</h2><button class="secondary-btn">Exportar</button></div><div class="toolbar"><input class="search" placeholder="Buscar en los registros…" aria-label="Buscar"></div><div id="tableResult" class="table-wrap"><table><thead><tr>${labels.map(l=>`<th>${l}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${keys.map(k=>`<td>${k==="status"||k==="type"?`<span class="status ok">${r[k]}</span>`:r[k]}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`}
function docsPage(heading,rows){return `<section class="panel"><div class="panel-head"><h2>${heading}</h2><button class="secondary-btn">Exportar</button></div><div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Comprobante</th><th>Empresa</th><th>Total</th><th>Estado</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.date}</td><td><strong>${r.document}</strong></td><td>${r.partner}</td><td>${money(r.total)}</td><td><span class="status completed">${r.status}</span></td></tr>`).join("")}</tbody></table></div></section>`}
function catalogs(){const cats=[["Tecnología",2],["Accesorios",1],["Mobiliario",1],["Suministros",1],["Sin categoría",0]],brands=[...new Set(state.products.map(p=>p.brand))];return `<div class="dashboard-grid"><section class="panel"><div class="panel-head"><h2>Categorías</h2><button class="text-btn">＋ Agregar</button></div><div class="category-grid">${cats.map(c=>`<div class="category-card"><strong>${c[0]}</strong><small>${c[1]} productos</small></div>`).join("")}</div></section><section class="panel"><div class="panel-head"><h2>Marcas</h2><button class="text-btn">＋ Agregar</button></div>${brands.map(b=>`<div class="stock-item"><strong>${b}</strong><small>${state.products.filter(p=>p.brand===b).length} productos</small></div>`).join("")}</section></div>`}
function reports(){return `<div class="metric-grid">${metric("Valorización",money(state.products.reduce((a,p)=>a+p.stock*p.cost,0)),"Inventario a costo")}${metric("Margen potencial",money(state.products.reduce((a,p)=>a+p.stock*(p.price-p.cost),0)),"Sobre existencias")}${metric("Unidades disponibles",state.products.reduce((a,p)=>a+p.stock,0),"Stock total")}${metric("Productos agotados",state.products.filter(p=>!p.stock).length,"Sin existencias","warn")}</div><section class="panel" style="margin-top:18px"><div class="panel-head"><h2>Reportes disponibles</h2></div><div class="category-grid">${["Inventario valorizado","Kardex por producto","Movimientos por periodo","Productos de mayor rotación","Compras por proveedor","Ventas y rentabilidad"].map(x=>`<div class="category-card"><strong>${x}</strong><small>Consultar y exportar en Excel o PDF</small></div>`).join("")}</div></section>`}
function settings(){return `<section class="panel"><div class="panel-head"><h2>Datos de la empresa</h2><span class="status ok">Instalación independiente</span></div><div class="form-grid"><div class="field"><label>Razón social</label><input value="Empresa de Demostración S.A.C."></div><div class="field"><label>RUC</label><input value="RUC-DEMO"></div><div class="field"><label>Moneda</label><select><option>Soles (PEN)</option></select></div><div class="field"><label>Zona horaria</label><select><option>America/Lima</option></select></div><div class="field full"><label>Dirección</label><input placeholder="Dirección fiscal o comercial"></div></div><button class="primary-btn" onclick="showToast('Configuración guardada')">Guardar cambios</button></section>`}
content.addEventListener("click",e=>{const go=e.target.closest("[data-go]");if(go){route=go.dataset.go;render()}});
document.querySelector("#quickAction").onclick=()=>openForm(route==="products"?"product":route==="sales"?"sale":route==="purchases"?"purchase":"movement");
function openForm(type){
 const schemas={product:[["code","Código","PRD-006"],["name","Nombre del producto",""],["category","Categoría",""],["brand","Marca",""],["stock","Stock inicial","0","number"],["min","Stock mínimo","5","number"],["cost","Costo unitario","0","number"],["price","Precio de venta","0","number"]],movement:[["type","Tipo (Entrada/Salida)","Entrada"],["document","Documento",""],["product","Producto",""],["qty","Cantidad","1","number"]],sale:[["document","Comprobante",""],["partner","Cliente",""],["total","Total","0","number"]],purchase:[["document","Comprobante",""],["partner","Proveedor",""],["total","Total","0","number"]]};
 const labels={product:"Nuevo producto",movement:"Nuevo movimiento",sale:"Nueva venta",purchase:"Nueva compra"},fields=schemas[type];
 document.querySelector("#dialogTitle").textContent=labels[type];document.querySelector("#formFields").innerHTML=fields.map(f=>`<div class="field"><label for="${f[0]}">${f[1]}</label><input id="${f[0]}" name="${f[0]}" type="${f[3]||"text"}" value="${f[2]}" required></div>`).join("");
 const dialog=document.querySelector("#formDialog");dialog.dataset.type=type;dialog.showModal();
}
document.querySelector("#recordForm").addEventListener("submit",e=>{
 if(e.submitter?.value==="cancel")return; e.preventDefault();const type=document.querySelector("#formDialog").dataset.type,data=Object.fromEntries(new FormData(e.target));
 if(type==="product"){["stock","min","cost","price"].forEach(k=>data[k]=Number(data[k]));state.products.push(data)}
 if(type==="movement"){data.date=new Date().toLocaleString("es-PE");data.user="Administrador";data.qty=(data.type.toLowerCase()==="salida"?"− ":"+ ")+data.qty;state.movements.unshift(data)}
 if(type==="sale"||type==="purchase"){data.date=new Date().toLocaleDateString("es-PE");data.total=Number(data.total);data.status="Completada";state[type==="sale"?"sales":"purchases"].unshift(data)}
 save();document.querySelector("#formDialog").close();render();showToast("Registro guardado correctamente");
});
function bindSearch(){const s=document.querySelector(".search");if(!s)return;s.oninput=()=>{const q=s.value.toLowerCase(),rows=route==="products"?state.products.filter(x=>Object.values(x).some(v=>String(v).toLowerCase().includes(q))):null;if(rows)document.querySelector("#tableResult").innerHTML=productTable(rows)}}
window.showToast=msg=>{const t=document.querySelector("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)};
render();
