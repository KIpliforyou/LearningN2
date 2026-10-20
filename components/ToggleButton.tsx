"use client";
import { useState } from "react";
interface Props { label:string; checked:boolean; onClick:()=>void; }
export default function ToggleButton({label,checked,onClick}:Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onClick}
      style={{display:"flex",alignItems:"center",gap:8,width:110}}
    >
      <span style={{width:20,height:20,border:"2px solid var(--border)",background:checked?"var(--brand)":"var(--surface-2)",borderRadius:"50%",transition:"background .2s"}} />
      <span style={{font:"inherit"}}>{label}</span>
    </button>
  );
}
