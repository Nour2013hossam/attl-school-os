"use client";
import{ReactNode}from"react";
import{usePreferences}from"@/components/providers/preferences-provider";

export function PermissionGate({permission,children,hideWhileLoading=true}:{permission:string;children:ReactNode;hideWhileLoading?:boolean}){
 const{permissions,permissionsReady}=usePreferences();
 if(!permissionsReady&&hideWhileLoading)return null;
 if(!permissions[permission])return null;
 return <>{children}</>;
}
