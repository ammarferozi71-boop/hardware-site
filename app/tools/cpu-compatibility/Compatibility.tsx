'use client';
import {useEffect,useState} from 'react';
import {compatibility,validRecord,type ToolRecord} from '@/lib/decision-tools.mjs';
export default function Compatibility({records}:{records:ToolRecord[]}){
  const [clock,setClock]=useState<Date|undefined>();
  useEffect(()=>{const timer=setInterval(()=>setClock(new Date()),60000);return()=>clearInterval(timer);},[]);
  const available=records.filter(r=>validRecord(r,clock));const cpus=available.filter(r=>r.kind==='cpu');const boards=available.filter(r=>r.kind==='motherboard');
  const [cpu,setCpu]=useState('');const [board,setBoard]=useState('');
  const result=compatibility(cpus.find(c=>c.id===cpu),boards.find(b=>b.id===board));
  return <div className="space-y-6 rounded-xl border bg-card p-6"><p className="text-muted-foreground">Socket matching alone does not establish compatibility. This checker requires a manufacturer CPU support listing and minimum BIOS version.</p>
    {(!cpus.length||!boards.length)&&<p role="status">Current manufacturer records are not available yet. Compatibility remains unknown.</p>}
    <div className="grid gap-4 sm:grid-cols-2"><label>Processor<select aria-label="Processor" className="mt-2 block w-full rounded border bg-background p-3" value={cpu} onChange={e=>setCpu(e.target.value)} disabled={!cpus.length}><option value="">Select a processor</option>{cpus.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Motherboard<select aria-label="Motherboard" className="mt-2 block w-full rounded border bg-background p-3" value={board} onChange={e=>setBoard(e.target.value)} disabled={!boards.length}><option value="">Select a motherboard</option>{boards.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label></div>
    <div aria-live="polite"><h2 className="text-xl font-semibold">{result.status.replace(/_/g,' ')}</h2><p className="mt-2">{result.reason}</p>{result.minimum_bios&&<p>Minimum listed BIOS: {result.minimum_bios}</p>}{result.source_url&&<a className="underline" href={result.source_url} target="_blank" rel="noopener noreferrer">Manufacturer support list</a>}</div>
  </div>;
}
