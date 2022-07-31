(function(win, DVC) {
     var flDiv = document.getElementById('flyer-loading');
     var cDiv = document.createElement('div');
     var lDiv = document.createElement('div');
     var ftDiv;
     lDiv.className = 'logo';
     cDiv.className = 'content';
     if (DVC.flyer.hidePopularize) {
         flDiv.className = flDiv.className +' rmlogo';
     }else{
         flDiv.className = flDiv.className +' normal';
         ftDiv =  document.createElement('div');
         ftDivP = document.createElement('p');
         ftDivA = document.createElement('a');
         ftDivA.innerText = '使用Davinci创作';
         ftDivA.href='davinci.echoes.link/'; 
         ftDivA.target = '_blank';
         ftDivP.appendChild(ftDivA);
         ftDiv.appendChild(ftDivP);
         ftDiv.className = 'footer';
     }
     cDiv.appendChild(lDiv);
     flDiv.appendChild(cDiv);
     if(ftDiv){
        flDiv.appendChild(ftDiv);
     }
 }(window, window.__DVC));