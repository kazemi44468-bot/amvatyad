(() => {
const $ = (s,root=document) => root.querySelector(s);
const menu = $('.main-nav'), toggle = $('.menu-toggle');
toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰';}));
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}};
const write=(key,data)=>{try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}};
const esc=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const form=$('#memorial-form'), result=$('#form-result');
function renderMemorials(){
 const list=read('amvatyad-memorials'), section=$('#saved-section'), target=$('#saved-memorials');
 if(!list.length){section.hidden=true;return}
 section.hidden=false;
 target.innerHTML=list.map((m,i)=>`<article class="saved-card"><h3>به یاد ${esc(m.personName)}</h3>${m.memoryText?'<p>'+esc(m.memoryText)+'</p>':''}<small>${m.birthDate?'تولد: '+esc(m.birthDate)+' · ':''}${m.deathDate?'درگذشت: '+esc(m.deathDate):''}</small><br><button type="button" data-delete-memorial="${i}">حذف پیش‌نویس</button></article>`).join('');
 target.querySelectorAll('[data-delete-memorial]').forEach(b=>b.addEventListener('click',()=>{const items=read('amvatyad-memorials');items.splice(Number(b.dataset.deleteMemorial),1);write('amvatyad-memorials',items);renderMemorials()}));
}
form?.addEventListener('submit',e=>{
 e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());data.createdAt=new Date().toISOString();
 const list=read('amvatyad-memorials');list.unshift(data);
 if(!write('amvatyad-memorials',list)){result.textContent='ذخیره‌سازی در این مرورگر ممکن نشد. لطفاً تنظیمات مرورگر را بررسی کنید.';return}
 result.textContent='پیش‌نویس یادمان در همین مرورگر ذخیره شد. می‌توانید آن را در بخش پیش‌نویس‌ها ببینید.';
 form.reset();renderMemorials();$('#saved-section')?.scrollIntoView({behavior:'smooth',block:'start'});
});
renderMemorials();
const modal=$('#story-modal'),open=$('#open-story'),close=$('#close-story'),storyForm=$('#story-form'),storyResult=$('#story-result');
function renderStories(){
 const stories=read('amvatyad-stories'),target=$('#saved-stories');
 target.innerHTML=stories.map(s=>`<article class="saved-story"><b>${esc(s.person||'خاطره‌ای ماندگار')}</b><p>${esc(s.body)}</p><small>${s.author?'از طرف '+esc(s.author)+' · ':''}${new Date(s.createdAt).toLocaleDateString('fa-IR')}</small></article>`).join('');
}
function openModal(){modal.hidden=false;document.body.style.overflow='hidden';$('#story-person').focus()}
function closeModal(){modal.hidden=true;document.body.style.overflow='';open?.focus()}
open?.addEventListener('click',openModal);close?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden)closeModal()});
storyForm?.addEventListener('submit',e=>{
 e.preventDefault();const data={person:$('#story-person').value.trim(),author:$('#story-author').value.trim(),body:$('#story-body').value.trim(),createdAt:new Date().toISOString()};
 const list=read('amvatyad-stories');list.unshift(data);
 if(!write('amvatyad-stories',list)){storyResult.textContent='ذخیره‌سازی در این مرورگر ممکن نشد.';return}
 storyResult.textContent='خاطره در همین مرورگر ذخیره شد.';storyForm.reset();renderStories();
});
renderStories();

const intentionButtons=document.querySelectorAll('[data-intention]');
const intentionFeedback=$('#intention-feedback');
const readIntentions=()=>{try{return JSON.parse(localStorage.getItem('amvatyad-intentions')||'[]')}catch{return []}};
const saveIntentions=items=>{try{localStorage.setItem('amvatyad-intentions',JSON.stringify(items));return true}catch{return false}};
function renderIntentions(){const target=$('#saved-intentions'),empty=$('#empty-intentions');if(!target)return;const items=readIntentions();target.innerHTML=items.map((item,i)=>'<article class="saved-intention-card"><h3>'+esc(item.type)+'</h3><p>'+esc(item.note)+'</p>'+(item.person?'<small>به یاد '+esc(item.person)+'</small><br>':'')+'<small>'+esc(item.date||'')+'</small><button type="button" data-delete-intention="'+i+'">حذف از دفتر من</button></article>').join('');if(empty)empty.hidden=items.length>0;target.querySelectorAll('[data-delete-intention]').forEach(button=>button.addEventListener('click',()=>{const list=readIntentions();list.splice(Number(button.dataset.deleteIntention),1);saveIntentions(list);renderIntentions()}))}
intentionButtons.forEach(button=>button.addEventListener('click',()=>{const items=readIntentions(),type=button.dataset.intention;items.unshift({type,note:'نیت دارم '+type+' را به یاد عزیزان درگذشته انجام دهم.',date:new Date().toLocaleDateString('fa-IR')});if(!saveIntentions(items)){if(intentionFeedback)intentionFeedback.textContent='ذخیره نیت در این مرورگر ممکن نشد.';return}if(intentionFeedback)intentionFeedback.textContent='نیت «'+type+'» در دفتر این مرورگر ثبت شد.';renderIntentions()}));
const intentionForm=$('#personal-intention-form'),intentionResult=$('#personal-intention-result');
intentionForm?.addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(intentionForm).entries()),items=readIntentions();items.unshift({type:data.type,note:data.note.trim(),person:data.person.trim(),date:new Date().toLocaleDateString('fa-IR')});if(!saveIntentions(items)){if(intentionResult)intentionResult.textContent='ذخیره نیت در این مرورگر ممکن نشد.';return}if(intentionResult)intentionResult.textContent='نیت شما در دفتر این مرورگر ذخیره شد.';intentionForm.reset();renderIntentions()});
renderIntentions();
})();