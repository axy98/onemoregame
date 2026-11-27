/* One More Game · service worker: recibe notificaciones push con la app cerrada */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("push",e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(x){d={title:"One More Game",body:e.data?e.data.text():""}}
  e.waitUntil((async()=>{
    const cl=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    if(cl.some(c=>c.visibilityState==="visible"))return; /* si la app está abierta ya avisa ella */
    await self.registration.showNotification(d.title||"One More Game",{
      body:d.body||"",tag:d.tag||undefined,renotify:!!d.tag,
      icon:"icon-192.png",badge:"icon-192.png",data:{tab:d.tab||""}});
  })())});
self.addEventListener("notificationclick",e=>{
  e.notification.close();const tab=(e.notification.data||{}).tab||"";
  e.waitUntil((async()=>{
    const cl=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    if(cl.length){const c=cl[0];try{await c.focus()}catch(x){}c.postMessage({omgTab:tab});return}
    await self.clients.openWindow("./"+(tab?"#"+tab:""))})())});
