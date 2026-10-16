(function(){window.showToast=window.showToast||function(message){const toast=document.getElementById('toast'),label=document.getElementById('toastText');if(label)label.textContent=message||'انجام شد';if(toast){toast.classList.add('show');window.setTimeout(()=>toast.classList.remove('show'),2800)}};const b=document.getElementById('burger'),m=document.getElementById('mobileMenu');if(b&&m){b.addEventListener('click',()=>{m.classList.toggle('open');b.classList.toggle('active');});m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');b.classList.remove('active')}));}const items=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible','in');io.unobserve(e.target)}}),{threshold:.08});items.forEach(i=>io.observe(i));}else items.forEach(i=>i.classList.add('visible','in'));
document.querySelectorAll('[data-copy-text]').forEach(btn=>btn.addEventListener('click',async()=>{const text=btn.getAttribute('data-copy-text')||'';try{await navigator.clipboard.writeText(text);const old=btn.textContent;btn.textContent='کپی شد';setTimeout(()=>btn.textContent=old,1500)}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();btn.textContent='کپی شد';setTimeout(()=>btn.textContent='کپی متن',1500)}}));
const wt=document.querySelector('[data-writer-form]');
if(wt){const name=wt.querySelector('[name="person"]'),relation=wt.querySelector('[name="relation"]'),tone=wt.querySelector('[name="tone"]'),kind=wt.querySelector('[name="kind"]'),out=wt.querySelector('[name="result"]');
const samples={
 condolence:'با اندوه فراوان، درگذشت عزیزتان را تسلیت می‌گوییم. برای آن مرحوم آرامش و برای شما و خانواده محترمتان شکیبایی و دلگرمی آرزو داریم.',
 obituary:'با نهایت تأسف و تأثر، درگذشت '+(name.value||'شادروان')+' را به آگاهی خویشاوندان و دوستان می‌رسانیم. یاد و خاطره ایشان همواره در دل دوستدارانشان زنده خواهد ماند.',
 anniversary:'در سالروز پرواز عزیزمان، یاد مهربانی‌ها، نگاه و خاطرات ارزشمندش را گرامی می‌داریم. گذر زمان از جای خالی او نمی‌کاهد؛ اما یاد نیکش همچنان همراه ماست.',
 invitation:'با احترام، از خویشاوندان، دوستان و آشنایان دعوت می‌کنیم در مراسم یادبود عزیز از دست‌رفته‌مان حضور یابند و با یادکرد نیک او، مایه دلگرمی خانواده باشند.',
 memorial:'نام و یاد '+(name.value||'عزیز از دست‌رفته‌مان')+' برای ما با مهربانی، خاطرات روشن و لحظه‌هایی گره خورده است که هیچ‌گاه فراموش نخواهند شد. این یادمان را برای حفظ روایت زندگی و به اشتراک گذاشتن خاطرات ارزشمند او ساخته‌ایم.',
 letter:'عزیز دلمان، نبودنت هنوز در لحظه‌های ساده زندگی احساس می‌شود. از تو خاطره‌هایی داریم که با گذشت زمان رنگ نمی‌بازند؛ مهربانی‌هایت در رفتار ما و یاد تو در دل ما ادامه دارد.'
};
function build(){let t=samples[kind.value]||samples.memorial;const n=name.value.trim();if(n)t=t.replace(/عزیز از دست‌رفته‌مان|شادروان|عزیزمان/g,n);if(tone.value==='formal')t=t.replace(/عزیز دلمان/g,'گرامی‌مان').replace(/نبودنت هنوز در لحظه‌های ساده زندگی احساس می‌شود/g,'یاد و خاطره شما همواره گرامی خواهد ماند');if(tone.value==='short')t=t.split('. ').slice(0,2).join('. ')+'.';out.value=t;}
wt.querySelectorAll('[data-kind]').forEach(btn=>btn.addEventListener('click',()=>{kind.value=btn.getAttribute('data-kind');wt.querySelectorAll('[data-kind]').forEach(x=>x.classList.toggle('active',x===btn));build()}));wt.querySelector('[data-generate]').addEventListener('click',build);wt.querySelector('[data-copy-result]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(out.value);wt.querySelector('[data-copy-result]').textContent='متن کپی شد'}catch(e){out.select();document.execCommand('copy');wt.querySelector('[data-copy-result]').textContent='متن کپی شد'}});wt.querySelector('[data-download-result]').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([out.value],{type:'text/plain;charset=utf-8'}));a.download='متن-یادبود.txt';a.click();URL.revokeObjectURL(a.href)});build();}
})();

