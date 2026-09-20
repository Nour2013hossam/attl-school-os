"use client";
import {usePreferences} from "@/components/providers/preferences-provider";

export function QuickPreferences(){
 const{theme,language,setTheme,setLanguage}=usePreferences();
 const nextTheme=theme==="dark"?"light":"dark";
 return <div className="flex items-center gap-2">
   <button type="button" onClick={()=>setTheme(nextTheme)} aria-label="Toggle dark mode" title="Toggle dark mode" className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-black/[.025] text-xs text-black/45 hover:bg-white hover:text-black">{theme==="dark"?"☀":"◐"}</button>
   <button type="button" onClick={()=>setLanguage(language==="en"?"ar":"en")} aria-label="Switch language" title="Switch language" className="flex h-9 min-w-9 items-center justify-center rounded-[12px] bg-black/[.025] px-2 text-[9px] font-semibold text-black/45 hover:bg-white hover:text-black">{language==="en"?"AR":"EN"}</button>
 </div>;
}
