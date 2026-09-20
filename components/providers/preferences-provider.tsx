"use client";

import {createContext,useContext,useEffect,useMemo,useState} from "react";

type Language="en"|"ar";
type Theme="system"|"light"|"dark";
type Preferences={language:Language;theme:Theme;emailNotifications:boolean;pushNotifications:boolean;profileVisible:boolean};

const defaults:Preferences={language:"en",theme:"system",emailNotifications:true,pushNotifications:true,profileVisible:true};
const PreferenceContext = createContext<{
  preferences: Preferences;
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
}>({
  preferences: defaults,
  language: "en",
  theme: "system",
  setLanguage: () => {},
  setTheme: () => {},
});

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

export const AR_LABELS: Record<string,string> = {
  Workspace:"مساحة العمل",Overview:"نظرة عامة","My Profile":"ملفي الشخصي",Identity:"الهوية",Timeline:"الخط الزمني",Activity:"النشاط",Achievements:"الإنجازات",XP:"الخبرة",Level:"المستوى",Goals:"الأهداف",Interests:"الاهتمامات",Portfolio:"معرض الأعمال",Notifications:"الإشعارات",Messages:"الرسائل",Search:"البحث",Calendar:"التقويم",
  Academic:"الأكاديميات","Academic Overview":"نظرة عامة أكاديمية",Grades:"الدرجات",Subjects:"المواد",Schedule:"الجدول",Exams:"الاختبارات",Attendance:"الحضور",Results:"النتائج",Transcript:"السجل الأكاديمي",GPA:"المعدل",Assignments:"الواجبات",Deadlines:"المواعيد النهائية",Teachers:"المعلمون","Academic Calendar":"التقويم الأكاديمي",Reports:"التقارير",
  Learning:"التعلم",Courses:"الدورات","My Courses":"دوراتي",Explore:"استكشاف",Lessons:"الدروس",Resources:"المصادر",Roadmaps:"المسارات",Progress:"التقدم",Bookmarks:"المفضلة",Certificates:"الشهادات",Library:"المكتبة",
  Development:"التطوير","Skill Map":"خريطة المهارات","My Skills":"مهاراتي",Assessments:"التقييمات",Growth:"النمو",Recommendations:"التوصيات","Technical Skills":"المهارات التقنية","Soft Skills":"المهارات الشخصية","Skill History":"سجل المهارات",
  Projects:"المشاريع","All Projects":"كل المشاريع","Create Project":"إنشاء مشروع",Discover:"اكتشاف",Templates:"القوالب",Teams:"الفرق",Tasks:"المهام",Milestones:"المراحل",Showcase:"المعرض",Analytics:"التحليلات","My Projects":"مشاريعي",
  Competitions:"المسابقات",Applications:"الطلبات",Upcoming:"القادمة","My Competitions":"مسابقاتي",Archives:"الأرشيف",Challenges:"التحديات",
  ATTL:"ATTL","ATTL Overview":"نظرة عامة على ATTL","Command Center":"مركز القيادة",Team:"الفريق",Members:"الأعضاء",Tracks:"المسارات",Recruitment:"التوظيف",Events:"الفعاليات",Workshops:"ورش العمل",
  Innovation:"الابتكار","Ideas":"الأفكار","Submit Idea":"إرسال فكرة",Experiments:"التجارب",Research:"البحث","Innovation Lab":"مختبر الابتكار",
  Community:"المجتمع",Feed:"الخلاصة",Discussions:"النقاشات",Groups:"المجموعات",People:"الأشخاص",Announcements:"الإعلانات",Polls:"الاستطلاعات",
  Mentorship:"الإرشاد",Mentors:"المرشدون",Requests:"الطلبات",Sessions:"الجلسات",
  Events:"الفعاليات",History:"السجل",Discover:"استكشاف",
  Challenges:"التحديات",Active:"النشطة","My Challenges":"تحدياتي",Completed:"المكتملة",Leaderboard:"المتصدرون","Create Challenge":"إنشاء تحدي",
  Teacher:"المعلم",Classes:"الفصول",Gradebook:"دفتر الدرجات",
  Admin:"الإدارة",Users:"المستخدمون",Students:"الطلاب",Roles:"الأدوار",Permissions:"الصلاحيات","Result Release":"نشر النتائج","Audit Logs":"سجلات التدقيق",Security:"الأمان",System:"النظام",
  Settings:"الإعدادات",Account:"الحساب",Appearance:"المظهر",Language:"اللغة",Privacy:"الخصوصية",Academic:"الأكاديمي",Gamification:"التلعيب",AI:"الذكاء الاصطناعي",Files:"الملفات",Integrations:"التكاملات"
};

export function usePreferences(){return useContext(PreferenceContext);} 
export function translateLabel(label:string,language:Language){return language==="ar"?AR_LABELS[label]??label:label;}
