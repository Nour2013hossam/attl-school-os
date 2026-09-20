"use client";

import {createContext,useContext,useEffect,useMemo,useState} from "react";

type Language="en"|"ar";
type Theme="system"|"light"|"dark";
type Preferences={language:Language;theme:Theme;emailNotifications:boolean;pushNotifications:boolean;profileVisible:boolean};

const defaults:Preferences={language:"en",theme:"system",emailNotifications:true,pushNotifications:true,profileVisible:true};
const PreferenceContext=createContext<{
 preferences:Preferences;
 language:Language;
 theme:Theme;
 setLanguage:(language:Language)=>void;
 setTheme:(theme:Theme)=>void;
}>{preferences:defaults,language:"en",theme:"system",setLanguage:()=>{},setTheme:()=>{}};

function applyTheme(theme:Theme){
  const dark=theme==="dark" || (theme==="system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark",dark);
  document.documentElement.style.colorScheme=dark?"dark":"light";
}
function applyLanguage(language:Language){
  document.documentElement.lang=language;
  document.documentElement.dir=language==="ar"?"rtl":"ltr";
}

export function PreferencesProvider({children}:{children:React.ReactNode}){
 const[preferences,setPreferences]=useState<Preferences>(defaults);
 const[ready,setReady]=useState(false);

 useEffect(()=>{
   const stored=localStorage.getItem("attl-preferences");
   if(stored){try{const p={...defaults,...JSON.parse(stored)};setPreferences(p);applyTheme(p.theme);applyLanguage(p.language);}catch{}}
   Promise.resolve(fetch("/api/settings",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(d=>{
     if(d?.preferences){setPreferences(d.preferences);localStorage.setItem("attl-preferences",JSON.stringify(d.preferences));applyTheme(d.preferences.theme);applyLanguage(d.preferences.language);}
   }).finally(()=>setReady(true))).catch(()=>setReady(true));
 },[]);

 useEffect(()=>{if(!ready)return;applyTheme(preferences.theme);applyLanguage(preferences.language);localStorage.setItem("attl-preferences",JSON.stringify(preferences));},[preferences,ready]);

 useEffect(()=>{
   const media=window.matchMedia("(prefers-color-scheme: dark)");
   const fn=()=>{if(preferences.theme==="system")applyTheme("system");};
   media.addEventListener?.("change",fn);
   return()=>media.removeEventListener?.("change",fn);
 },[preferences.theme]);

 async function update(patch:Partial<Preferences>){
   const next={...preferences,...patch}; setPreferences(next);
   await fetch("/api/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(next)}).catch(()=>{});
 }

 const value=useMemo(()=>({preferences,language:preferences.language,theme:preferences.theme,setLanguage:(v:Language)=>void update({language:v}),setTheme:(v:Theme)=>void update({theme:v})}),[preferences]);
 return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}
export function usePreferences(){return useContext(PreferenceContext);}