/* FAQ accordions and shareable/downloadable resource cards */
(function(){
  document.querySelectorAll('.faq-q').forEach(function(button){
    if(button.dataset.faqReady) return;
    button.dataset.faqReady='1';
    const item=button.closest('.faq-item');
    const answer=item&&item.querySelector('.faq-a');
    if(!item||!answer)return;
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls',answer.id||(answer.id='faq-answer-'+Math.random().toString(36).slice(2,9)));
    answer.hidden=false;
    answer.style.maxHeight='0px';
    button.addEventListener('click',function(){
      const opening=!item.classList.contains('open');
      item.classList.toggle('open',opening);
      button.setAttribute('aria-expanded',String(opening));
      answer.style.maxHeight=opening?answer.scrollHeight+'px':'0px';
      const icon=button.querySelector('.faq-icon');
      if(icon) icon.setAttribute('aria-hidden','true');
    });
  });
  document.querySelectorAll('[data-bank-search]').forEach(function(input){
    const target=document.getElementById(input.dataset.bankSearch);
    if(!target)return;
    const cards=Array.from(target.querySelectorAll('.bank-card'));
    const filter=document.querySelector('[data-bank-filter="'+input.dataset.bankSearch+'"]');
    const empty=document.querySelector('[data-bank-empty="'+input.dataset.bankSearch+'"]');
    function apply(){
      const q=input.value.trim().toLocaleLowerCase('fa');
      const cat=filter?filter.value:'all';let count=0;
      cards.forEach(card=>{
        const text=(card.innerText||'').toLocaleLowerCase('fa');
        const visible=(!q||text.includes(q))&&(cat==='all'||card.dataset.category===cat);
        card.hidden=!visible;if(visible)count++;
      });
      if(empty)empty.classList.toggle('show',count===0);
    }
    input.addEventListener('input',apply);if(filter)filter.addEventListener('change',apply);
  });
  document.querySelectorAll('[data-share-url]').forEach(button=>button.addEventListener('click',async function(){
    const url=new URL(button.dataset.shareUrl,location.href).href;
    const title=button.dataset.shareTitle||document.title;
    try{
      if(navigator.share) await navigator.share({title:title,text:title,url:url});
      else if(navigator.clipboard){await navigator.clipboard.writeText(url);window.showToast('پیوند برای ارسال کپی شد');}
      else {const box=document.createElement('textarea');box.value=url;document.body.appendChild(box);box.select();document.execCommand('copy');box.remove();window.showToast('پیوند برای ارسال کپی شد');}
    }catch(e){if(e&&e.name!=='AbortError')window.showToast('امکان اشتراک‌گذاری مستقیم نبود');}
  }));
  document.querySelectorAll('[data-share-text]').forEach(button=>button.addEventListener('click',async function(){
    const text=button.dataset.shareText||'';
    try{if(navigator.share)await navigator.share({title:button.dataset.shareTitle||'اموات یاد',text:text});else{await navigator.clipboard.writeText(text);window.showToast('متن برای ارسال کپی شد');}}
    catch(e){if(e&&e.name!=='AbortError'){const box=document.createElement('textarea');box.value=text;document.body.appendChild(box);box.select();document.execCommand('copy');box.remove();window.showToast('متن برای ارسال کپی شد');}}
  }));
})();

/* Download a selected text as a UTF-8 text file. */
document.querySelectorAll('[data-download-text]').forEach(function(button){
  button.addEventListener('click',function(){
    const blob=new Blob([button.dataset.downloadText||''],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=button.dataset.downloadName||'متن-یادبود.txt';
    document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    window.showToast('فایل متن آماده شد');
  });
});
