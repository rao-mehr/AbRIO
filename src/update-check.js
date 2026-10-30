var APP_VERSION='{{VERSION}}';
(function(){
  function checkUpdate(){
    if(!navigator.onLine||location.protocol==='file:')return;
    fetch('index.html?fresh='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.text():null;}).then(function(txt){
      if(!txt)return;var m=txt.match(/APP_VERSION='([0-9.]+)'/);if(!m||m[1]<=APP_VERSION)return;
      if(document.getElementById('upd'))return;
      var b=document.createElement('div');b.className='upd';b.id='upd';b.setAttribute('role','status');
      b.innerHTML='<span>Neue Version '+m[1]+' verfügbar</span><button type="button">Aktualisieren</button>';
      b.querySelector('button').addEventListener('click',function(){
        var done=function(){location.reload();};
        if(!('caches' in window))return done();
        caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k.indexOf('abrio')===0;}).map(function(k){
          return caches.open(k).then(function(c){var mk=function(){return new Response(txt,{headers:{'Content-Type':'text/html; charset=utf-8'}});};
            return Promise.all([c.put('./',mk()),c.put('./index.html',mk())]);});}));}).then(done,done);
      });
      document.body.appendChild(b);
    }).catch(function(){});
  }
  window.addEventListener('load',function(){setTimeout(checkUpdate,1500);});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')checkUpdate();});
})();
