(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const H=/^\d{4}-\d{2}-\d{2}$/;function S(e=new Date){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${r}`}function _(e){return typeof e=="string"&&H.test(e)?e:typeof e=="string"&&H.test(e.slice(0,10))?e.slice(0,10):S()}function R(e){const[t,n,r]=_(e).split("-").map(Number);return new Date(t,n-1,r,0,0,0,0)}function z(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate())}function v(e,t){const n=new Date(e);return n.setDate(n.getDate()+t),n}function ye(e){const t=(e.getDay()+6)%7;return v(z(e),-t)}function be(e){return new Date(e.getFullYear(),e.getMonth(),1)}function ve(e){return new Date(e.getFullYear(),e.getMonth()+1,0)}function K(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}function we(e,t){const n=v(z(t),-1);return K(e,n)}function Se(e,t,n=new Date){const r=R(e),a=new Date(t),o=Number.isNaN(a.getTime())?r:a,i=new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(o);return K(r,n)?`Today, ${i}`:we(r,n)?`Yesterday, ${i}`:`${new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(r)}, ${i}`}const Q=1,P=["avoid","cheaper","income"],E={avoid:{label:"Avoided",amountLabel:"Amount saved",icon:"local_cafe",toneClassName:"bg-orange-100 text-orange-600"},cheaper:{label:"Cheaper",amountLabel:"Savings amount",icon:"sell",toneClassName:"bg-blue-100 text-blue-600"},income:{label:"Income",amountLabel:"Income amount",icon:"work",toneClassName:"bg-purple-100 text-purple-600"}},$e=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2});function X(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`entry-${Date.now()}-${Math.random().toString(16).slice(2,10)}`}function l(e){const t=Number(e);return Number.isFinite(t)?Math.max(0,Math.round(t*100)/100):0}function Z(e){return typeof e=="string"&&P.includes(e)}function W(e,t,n,r){return l(e==="avoid"?n:e==="cheaper"?n-t:r)}function N(e,t){if(!Z(e.type))return{entry:null,error:"Please choose a valid entry type."};const n=new Date().toISOString(),r=String(e.note||"").trim(),a=_(e.date);let o=0,i=0,d=0;if(e.type==="avoid"&&(d=l(e.amount),i=d,d<=0))return{entry:null,error:"Amount saved must be greater than $0.00."};if(e.type==="cheaper"){if(i=l(e.referencePrice),o=l(e.paidPrice),i<=0)return{entry:null,error:"Usual price must be greater than $0.00."};if(W(e.type,o,i,d)<=0)return{entry:null,error:"Cheaper entry must save more than $0.00."}}if(e.type==="income"&&(d=l(e.amount),d<=0))return{entry:null,error:"Income amount must be greater than $0.00."};const u=W(e.type,o,i,d);return{entry:{id:t?.id||X(),date:a,type:e.type,paidPrice:o,referencePrice:i,potential:u,note:r,createdAt:t?.createdAt||n,updatedAt:n},error:""}}function De(e){if(!e||typeof e!="object")return null;const t=e;if(!Z(t.type))return null;const n=typeof t.id=="string"&&t.id?t.id:X(),r=typeof t.note=="string"?t.note.trim():"",a=_(typeof t.date=="string"?t.date:void 0),o=typeof t.createdAt=="string"?t.createdAt:new Date(`${a}T00:00:00`).toISOString(),i=typeof t.updatedAt=="string"?t.updatedAt:o;let d=0,u=0,p=0;return t.type==="avoid"&&(u=l(t.referencePrice??t.potential),p=u,p<=0)||t.type==="cheaper"&&(d=l(t.paidPrice),u=l(t.referencePrice),p=l(u-d),u<=0||p<=0)||t.type==="income"&&(p=l(t.potential??t.referencePrice??t.paidPrice),p<=0)?null:{id:n,date:a,type:t.type,paidPrice:d,referencePrice:u,potential:p,note:r,createdAt:o,updatedAt:i}}function ee(e){return[...e].sort((t,n)=>{const r=n.date.localeCompare(t.date);return r!==0?r:n.updatedAt.localeCompare(t.updatedAt)})}function T(e){return $e.format(l(e))}function Pe(e){return`+${T(e)}`}function Ee(e){return e.note?e.note:e.type==="avoid"?"Avoided purchase":e.type==="cheaper"?"Cheaper alternative":"Extra income"}function Te(e){return E[e].label}function Ae(e){return Se(e.date,e.updatedAt)}function ke(e){return e.type==="cheaper"?{type:e.type,note:e.note,date:e.date,paidPrice:e.paidPrice,referencePrice:e.referencePrice}:e.type==="avoid"?{type:e.type,note:e.note,date:e.date,amount:e.referencePrice}:{type:e.type,note:e.note,date:e.date,amount:e.potential}}const D={title:"Europe Trip",targetAmount:5e3,deadline:""};function te(e,t=D){const n=String(e?.title??t.title).trim()||D.title,r=l(e?.targetAmount??t.targetAmount),a=String(e?.deadline??t.deadline??"").trim(),o=/^\d{4}-\d{2}-\d{2}$/.test(a)?a:"";return{title:n,targetAmount:r,deadline:o}}function Ie(e,t){const n=l(e.reduce((o,i)=>o+l(i.potential),0)),r=l(t),a=r>0?n/r*100:0;return{totalSaved:n,targetAmount:r,progressPercent:Math.round(Math.max(0,a)),progressRingPercent:Math.max(0,Math.min(100,a))}}function y(e,t,n){let r=0;for(const a of e){const o=R(a.date);o>=t&&o<n&&(r+=l(a.potential))}return l(r)}function q(e,t){return t<=0?e>0?100:0:Math.round((e-t)/t*1e3)/10}function Me(e,t=new Date){const n=z(t),r=v(n,1),a=ye(t),o=v(a,-7),i=be(t),d=new Date(i.getFullYear(),i.getMonth()-1,1),u=y(e,n,r),p=y(e,a,r),$=y(e,i,r),U=y(e,o,a),Y=y(e,d,i),k=[];for(let f=6;f>=0;f-=1){const m=v(n,-f),xe=v(m,1),he=new Intl.DateTimeFormat("en-US",{weekday:"short"}).format(m).charAt(0);k.push({label:he,value:y(e,m,xe),date:S(m)})}const de=l(k.reduce((f,m)=>f+m.value,0)),ue=Math.max(1,t.getDate()),V=l($/ue),pe=ve(t).getDate(),fe=l(V*pe),B={avoid:0,cheaper:0,income:0};for(const f of e){const m=R(f.date);m>=i&&m<r&&(B[f.type]+=l(f.potential))}const[G,me]=Object.entries(B).sort((f,m)=>m[1]-f[1])[0]||[null,0],ge=G&&me>0?E[G].label:"No entries yet";return{todayTotal:u,weekTotal:p,monthTotal:$,previousWeekTotal:U,previousMonthTotal:Y,weekChangePercent:q(p,U),monthChangePercent:q($,Y),last7Total:de,series:k,averageDailySaved:V,topCategory:ge,projectedMonthly:fe}}const ne="potenzial-webapp.state";function re(){return{version:Q,goal:{...D},entries:[]}}function Ce(e){if(!e||typeof e!="object")return re();const t=e,n=te(t.goal,D),a=(Array.isArray(t.entries)?t.entries:Array.isArray(e)?e:[]).map(o=>De(o)).filter(o=>o!==null);return{version:Q,goal:n,entries:a}}function b(e){return JSON.parse(JSON.stringify(e))}function je(){try{const e=localStorage.getItem(ne);return e?JSON.parse(e):null}catch{return null}}function J(e){try{localStorage.setItem(ne,JSON.stringify(e))}catch{}}function Ne(){let e=Ce(je());(!e||typeof e!="object")&&(e=re()),J(e);function t(){J(e)}return{getState(){return{...b(e),entries:ee(b(e.entries))}},getEntryById(n){const r=e.entries.find(a=>a.id===n);return r?b(r):null},saveGoal(n){return e.goal=te(n,e.goal),t(),b(e.goal)},addEntry(n){const{entry:r,error:a}=N(n);return!r||a?{entry:null,error:a||"Could not save entry."}:(e.entries.push(r),t(),{entry:b(r),error:""})},updateEntry(n,r){const a=e.entries.findIndex(u=>u.id===n);if(a<0)return{entry:null,error:"Entry not found."};const o=e.entries[a],{entry:i,error:d}=N({...r,date:r.date||o.date},o);return!i||d?{entry:null,error:d||"Could not update entry."}:(e.entries[a]=i,t(),{entry:b(i),error:""})},deleteEntry(n){const r=e.entries.length;e.entries=e.entries.filter(o=>o.id!==n);const a=e.entries.length!==r;return a&&t(),a}}}function c(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}function Fe(e){const t=E[e];return`
    <div class="w-12 h-12 rounded-full ${t.toneClassName} flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined">${t.icon}</span>
    </div>
  `}function ae(e,t){return`
    <article class="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary/50 transition-all duration-200">
      <div class="flex items-center gap-4 min-w-0">
        ${Fe(e.type)}
        <div class="min-w-0">
          <h4 class="font-semibold text-slate-900 leading-tight mb-0.5 truncate">${c(Ee(e))}</h4>
          <p class="text-xs text-slate-500 font-medium">${c(Ae(e))} · ${c(Te(e.type))}</p>
        </div>
      </div>
      <div class="text-right shrink-0 pl-3">
        <span class="block font-bold text-primary text-lg">${Pe(e.potential)}</span>
        ${t?`<div class="mt-1 flex items-center justify-end gap-2">
                <button data-action="edit-entry" data-entry-id="${e.id}" class="text-xs font-semibold text-slate-600 hover:text-slate-900">Edit</button>
                <button data-action="delete-entry" data-entry-id="${e.id}" class="text-xs font-semibold text-rose-600 hover:text-rose-700">Delete</button>
              </div>`:""}
      </div>
    </article>
  `}function I(e,t,n,r){const a=e===t;return`
    <a href="#/${e}" data-action="navigate" data-route="${e}" class="flex flex-1 flex-col items-center gap-1 ${a?"text-primary":"text-slate-500 hover:text-primary"} transition-colors">
      <div class="h-6 flex items-center justify-center ${a?"":"group-hover:scale-110"}">
        <span class="material-symbols-outlined ${a?"font-variation-settings-fill":""} text-[24px]">${n}</span>
      </div>
      <span class="text-[11px] font-medium tracking-wide">${r}</span>
    </a>
  `}function Le(e){return`
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-slate-200 bg-white px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+18px)] z-30">
      <div class="flex items-center justify-between gap-4">
        ${I("home",e,"home","Home")}
        ${I("entries",e,"list","Entries")}
        ${I("insights",e,"bar_chart","Insights")}
      </div>
    </nav>
  `}function Oe(){return`
    <div class="fixed bottom-24 right-6 z-40">
      <button
        type="button"
        data-action="open-sheet"
        class="group flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Add entry"
      >
        <span class="material-symbols-outlined text-white text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  `}function M(e,t,n){return`
    <div class="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="bg-slate-100 rounded-full p-2 text-slate-500">
          <span class="material-symbols-outlined text-[20px]">${e}</span>
        </div>
        <p class="text-slate-500 text-sm font-medium">${c(t)}</p>
      </div>
      <p class="text-slate-900 text-base font-semibold text-right">${c(n)}</p>
    </div>
  `}function oe(e){return`
    <section class="p-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm">
      ${c(e)}
    </section>
  `}function F(e,t){const n=Math.round(e*10)/10;return`${n>=0?"+":""}${n}% ${t}`}function _e(e){return`Target: ${T(e)}`}function w(e){return T(e)}function Re(e,t){return`
    <div class="relative w-full max-w-[320px] aspect-square flex items-center justify-center mb-6">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36" aria-label="${e}% complete">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e7f3eb"
          stroke-width="2.5"
        ></path>
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#13ec5b"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-dasharray="${t}, 100"
        ></path>
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span class="text-5xl font-extrabold tracking-tight text-slate-900">${e}%</span>
        <span class="text-sm font-medium text-green-700 mt-1 uppercase tracking-wide">Complete</span>
      </div>
    </div>
  `}function ze(e){const t=e.recentEntries.length?e.recentEntries.map(n=>ae(n,!1)).join(""):oe("No activity yet. Tap + to add your first savings entry.");return`
    <header class="flex items-center justify-between px-6 pt-12 pb-4">
      <button class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-slate-900">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="text-lg font-bold tracking-tight">${c(e.goalTitle)}</h1>
      <button class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-slate-900" data-action="edit-goal" aria-label="Edit goal">
        <span class="material-symbols-outlined">settings</span>
      </button>
    </header>

    <main class="flex-1 flex flex-col items-center justify-start pt-6 px-6 overflow-y-auto pb-36">
      ${Re(e.progressPercent,e.progressRingPercent)}

      <section class="text-center mb-8">
        <p class="text-sm font-medium text-green-700 mb-1">Total Saved</p>
        <h2 class="text-6xl font-extrabold tracking-tight text-slate-900 mb-2">${w(e.totalSaved)}</h2>
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-green-700 text-xs font-semibold">
          ${_e(e.targetAmount)}
        </div>
      </section>

      <section class="w-full max-w-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[2rem] leading-none font-bold text-slate-900">Recent Activity</h3>
          <button class="text-xl font-medium text-primary hover:underline" data-action="navigate" data-route="entries">See All</button>
        </div>
        <div class="space-y-3">${t}</div>
      </section>
    </main>
  `}function Ue(e){const t=F(e.monthChangePercent,"from last month"),n=e.entries.length?e.entries.map(r=>ae(r,!0)).join(""):oe("No entries yet. Add entries to build your activity history.");return`
    <header class="sticky top-0 z-10 bg-background-light/90 backdrop-blur-md border-b border-slate-200">
      <div class="px-4 py-3 flex items-center justify-between">
        <button class="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600" data-action="navigate" data-route="home">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">Activity History</h1>
        <button class="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600" data-action="navigate" data-route="insights">
          <span class="material-symbols-outlined">insights</span>
        </button>
      </div>
    </header>

    <main class="flex-1 px-4 py-6 overflow-y-auto pb-36">
      <section class="mb-8 p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-sm font-medium text-slate-600 mb-1">Total Saved This Month</p>
          <h2 class="text-5xl font-bold text-slate-900 tracking-tight">${w(e.monthTotal)}</h2>
          <div class="mt-4 flex items-center gap-2 text-sm text-green-700">
            <span class="material-symbols-outlined text-[18px]">trending_up</span>
            <span class="font-semibold">${c(t)}</span>
          </div>
        </div>
        <div class="absolute -right-8 -bottom-16 w-32 h-32 rounded-full bg-primary/20 blur-2xl"></div>
      </section>

      <div class="flex items-center justify-between mb-4">
        <h3 class="text-3xl font-bold text-slate-900">Recent Entries</h3>
      </div>

      <section class="flex flex-col gap-3">${n}</section>
    </main>
  `}function Ye(e){const t=Math.max(1,...e.series.map(n=>n.value));return e.series.map(n=>`
        <div class="flex flex-col items-center gap-2 w-full h-full justify-end">
          <div class="w-full bg-primary/20 rounded-t-sm relative flex items-end" style="height:${n.value<=0?10:Math.max(12,Math.round(n.value/t*100))}%;">
            <div class="w-full bg-primary rounded-t-sm h-full opacity-90"></div>
          </div>
          <p class="text-slate-400 text-xs font-semibold">${c(n.label)}</p>
        </div>
      `).join("")}function Ve(e){const{insights:t}=e;return`
    <header class="sticky top-0 z-10 bg-background-light/90 backdrop-blur-md border-b border-slate-200">
      <div class="flex items-center p-4 pb-3 justify-between">
        <button class="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 transition-colors" data-action="navigate" data-route="home">
          <span class="material-symbols-outlined !text-[24px]">arrow_back</span>
        </button>
        <h2 class="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Insights</h2>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto pb-36">
      <div class="flex flex-wrap gap-4 p-4">
        <section class="flex min-w-[158px] flex-1 flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-slate-500 text-sm font-medium">Total Saved (Week)</p>
            <span class="material-symbols-outlined text-primary text-sm">trending_up</span>
          </div>
          <p class="text-slate-900 tracking-tight text-4xl font-bold mt-1">${w(t.weekTotal)}</p>
          <p class="text-primary text-sm font-medium bg-primary/10 w-fit px-2 py-0.5 rounded text-[12px]">${c(F(t.weekChangePercent,"vs last week"))}</p>
        </section>

        <section class="flex min-w-[158px] flex-1 flex-col gap-1 rounded-xl p-5 bg-white border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-slate-500 text-sm font-medium">Total Saved (Month)</p>
            <span class="material-symbols-outlined text-primary text-sm">calendar_month</span>
          </div>
          <p class="text-slate-900 tracking-tight text-4xl font-bold mt-1">${w(t.monthTotal)}</p>
          <p class="text-primary text-sm font-medium bg-primary/10 w-fit px-2 py-0.5 rounded text-[12px]">${c(F(t.monthChangePercent,"vs last month"))}</p>
        </section>
      </div>

      <section class="px-4 py-2">
        <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div class="flex items-end justify-between mb-6">
            <div class="flex flex-col gap-1">
              <p class="text-slate-500 text-sm font-medium uppercase tracking-wider">Last 7 Days</p>
              <p class="text-slate-900 tracking-tight text-5xl font-bold truncate">${T(t.last7Total)}</p>
            </div>
            <div class="flex gap-1 items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span class="material-symbols-outlined text-primary text-sm">bar_chart</span>
              <p class="text-slate-600 text-xs font-semibold">Weekly View</p>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-3 h-56 items-end justify-items-center w-full">
            ${Ye(t)}
          </div>
        </div>
      </section>

      <section class="p-4 flex flex-col gap-3">
        ${M("savings","Average Daily Saved",w(t.averageDailySaved))}
        ${M("local_offer","Top Category",t.topCategory)}
        ${M("flag","Projected Monthly",w(t.projectedMonthly))}
      </section>
    </main>
  `}function C(e,t){const n=e===t?"checked":"";return`
    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white has-[:checked]:shadow-sm transition-all duration-200 text-slate-500 has-[:checked]:text-slate-900 text-sm font-semibold leading-normal group">
      <span class="truncate">${c(E[e].label)}</span>
      <input ${n} class="invisible w-0 absolute" name="type" type="radio" value="${e}" />
    </label>
  `}function Be(e){if(!e.open)return"";const t=e.type==="cheaper",n=!t,r=e.type==="income"?"Income amount":"Amount saved",a=e.mode==="edit"?"Edit Savings":"Add Savings",o=e.mode==="edit"?"Save Changes":"Save Entry";return`
    <div class="fixed inset-0 z-50 flex flex-col justify-end items-stretch bg-black/40 backdrop-blur-sm" role="presentation">
      <button type="button" aria-label="Close" data-action="close-sheet" class="absolute inset-0"></button>

      <section class="relative flex flex-col items-stretch bg-background-light rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.15)] ring-1 ring-white/10 max-w-md w-full mx-auto">
        <div class="flex h-8 w-full items-center justify-center pt-3 pb-1">
          <div class="h-1.5 w-12 rounded-full bg-slate-300"></div>
        </div>

        <div class="px-6 pb-4 pt-2 text-center relative">
          <h3 class="text-slate-900 tracking-tight text-3xl font-bold leading-tight">${a}</h3>
          <button type="button" class="absolute right-6 top-2 text-slate-400 hover:text-slate-600 transition-colors" data-action="close-sheet" aria-label="Close">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form id="entry-sheet-form" class="pb-[calc(env(safe-area-inset-bottom)+24px)]">
          <input type="hidden" name="date" value="${c(e.date)}" />

          <div class="px-6 pb-6 pt-2">
            <div class="flex h-12 w-full items-center justify-center rounded-xl bg-slate-200 p-1">
              ${C("avoid",e.type)}
              ${C("cheaper",e.type)}
              ${C("income",e.type)}
            </div>
          </div>

          <div class="flex flex-col px-6 pb-4 ${n?"":"hidden"}">
            <label class="flex flex-col w-full group">
              <p class="text-slate-500 text-sm font-medium mb-2 pl-1">${r}</p>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-slate-400 text-3xl font-semibold material-symbols-outlined">attach_money</span>
                <input
                  name="amount"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 bg-slate-100 border-0 focus:ring-2 focus:ring-primary/50 focus:bg-white h-20 pl-12 pr-4 text-4xl font-bold tracking-tight placeholder:text-slate-300 transition-all shadow-inner"
                  inputmode="decimal"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value="${c(e.amount)}"
                />
              </div>
            </label>
          </div>

          <div class="px-6 pb-4 ${t?"":"hidden"}">
            <div class="grid gap-4">
              <label class="grid gap-2">
                <span class="text-sm font-medium text-slate-500">Usual price</span>
                <input
                  name="referencePrice"
                  class="h-14 rounded-xl border-0 bg-slate-100 focus:ring-2 focus:ring-primary/50 px-4 text-lg font-semibold"
                  inputmode="decimal"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value="${c(e.referencePrice)}"
                />
              </label>
              <label class="grid gap-2">
                <span class="text-sm font-medium text-slate-500">Paid price</span>
                <input
                  name="paidPrice"
                  class="h-14 rounded-xl border-0 bg-slate-100 focus:ring-2 focus:ring-primary/50 px-4 text-lg font-semibold"
                  inputmode="decimal"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value="${c(e.paidPrice)}"
                />
              </label>
            </div>
          </div>

          <div class="flex flex-col px-6 pb-5">
            <label class="flex flex-col w-full group">
              <p class="text-slate-500 text-sm font-medium mb-2 pl-1">Note (optional)</p>
              <div class="relative">
                <input
                  name="note"
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 bg-slate-100 border-0 focus:ring-2 focus:ring-primary/50 focus:bg-white h-14 pl-4 pr-10 text-base font-normal leading-normal placeholder:text-slate-400 transition-all"
                  placeholder="Coffee, impulse buy..."
                  type="text"
                  maxlength="140"
                  value="${c(e.note)}"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined pointer-events-none text-xl">edit_note</span>
              </div>
            </label>
          </div>

          <p class="px-6 pb-4 text-sm font-medium text-rose-600 min-h-[24px]">${c(e.error)}</p>

          <div class="px-6 pb-6">
            <button type="submit" class="w-full h-14 flex items-center justify-center rounded-xl bg-primary text-slate-900 font-bold text-3xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:bg-green-400">
              ${o}
            </button>
          </div>
        </form>
      </section>
    </div>
  `}const Ge=["home","entries","insights"];function se(e){return Ge.includes(e)}function L(e=window.location.hash){const t=e.replace(/^#\/?/,"").trim().toLowerCase();return se(t)?t:"home"}function A(e="avoid"){return{type:e,amount:"",referencePrice:"",paidPrice:"",note:"",date:S()}}function j(e){return e>0?e.toFixed(2):""}function He(e){const t=x.getEntryById(e);if(!t)return A();const n=ke(t);return{type:n.type,amount:j(n.amount??0),referencePrice:j(n.referencePrice??0),paidPrice:j(n.paidPrice??0),note:n.note||"",date:n.date||S()}}function We(e){const t=new FormData(e),n=String(t.get("type")||"avoid"),r=P.includes(n)?n:"avoid",a={type:r,date:String(t.get("date")||S()),note:String(t.get("note")||"")};return r==="cheaper"?(a.referencePrice=Number(t.get("referencePrice")||0),a.paidPrice=Number(t.get("paidPrice")||0)):a.amount=Number(t.get("amount")||0),a}function O(e){const t=new FormData(e),n=String(t.get("type")||"avoid");return{type:P.includes(n)?n:"avoid",amount:String(t.get("amount")||""),referencePrice:String(t.get("referencePrice")||""),paidPrice:String(t.get("paidPrice")||""),note:String(t.get("note")||""),date:String(t.get("date")||S())}}function qe(e){const t=`#/${e}`;if(window.location.hash!==t){window.location.hash=t;return}h=e,g()}function Je(){s.open=!0,s.mode="create",s.editingId=null,s.error="",s.draft=A("avoid"),g()}function Ke(e){const t=x.getEntryById(e);t&&(s.open=!0,s.mode="edit",s.editingId=t.id,s.error="",s.draft=He(e),g())}function ie(){s.open=!1,s.mode="create",s.editingId=null,s.error="",s.draft=A(),g()}function Qe(){const e=x.getState(),t=window.prompt("Goal title",e.goal.title);if(t===null)return;const n=window.prompt("Target amount (USD)",String(e.goal.targetAmount));if(n===null)return;const r=Number(n);x.saveGoal({title:t,targetAmount:Number.isFinite(r)?r:e.goal.targetAmount}),g()}function Xe(e){!x.getEntryById(e)||!window.confirm("Delete this entry?")||(x.deleteEntry(e),g())}function Ze(e){s.draft=O(e);const t=We(e),n=N(t);if(!n.entry||n.error){s.error=n.error,g();return}const r=s.mode==="edit"&&s.editingId?x.updateEntry(s.editingId,t):x.addEntry(t);if(r.error){s.error=r.error,g();return}ie()}function g(){const e=x.getState(),t=ee(e.entries),n=Ie(t,e.goal.targetAmount),r=Me(t);let a="";h==="home"&&(a=ze({goalTitle:e.goal.title,totalSaved:n.totalSaved,targetAmount:n.targetAmount,progressPercent:n.progressPercent,progressRingPercent:n.progressRingPercent,recentEntries:t.slice(0,3)})),h==="entries"&&(a=Ue({monthTotal:r.monthTotal,monthChangePercent:r.monthChangePercent,entries:t})),h==="insights"&&(a=Ve({insights:r})),le.innerHTML=`
    <div class="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background-light font-display text-slate-900">
      ${a}
      ${Oe()}
      ${Le(h)}
      ${Be({open:s.open,mode:s.mode,type:s.draft.type,amount:s.draft.amount,referencePrice:s.draft.referencePrice,paidPrice:s.draft.paidPrice,note:s.draft.note,date:s.draft.date,error:s.error})}
    </div>
  `}function et(e){const t=e.target;if(!t)return;const n=t.closest("[data-action]");if(!n)return;const r=n.dataset.action||"";if(r==="navigate"){e.preventDefault();const a=n.dataset.route||"home";qe(se(a)?a:"home");return}if(r==="open-sheet"){e.preventDefault(),Je();return}if(r==="close-sheet"){e.preventDefault(),ie();return}if(r==="edit-entry"){const a=n.dataset.entryId;a&&(e.preventDefault(),Ke(a));return}if(r==="delete-entry"){const a=n.dataset.entryId;a&&(e.preventDefault(),Xe(a));return}r==="edit-goal"&&(e.preventDefault(),Qe())}function tt(e){const t=e.target;if(!t||!s.open)return;const n=t.closest("form");if(!(!(n instanceof HTMLFormElement)||n.id!=="entry-sheet-form")){if(t.name==="type"){const r=t.value;P.includes(r)&&(s.draft={...O(n),type:r},s.error="",g());return}s.draft=O(n)}}function nt(e){const t=e.target;t instanceof HTMLFormElement&&t.id==="entry-sheet-form"&&(e.preventDefault(),Ze(t))}const x=Ne();let h=L();const s={open:!1,mode:"create",editingId:null,error:"",draft:A()};let le;function rt(e){le=e,window.location.hash||(window.location.hash="#/home"),h=L(),window.addEventListener("hashchange",()=>{h=L(),g()}),e.addEventListener("click",et),e.addEventListener("input",tt),e.addEventListener("submit",nt),g()}const ce=document.querySelector("#app");if(!ce)throw new Error("App root element not found.");rt(ce);
