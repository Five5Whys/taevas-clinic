import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem,
  InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Table, TableHead, TableBody,
  TableRow, TableCell, IconButton, Tooltip, Divider,
} from '@mui/material';
import {
  Search, ExpandMore, ChevronRight,
  Close, Download, NavigateBefore, NavigateNext, Delete,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

// ─── Types ─────────────────────────────────────────────────────────────────
type FileRec  = { id:string; name:string; type:string; icon:string; size:string; received:string };
type DataSlot = { type:string; received:string; status:string; failReason?:string; files:FileRec[] };
type Patient  = { id:string; name:string; data:DataSlot[] };
type Clinic   = { did:string; name:string; patients:Patient[] };
type Device   = { dd:string; name:string; clinics:Clinic[] };
type CIDEntry = { cid:string; date:string; devices:Device[] };

// ─── Seed data ─────────────────────────────────────────────────────────────
function mkFiles(type:string, n:number, received:string, pid:string): FileRec[] {
  const ext:Record<string,string>  = { pdf:'pdf', video:'mp4', image:'jpg' };
  const icon:Record<string,string> = { pdf:'📋', video:'🎞', image:'🖼' };
  const sz:Record<string,(i:number)=>string> = {
    pdf:   i=>`${(0.4+i*0.3).toFixed(1)} MB`,
    video: i=>`${(18+i*7).toFixed(1)} MB`,
    image: i=>`${(2.1+i*1.4).toFixed(1)} MB`,
  };
  return Array.from({length:n},(_,i)=>({
    id:`${pid}-${type}-${String(i+1).padStart(2,'0')}`,
    name:`${pid}_${type}_${String(i+1).padStart(2,'0')}.${ext[type]}`,
    type, icon:icon[type], size:sz[type](i), received,
  }));
}

const DATA: CIDEntry[] = [
  { cid:'CID-EQ-00412', date:'2026-03-02', devices:[
    { dd:'DD-NODE-01', name:'Equidor Node Alpha', clinics:[
      { did:'DID-A1', name:'Dr. Priya Menon · Nexus Clinic, Banjara Hills', patients:[
        { id:'PAT-1841', name:'Ravi K.',   data:[
          { type:'pdf',   received:'2026-03-02', status:'complete',    files:mkFiles('pdf',  3,'2026-03-02','PAT-1841') },
          { type:'video', received:'2026-03-02', status:'complete',    files:mkFiles('video',1,'2026-03-02','PAT-1841') },
        ]},
        { id:'PAT-2203', name:'Sunita P.', data:[{ type:'pdf', received:'2026-03-02', status:'complete',    files:mkFiles('pdf',2,'2026-03-02','PAT-2203') }] },
        { id:'PAT-3094', name:'Mohan L.',  data:[{ type:'pdf', received:'2026-03-02', status:'processing',  files:mkFiles('pdf',4,'2026-03-02','PAT-3094') }] },
      ]},
      { did:'DID-A2', name:'Dr. Arjun Rao · MedPoint, Jubilee Hills', patients:[
        { id:'PAT-4481', name:'Kavitha R.', data:[{ type:'pdf', received:'2026-03-02', status:'complete', files:mkFiles('pdf',2,'2026-03-02','PAT-4481') }] },
        { id:'PAT-5512', name:'Deepak M.',  data:[
          { type:'video', received:'2026-03-02', status:'failed', failReason:'Checksum mismatch: payload corrupted in transit. Retry or re-send from Equidor node.', files:mkFiles('video',1,'2026-03-02','PAT-5512') },
          { type:'pdf',   received:'2026-03-01', status:'complete', files:mkFiles('pdf',1,'2026-03-01','PAT-5512') },
        ]},
      ]},
    ]},
    { dd:'DD-NODE-02', name:'Equidor Node Beta', clinics:[
      { did:'DID-A3', name:'Sree Diagnostics · Madhapur', patients:[
        { id:'PAT-6101', name:'Ananya S.', data:[
          { type:'pdf',   received:'2026-03-01', status:'complete',   files:mkFiles('pdf',  1,'2026-03-01','PAT-6101') },
          { type:'video', received:'2026-03-01', status:'queued',     files:mkFiles('video',2,'2026-03-01','PAT-6101') },
        ]},
        { id:'PAT-6102', name:'Rajesh T.', data:[{ type:'pdf', received:'2026-03-02', status:'complete', files:mkFiles('pdf',3,'2026-03-02','PAT-6102') }] },
      ]},
    ]},
  ]},
  { cid:'CID-EQ-00387', date:'2026-03-01', devices:[
    { dd:'DD-NODE-03', name:'Equidor Node Gamma', clinics:[
      { did:'DID-B1', name:'Apollo Clinic · Gachibowli', patients:[
        { id:'PAT-7743', name:'Usha N.',   data:[{ type:'pdf',   received:'2026-03-01', status:'complete',   files:mkFiles('pdf',  4,'2026-03-01','PAT-7743') }] },
        { id:'PAT-7801', name:'Vikram B.', data:[{ type:'video', received:'2026-03-01', status:'processing', files:mkFiles('video',2,'2026-03-01','PAT-7801') }] },
      ]},
      { did:'DID-B2', name:'Dr. Lakshmi Iyer · CareFirst, Kondapur', patients:[
        { id:'PAT-8800', name:'Harish G.', data:[{ type:'pdf',   received:'2026-03-01', status:'complete', files:mkFiles('pdf',  6,'2026-03-01','PAT-8800') }] },
        { id:'PAT-9010', name:'Pooja K.',  data:[{ type:'video', received:'2026-03-01', status:'complete', files:mkFiles('video',1,'2026-03-01','PAT-9010') }] },
      ]},
    ]},
  ]},
  { cid:'CID-EQ-00319', date:'2026-02-28', devices:[
    { dd:'DD-NODE-04', name:'Equidor Node Delta', clinics:[
      { did:'DID-C1', name:'MedPoint · Kukatpally', patients:[
        { id:'PAT-1020', name:'Sanjay D.',  data:[{ type:'pdf',   received:'2026-02-28', status:'complete', files:mkFiles('pdf',  2,'2026-02-28','PAT-1020') }] },
        { id:'PAT-1133', name:'Preethi M.', data:[{ type:'video', received:'2026-02-28', status:'failed', failReason:'Empty file received from node. Nexus rejected — zero-byte payload. Re-send from Equidor.', files:mkFiles('video',5,'2026-02-28','PAT-1133') }] },
      ]},
    ]},
  ]},
];

// ─── Helpers ───────────────────────────────────────────────────────────────
const SP: Record<string,number> = { failed:0, processing:1, queued:2, complete:3 };
function worst(data:DataSlot[]): string {
  return data.reduce((b,d)=> SP[d.status]<SP[b]?d.status:b, 'complete');
}
function totalF(p:Patient) { return p.data.reduce((s,d)=>s+d.files.length,0); }

const SM: Record<string,{label:string;bg:string;color:string;border:string;cls:string}> = {
  complete:   { label:'Success',    bg:'rgba(205,220,80,0.14)',  color:'#6B7A00', border:'rgba(205,220,80,0.35)',  cls:'complete' },
  processing: { label:'Pending',   bg:'rgba(255,130,50,0.10)',  color:'#B85600', border:'rgba(255,130,50,0.30)',  cls:'processing' },
  queued:     { label:'Queued',    bg:'#F9FAFB',                color:'#9CA3AF', border:'#E5E7EB',                cls:'processing' },
  failed:     { label:'Failed',    bg:'rgba(244,63,94,0.10)',   color:'#9F1239', border:'rgba(244,63,94,0.25)',   cls:'failed' },
};
const TM: Record<string,{icon:string;label:string;bg:string;border:string;color:string}> = {
  pdf:   { icon:'📋', label:'PDF',   bg:'rgba(255,130,50,0.10)',  border:'rgba(255,130,50,0.30)',  color:'#B85600' },
  video: { icon:'🎞', label:'Video', bg:'rgba(59,130,246,0.10)',  border:'rgba(59,130,246,0.30)',  color:'#1E40AF' },
  image: { icon:'🖼', label:'Image', bg:'rgba(160,70,240,0.10)',  border:'rgba(160,70,240,0.30)',  color:'#A046F0' },
};

// ─── StatusBadge ───────────────────────────────────────────────────────────
const StatusBadge: React.FC<{status:string;clickable?:boolean;onClick?:()=>void}> = ({status,clickable,onClick}) => {
  const m = SM[status] || SM.complete;
  return (
    <Box component="span" onClick={onClick} sx={{
      display:'inline-flex',alignItems:'center',gap:'4px',
      fontSize:'11px',fontFamily:'"Archivo",sans-serif',fontWeight:600,borderRadius:'20px',
      px:'9px',py:'2px',border:`1px solid ${m.border}`,bgcolor:m.bg,color:m.color,
      cursor:clickable?'pointer':'default',whiteSpace:'nowrap',
    }}>
      <Box component="span" sx={{width:5,height:5,borderRadius:'50%',bgcolor:'currentColor',flexShrink:0}}/>
      {m.label}{clickable&&' ⓘ'}
    </Box>
  );
};

// ─── Today's date ──────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0,10);
}

// ─── Main component ────────────────────────────────────────────────────────
const Equidor: React.FC = () => {
  const [search,    setSearch]    = useState('');
  const [typeF,     setTypeF]     = useState('all');
  const [statusF,   setStatusF]   = useState('failed');
  const [dateFrom,  setDateFrom]  = useState('');
  const [dateTo,    setDateTo]    = useState('');
  const [open,      setOpen]      = useState<Record<string,boolean>>({});
  const [patModal,  setPatModal]  = useState<{p:Patient;did:Clinic;dd:Device;cid:CIDEntry}|null>(null);
  const [preview,   setPreview]   = useState<{files:FileRec[];idx:number}|null>(null);
  const [failPopup, setFailPopup] = useState<{name:string;reason:string}|null>(null);

  const filtering = !!(search||typeF!=='all'||statusF!=='all'||dateFrom||dateTo);

  function tog(k:string){ setOpen(p=>({...p,[k]:!p[k]})); }
  function isOpen(k:string){ return filtering || !!open[k]; }

  const filtered = useMemo(()=>
    DATA.map(cid=>{
      const devs = cid.devices.map(dd=>{
        const cls = dd.clinics.map(did=>{
          const pts = did.patients.map(p=>{
            let data = p.data.slice();
            if(typeF!=='all')   data = data.filter(d=>d.type===typeF);
            if(dateFrom)        data = data.filter(d=>d.received>=dateFrom);
            if(dateTo)          data = data.filter(d=>d.received<=dateTo);
            if(!data.length) return null;
            if(statusF!=='all'){
              const w = worst(data);
              const n = (w==='queued'||w==='processing')?'processing':w;
              if(n!==statusF&&!(statusF==='processing'&&(w==='queued'||w==='processing'))) return null;
            }
            if(search){
              const hay=[p.name,p.id,did.name,did.did,dd.name,dd.dd,cid.cid].join(' ').toLowerCase();
              if(!hay.includes(search.toLowerCase())) return null;
            }
            return {...p,data};
          }).filter(Boolean) as Patient[];
          return pts.length?{...did,patients:pts}:null;
        }).filter(Boolean) as Clinic[];
        return cls.length?{...dd,clinics:cls}:null;
      }).filter(Boolean) as Device[];
      return devs.length?{...cid,devices:devs}:null;
    }).filter(Boolean) as CIDEntry[]
  ,[search,typeF,statusF,dateFrom,dateTo]);

  // Global stats (from full DATA, not filtered)
  const stats = useMemo(()=>{
    let cids=0,devices=0,clinics=0,patients=0,files=0,failed=0;
    DATA.forEach(u=>{
      cids++;
      u.devices.forEach(dd=>{
        devices++;
        dd.clinics.forEach(did=>{
          clinics++;
          did.patients.forEach(p=>{
            patients++;
            p.data.forEach(d=>{ files+=d.files.length; if(d.status==='failed') failed++; });
          });
        });
      });
    });
    return {cids,devices,clinics,patients,files,failed};
  },[]);

  return (
    <DashboardLayout pageTitle="">
      <Box sx={{display:'flex',flexDirection:'column',height:'100%',bgcolor:'#F1F3F7'}}>

        {/* ── Equidor sub-topbar (light, matching right panel) ── */}
        <Box sx={{
          bgcolor:'#E8EAF0',borderBottom:'1px solid #D1D5DB',
          px:'24px',height:'56px',
          display:'flex',alignItems:'center',justifyContent:'space-between',
          position:'sticky',top:0,zIndex:20,flexShrink:0,
        }}>
          <Box sx={{display:'flex',alignItems:'center',gap:'12px'}}>
            <Box component="img" src="/equidor-logo.png" alt="Equidor" sx={{ height:30, borderRadius:'6px', flexShrink:0 }} />
            <Box sx={{fontFamily:'"Clash Display",sans-serif',fontSize:'15px',fontWeight:600,color:'#1F2937',letterSpacing:'-0.01em'}}>
              Monitor
            </Box>
          </Box>
          <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'#6B7280',bgcolor:'#fff',border:'1px solid #D1D5DB',px:'10px',py:'4px',borderRadius:'6px'}}>{todayStr()}</Box>
        </Box>

        {/* ── Stats strip ── */}
        <Box sx={{
          display:'grid',
          gridTemplateColumns:'repeat(6,1fr)',
          gap:'12px',
          px:'24px',py:'14px',
          bgcolor:'#F1F3F7',
          borderBottom:'1px solid #E5E7EB',
          flexShrink:0,
        }}>
          {[
            { v:stats.cids,     l:'CIDs',     icon:'🔗', accent:'#5519E6', border:'rgba(85,25,230,0.18)',  bg:'rgba(85,25,230,0.06)'  },
            { v:stats.devices,  l:'Devices',  icon:'🖥',  accent:'#5519E6', border:'rgba(85,25,230,0.18)',  bg:'rgba(85,25,230,0.06)'  },
            { v:stats.clinics,  l:'Clinics',  icon:'🏥', accent:'#0891B2', border:'rgba(8,145,178,0.2)',   bg:'rgba(8,145,178,0.06)'  },
            { v:stats.patients, l:'Patients', icon:'👥', accent:'#6366F1', border:'rgba(99,102,241,0.2)',  bg:'rgba(99,102,241,0.06)' },
            { v:stats.files,    l:'Files',    icon:'📁', accent:'#B45309', border:'rgba(205,220,80,0.35)', bg:'rgba(205,220,80,0.08)' },
            { v:stats.failed,   l:'Failed',   icon:'✕',  accent:'#F43F5E', border:'rgba(244,63,94,0.25)',  bg:'rgba(244,63,94,0.07)'  },
          ].map(s=>(
            <Box key={s.l} sx={{
              display:'flex',alignItems:'center',gap:'6px',
              bgcolor:s.bg, border:`1px solid ${s.border}`,
              borderRadius:'20px', px:'10px', py:'5px',
            }}>
              <Typography sx={{fontSize:'12px',lineHeight:1}}>{s.icon}</Typography>
              <Typography sx={{fontFamily:'"Clash Display",sans-serif',fontSize:'14px',fontWeight:800,color:s.l==='Failed'?'#F43F5E':s.accent,lineHeight:1}}>{s.v}</Typography>
              <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'9px',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.08em'}}>{s.l}</Typography>
            </Box>
          ))}
        </Box>

        {/* ── Filter bar ── */}
        <Box sx={{
          px:'24px',py:'10px',bgcolor:'#fff',
          borderBottom:'1px solid #E5E7EB',
          display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap',
          boxShadow:'0 1px 0 #E5E7EB',
          position:'sticky',top:'56px',zIndex:10,flexShrink:0,flexWrap:'nowrap',
        }}>
          {/* Date */}
          <Box sx={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Typography sx={{fontSize:'10px',fontFamily:'"DM Mono",monospace',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em',whiteSpace:'nowrap'}}>Date</Typography>
            <Box sx={{display:'flex',alignItems:'center',gap:'6px'}}>
              <Box component="input" type="date" value={dateFrom} onChange={(e:any)=>setDateFrom(e.target.value)}
                sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'#6B7280',bgcolor:'#F8F9FC',border:'1.5px solid #E5E7EB',borderRadius:'8px',px:'9px',py:'5px',outline:'none','&:focus':{borderColor:'#5519E6'},cursor:'pointer'}}
              />
              <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF'}}>→</Typography>
              <Box component="input" type="date" value={dateTo} onChange={(e:any)=>setDateTo(e.target.value)}
                sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'#6B7280',bgcolor:'#F8F9FC',border:'1.5px solid #E5E7EB',borderRadius:'8px',px:'9px',py:'5px',outline:'none','&:focus':{borderColor:'#5519E6'},cursor:'pointer'}}
              />
              {(dateFrom||dateTo)&&(
                <Box component="button" onClick={()=>{setDateFrom('');setDateTo('');}}
                  sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'#9CA3AF',bgcolor:'none',border:'none',cursor:'pointer',px:'5px',py:'2px',borderRadius:'5px','&:hover':{color:'#F43F5E'}}}>✕</Box>
              )}
            </Box>
          </Box>

          <Box sx={{width:'1px',height:22,bgcolor:'#D1D5DB',mx:'4px',flexShrink:0}}/>

          {/* Type */}
          <Box sx={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Typography sx={{fontSize:'10px',fontFamily:'"DM Mono",monospace',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em'}}>Type</Typography>
            <Select size="small" value={typeF} onChange={e=>setTypeF(e.target.value)}
              sx={{fontSize:'12px',fontFamily:'"Archivo",sans-serif',minWidth:120,bgcolor:'#F8F9FC',
                '& .MuiOutlinedInput-notchedOutline':{borderColor:'#E5E7EB',borderWidth:'1.5px'},
                '&:hover .MuiOutlinedInput-notchedOutline':{borderColor:'#5519E6'},
                '&.Mui-focused .MuiOutlinedInput-notchedOutline':{borderColor:'#5519E6'},
                '& .MuiSelect-select':{py:'5px',px:'10px'},
              }}>
              <MenuItem value="all"   sx={{fontSize:'12px'}}>All Types</MenuItem>
              <MenuItem value="pdf"   sx={{fontSize:'12px'}}>📋 PDF</MenuItem>
              <MenuItem value="video" sx={{fontSize:'12px'}}>🎞 Video</MenuItem>
            </Select>
          </Box>

          <Box sx={{width:'1px',height:22,bgcolor:'#D1D5DB',mx:'4px',flexShrink:0}}/>

          {/* Status */}
          <Box sx={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Typography sx={{fontSize:'10px',fontFamily:'"DM Mono",monospace',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em'}}>Status</Typography>
            <Select size="small" value={statusF} onChange={e=>setStatusF(e.target.value)}
              sx={{fontSize:'12px',fontFamily:'"Archivo",sans-serif',minWidth:130,bgcolor:'#F8F9FC',
                '& .MuiOutlinedInput-notchedOutline':{borderColor:'#E5E7EB',borderWidth:'1.5px'},
                '&:hover .MuiOutlinedInput-notchedOutline':{borderColor:'#5519E6'},
                '&.Mui-focused .MuiOutlinedInput-notchedOutline':{borderColor:'#5519E6'},
                '& .MuiSelect-select':{py:'5px',px:'10px'},
              }}>
              <MenuItem value="all"        sx={{fontSize:'12px'}}>All Status</MenuItem>
              <MenuItem value="complete"   sx={{fontSize:'12px'}}>✅ Success</MenuItem>
              <MenuItem value="processing" sx={{fontSize:'12px'}}>🕐 Pending</MenuItem>
              <MenuItem value="failed"     sx={{fontSize:'12px'}}>❌ Failed</MenuItem>
            </Select>
          </Box>

          {/* Search — pushed to right */}
          <Box sx={{ml:'auto',position:'relative'}}>
            <Search sx={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',fontSize:'13px',color:'#9CA3AF',pointerEvents:'none'}}/>
            <Box component="input"
              placeholder="Search patient, CID, device, clinic…"
              value={search} onChange={(e:any)=>setSearch(e.target.value)}
              sx={{fontFamily:'"Archivo",sans-serif',fontSize:'12px',pl:'30px',pr:'12px',py:'6px',
                border:'1.5px solid #E5E7EB',borderRadius:'9px',bgcolor:'#F8F9FC',color:'#0A0A0F',
                outline:'none',width:'210px',transition:'border-color .15s',
                '&:focus':{borderColor:'#5519E6'},
                '&::placeholder':{color:'#9CA3AF'},
              }}
            />
          </Box>
        </Box>

        {/* ── Tree content ── */}
        <Box sx={{flex:1,overflowY:'auto',p:'18px 24px 56px'}}>
          {filtered.length===0 ? (
            <Box sx={{textAlign:'center',py:8,fontFamily:'"DM Mono",monospace',color:'#9CA3AF',fontSize:'12px'}}>
              no results · adjust filters or date range
            </Box>
          ) : filtered.map((cid,ci)=>{
            const cidKey = cid.cid;
            const cidOpen = isOpen(cidKey);
            const tPts  = cid.devices.reduce((a,dd)=>a+dd.clinics.reduce((b,d)=>b+d.patients.length,0),0);
            const tFiles= cid.devices.reduce((a,dd)=>a+dd.clinics.reduce((b,d)=>b+d.patients.reduce((c,p)=>c+totalF(p),0),0),0);

            return (
              <Box key={cid.cid} sx={{
                bgcolor:'#fff',border:'1px solid #E5E7EB',borderRadius:'13px',mb:'12px',
                overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
                animation:'fadeUp .3s ease both',animationDelay:`${ci*0.06}s`,
                '@keyframes fadeUp':{from:{opacity:0,transform:'translateY(8px)'},to:{opacity:1,transform:'translateY(0)'}},
              }}>
                {/* CID header */}
                <Box onClick={()=>tog(cidKey)} sx={{
                  display:'flex',alignItems:'center',gap:'12px',px:'18px',py:'13px',
                  cursor:'pointer',userSelect:'none',transition:'background .15s',
                  borderBottom:cidOpen?'1px solid #E5E7EB':'1px solid transparent',
                  bgcolor:cidOpen?'#F8F9FC':'#fff',
                  '&:hover':{bgcolor:'#F8F9FC'},
                }}>
                  {cidOpen
                    ? <ExpandMore sx={{fontSize:11,color:'#9CA3AF',flexShrink:0,transition:'transform .2s'}}/>
                    : <ChevronRight sx={{fontSize:11,color:'#9CA3AF',flexShrink:0}}/>}
                  {/* CID pill */}
                  <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',fontWeight:500,
                    bgcolor:'rgba(85,25,230,0.10)',border:'1px solid rgba(85,25,230,0.25)',
                    color:'#5519E6',px:'8px',py:'2px',borderRadius:'6px',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>
                    CID · {cid.cid}
                  </Box>
                  {/* CID label */}
                  <Typography sx={{flex:1,fontFamily:'"Clash Display",sans-serif',fontSize:'13px',fontWeight:600,color:'#0A0A0F'}}>{cid.cid}</Typography>
                  {/* Meta chips */}
                  <Box sx={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                    {[`${cid.devices.length} device${cid.devices.length!==1?'s':''}`,`${tPts} patient${tPts!==1?'s':''}`,`${tFiles} files`].map(l=>(
                      <Box key={l} sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF',bgcolor:'#F8F9FC',border:'1px solid #E5E7EB',borderRadius:'6px',px:'9px',py:'2px',whiteSpace:'nowrap'}}>{l}</Box>
                    ))}
                    <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#6B7280',whiteSpace:'nowrap'}}>📅 {cid.date}</Typography>
                  </Box>
                </Box>

                {/* CID body */}
                {cidOpen && cid.devices.map(dd=>{
                  const ddKey=`${cidKey}/${dd.dd}`;
                  const ddOpen=isOpen(ddKey);
                  const ddPts =dd.clinics.reduce((a,d)=>a+d.patients.length,0);
                  const ddF   =dd.clinics.reduce((a,d)=>a+d.patients.reduce((b,p)=>b+totalF(p),0),0);
                  return (
                    <Box key={dd.dd} sx={{borderBottom:'1px solid #E5E7EB','&:last-child':{borderBottom:'none'},bgcolor:'#fff'}}>
                      {/* DD header */}
                      <Box onClick={()=>tog(ddKey)} sx={{
                        display:'flex',alignItems:'center',gap:'10px',
                        px:'18px',py:'10px',pl:'36px',
                        cursor:'pointer',transition:'background .12s',
                        bgcolor:ddOpen?'rgba(85,25,230,0.03)':'#fff',
                        '&:hover':{bgcolor:'rgba(85,25,230,0.03)'},
                      }}>
                        {ddOpen
                          ? <ExpandMore sx={{fontSize:11,color:'#9CA3AF',flexShrink:0}}/>
                          : <ChevronRight sx={{fontSize:11,color:'#9CA3AF',flexShrink:0}}/>}
                        <Box sx={{width:26,height:26,borderRadius:'7px',bgcolor:'rgba(85,25,230,0.10)',border:'1px solid rgba(85,25,230,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',flexShrink:0}}>🖥</Box>
                        <Typography sx={{flex:1,fontSize:'13px',fontWeight:600,color:'#0A0A0F'}}>{dd.name}</Typography>
                        <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#6B7280',bgcolor:'#F8F9FC',border:'1px solid #E5E7EB',px:'8px',py:'2px',borderRadius:'6px',whiteSpace:'nowrap'}}>{dd.dd}</Box>
                        <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF',bgcolor:'#F8F9FC',border:'1px solid #E5E7EB',px:'8px',py:'2px',borderRadius:'6px',whiteSpace:'nowrap'}}>{dd.clinics.length} clinic{dd.clinics.length!==1?'s':''}</Box>
                        <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',fontWeight:600,bgcolor:'rgba(85,25,230,0.08)',border:'1px solid rgba(85,25,230,0.18)',color:'#5519E6',borderRadius:'20px',px:'10px',py:'2px',whiteSpace:'nowrap'}}>{ddF} files · {ddPts} pts</Box>
                      </Box>

                      {/* DID rows */}
                      {ddOpen && dd.clinics.map(did=>{
                        const didKey=`${ddKey}/${did.did}`;
                        const didOpen=isOpen(didKey);
                        const didF=did.patients.reduce((a,p)=>a+totalF(p),0);
                        return (
                          <Box key={did.did} sx={{borderBottom:'1px solid #E5E7EB','&:last-child':{borderBottom:'none'}}}>
                            {/* DID header */}
                            <Box onClick={()=>tog(didKey)} sx={{
                              display:'flex',alignItems:'center',gap:'10px',
                              px:'18px',py:'9px',pl:'58px',
                              cursor:'pointer',transition:'background .12s',
                              bgcolor:didOpen?'#F8F9FC':'#fff',
                              '&:hover':{bgcolor:'#F8F9FC'},
                            }}>
                              {didOpen
                                ? <ExpandMore sx={{fontSize:11,color:'#9CA3AF',flexShrink:0}}/>
                                : <ChevronRight sx={{fontSize:11,color:'#9CA3AF',flexShrink:0}}/>}
                              <Box sx={{width:7,height:7,borderRadius:'50%',bgcolor:'#6B7A00',flexShrink:0}}/>
                              <Typography sx={{flex:1,fontSize:'13px',fontWeight:600,color:'#0A0A0F'}}>{did.name}</Typography>
                              <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF'}}>{did.did}</Typography>
                              <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',fontWeight:600,bgcolor:'rgba(205,220,80,0.14)',border:'1px solid rgba(205,220,80,0.35)',color:'#6B7A00',borderRadius:'20px',px:'10px',py:'2px',whiteSpace:'nowrap'}}>{didF} files</Box>
                            </Box>

                            {/* Patient table */}
                            {didOpen && (
                              <Box sx={{bgcolor:'#F4F5F9',borderTop:'1px solid #E5E7EB',pl:'78px',pr:'18px',pb:'2px',overflowX:'auto'}}>
                                <Table size="small" sx={{minWidth:580,'& *':{boxSizing:'border-box'}}}>
                                  <TableHead>
                                    <TableRow sx={{'& th':{bgcolor:'#F4F5F9',borderBottom:'1.5px solid #D1D5DB'}}}>
                                      {['Patient','Patient ID','Data Types','File Received','Status','Actions'].map(h=>(
                                        <TableCell key={h} sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF',fontWeight:500,py:'9px',px:'10px',textTransform:'uppercase',letterSpacing:'0.08em',whiteSpace:'nowrap'}}>{h}</TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {did.patients.map(p=>{
                                      const w=worst(p.data);
                                      const dates=[...new Set(p.data.map(d=>d.received))].sort();
                                      const dateStr=dates.length===1?dates[0]:`${dates[0]} → ${dates[dates.length-1]}`;
                                      const failReasons=p.data.filter(d=>d.status==='failed'&&d.failReason).map(d=>d.failReason!);
                                      const allFiles=p.data.flatMap(d=>d.files);
                                      return (
                                        <TableRow key={p.id} sx={{'&:hover':{bgcolor:'rgba(85,25,230,0.025)'},'&:last-child td':{borderBottom:'none'},'& td':{borderBottom:'1px solid #E5E7EB',py:'9px',px:'10px',verticalAlign:'middle'}}}>
                                          <TableCell sx={{fontWeight:600,color:'#0A0A0F',fontSize:'13px',whiteSpace:'nowrap'}}>{p.name}</TableCell>
                                          <TableCell sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF'}}>{p.id}</TableCell>
                                          <TableCell>
                                            <Box sx={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                                              {p.data.map((d,i)=>{
                                                const tm=TM[d.type]||TM.pdf;
                                                return (
                                                  <Box key={i} component="span" sx={{display:'inline-flex',alignItems:'center',gap:'4px',borderRadius:'6px',px:'8px',py:'2px',fontFamily:'"DM Mono",monospace',fontSize:'10px',fontWeight:600,border:`1px solid ${tm.border}`,bgcolor:tm.bg,color:tm.color,whiteSpace:'nowrap'}}>
                                                    {tm.icon === '📋' ? 'P' : tm.icon === '🎞' ? 'V' : 'I'} ×{d.files.length}
                                                  </Box>
                                                );
                                              })}
                                            </Box>
                                          </TableCell>
                                          <TableCell sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'#6B7280',whiteSpace:'nowrap'}}>{dateStr}</TableCell>
                                          <TableCell>
                                            <StatusBadge status={w} clickable={w==='failed'} onClick={w==='failed'?()=>setFailPopup({name:p.name,reason:failReasons.join(' | ')}):undefined}/>
                                          </TableCell>
                                          <TableCell>
                                            <Box sx={{display:'flex',alignItems:'center',gap:'6px'}}>
                                              <Box component="button"
                                                onClick={()=>setPatModal({p,did,dd,cid})}
                                                sx={{
                                                  fontSize:'12px',fontFamily:'"Archivo",sans-serif',fontWeight:500,
                                                  color:'#5519E6',bgcolor:'rgba(85,25,230,0.08)',
                                                  border:'1px solid rgba(85,25,230,0.22)',borderRadius:'8px',
                                                  px:'13px',py:'5px',cursor:'pointer',transition:'all .15s',whiteSpace:'nowrap',
                                                  '&:hover':{bgcolor:'#5519E6',color:'#fff',boxShadow:'0 2px 8px rgba(85,25,230,0.28)',transform:'translateY(-1px)'},
                                                }}>
                                                View <Box component="span" sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',ml:'3px',opacity:0.7}}>{allFiles.length}</Box>
                                              </Box>
                                              <Tooltip title="Delete record">
                                                <Box component="button" sx={{
                                                  display:'inline-flex',alignItems:'center',justifyContent:'center',
                                                  color:'#9CA3AF',bgcolor:'transparent',border:'1.5px solid transparent',
                                                  borderRadius:'7px',p:'5px 7px',cursor:'pointer',transition:'all .15s',
                                                  '&:hover':{color:'#F43F5E',bgcolor:'rgba(244,63,94,0.10)',borderColor:'rgba(244,63,94,0.25)'},
                                                }}>
                                                  <Delete sx={{fontSize:14}}/>
                                                </Box>
                                              </Tooltip>
                                            </Box>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ── Patient modal ── */}
      <Dialog open={!!patModal} onClose={()=>setPatModal(null)} maxWidth="sm" fullWidth
        PaperProps={{sx:{borderRadius:'14px',border:'1px solid #E5E7EB',boxShadow:'0 24px 60px rgba(0,0,0,0.18)',maxHeight:'90vh'}}}>
        {patModal&&(<>
          <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',px:'20px',py:'16px',borderBottom:'1px solid #E5E7EB',flexShrink:0}}>
            <Typography sx={{fontFamily:'"Clash Display",sans-serif',fontSize:'15px',fontWeight:600,color:'#0A0A0F'}}>
              {patModal.p.name} · {patModal.p.id}
            </Typography>
            <Box component="button" onClick={()=>setPatModal(null)} sx={{bgcolor:'none',border:'none',cursor:'pointer',color:'#9CA3AF',fontSize:'20px',lineHeight:1,'&:hover':{color:'#0A0A0F'}}}>×</Box>
          </Box>

          <Box sx={{p:'20px',display:'flex',flexDirection:'column',gap:'14px',overflowY:'auto',flex:1}}>
            {/* Identifiers section */}
            <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'9px',color:'#9CA3AF',letterSpacing:'0.14em',textTransform:'uppercase',pb:'5px',borderBottom:'1px solid #E5E7EB'}}>Identifiers</Typography>
            {[{k:'CID',v:patModal.cid.cid},{k:'Device (DD)',v:`${patModal.dd.dd} — ${patModal.dd.name}`},{k:'Clinic (DID)',v:`${patModal.did.did} — ${patModal.did.name}`}].map(r=>(
              <Box key={r.k} sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.08em',flexShrink:0,pt:'1px'}}>{r.k}</Typography>
                <Typography sx={{fontSize:'12.5px',fontWeight:500,color:'#0A0A0F',textAlign:'right',fontFamily:r.k==='CID'?'"DM Mono",monospace':'inherit'}}>{r.v}</Typography>
              </Box>
            ))}

            <Box sx={{height:1,bgcolor:'#E5E7EB'}}/>

            {/* Patient section */}
            <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'9px',color:'#9CA3AF',letterSpacing:'0.14em',textTransform:'uppercase',pb:'5px',borderBottom:'1px solid #E5E7EB'}}>Patient</Typography>
            {[{k:'Name',v:patModal.p.name},{k:'Patient ID',v:patModal.p.id},{k:'Ingest Date',v:patModal.cid.date}].map(r=>(
              <Box key={r.k} sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.08em',flexShrink:0,pt:'1px'}}>{r.k}</Typography>
                <Typography sx={{fontSize:'12.5px',fontWeight:500,color:'#0A0A0F',textAlign:'right',fontFamily:(r.k==='Patient ID'||r.k==='Ingest Date')?'"DM Mono",monospace':'inherit'}}>{r.v}</Typography>
              </Box>
            ))}

            <Box sx={{height:1,bgcolor:'#E5E7EB'}}/>

            {/* Data breakdown */}
            <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'9px',color:'#9CA3AF',letterSpacing:'0.14em',textTransform:'uppercase',pb:'5px',borderBottom:'1px solid #E5E7EB'}}>Data Breakdown · click any file to view</Typography>
            {patModal.p.data.map((d,gi)=>{
              const tm=TM[d.type]||TM.pdf;
              const sm=SM[d.status||'complete'];
              const allFiles=patModal.p.data.flatMap(x=>x.files);
              return (
                <Box key={gi} sx={{mb:'10px'}}>
                  <Box sx={{display:'flex',alignItems:'center',gap:'7px',pb:'7px',mb:'8px',borderBottom:'1px dashed #D1D5DB'}}>
                    <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',fontWeight:600,color:tm.color,textTransform:'uppercase',letterSpacing:'0.06em'}}>{tm.icon} {d.type.toUpperCase()} · {d.files.length} file{d.files.length!==1?'s':''}</Typography>
                    <Box component="span" sx={{ml:'auto',display:'inline-flex',alignItems:'center',gap:'4px',fontSize:'11px',fontWeight:600,fontFamily:'"Archivo",sans-serif',borderRadius:'20px',px:'9px',py:'2px',border:`1px solid ${sm.border}`,bgcolor:sm.bg,color:sm.color}}>
                      <Box component="span" sx={{width:5,height:5,borderRadius:'50%',bgcolor:'currentColor'}}/>{sm.label}
                    </Box>
                  </Box>
                  {d.status==='failed'&&d.failReason&&(
                    <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9F1239',bgcolor:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',borderRadius:'6px',p:'6px 10px',mb:'6px',lineHeight:1.6}}>
                      ⚠ {d.failReason}
                    </Box>
                  )}
                  {d.files.map((f,fi)=>{
                    const si=allFiles.findIndex(af=>af.id===f.id);
                    return (
                      <Box key={fi} onClick={()=>setPreview({files:allFiles,idx:si})} sx={{
                        display:'flex',alignItems:'center',gap:'10px',p:'8px 11px',mb:'5px',
                        border:'1.5px solid #E5E7EB',borderRadius:'9px',cursor:'pointer',
                        bgcolor:'#F8F9FC',transition:'all .15s',userSelect:'none',
                        '&:hover':{borderColor:'rgba(85,25,230,0.3)',bgcolor:'rgba(85,25,230,0.04)',boxShadow:'0 2px 8px rgba(85,25,230,0.08)'},
                      }}>
                        <Typography sx={{fontSize:'16px',flexShrink:0}}>{f.icon}</Typography>
                        <Box sx={{flex:1,minWidth:0}}>
                          <Typography sx={{fontSize:'12px',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:'#0A0A0F'}}>{f.name}</Typography>
                          <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF',mt:'1px'}}>{f.size} · {f.id}</Typography>
                        </Box>
                        <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#6B7280',whiteSpace:'nowrap'}}>📅 {f.received}</Typography>
                        <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#5519E6',opacity:0.7,whiteSpace:'nowrap'}}>View →</Typography>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}

            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',pt:'4px',borderTop:'1px solid #E5E7EB'}}>
              <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.08em'}}>Total Files</Typography>
              <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'12px',fontWeight:600,color:'#0A0A0F'}}>{totalF(patModal.p)}</Typography>
            </Box>
          </Box>

          <Box sx={{px:'20px',py:'14px',display:'flex',gap:'8px',justifyContent:'flex-end',borderTop:'1px solid #E5E7EB',bgcolor:'#F8F9FC',flexShrink:0}}>
            <Button size="small" onClick={()=>setPatModal(null)}
              sx={{fontSize:'12px',color:'#6B7280',border:'1px solid #E5E7EB',borderRadius:'8px',px:'16px','&:hover':{bgcolor:'#F3F4F6'}}}>Close</Button>
          </Box>
        </>)}
      </Dialog>

      {/* ── File preview overlay ── */}
      <Dialog open={!!preview} onClose={()=>setPreview(null)} maxWidth="md" fullWidth
        PaperProps={{sx:{bgcolor:'#0A0E1A',borderRadius:'14px',border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden',display:'flex',flexDirection:'column',maxHeight:'90vh'}}}>
        {preview&&(()=>{
          const f=preview.files[preview.idx];
          const tm=TM[f.type]||TM.pdf;
          return (<>
            {/* Preview topbar */}
            <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',px:'16px',py:'12px',flexShrink:0}}>
              <Box sx={{display:'flex',alignItems:'center',gap:'10px'}}>
                <Box component="span" sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',fontWeight:600,px:'9px',py:'2px',borderRadius:'6px',border:`1px solid ${tm.border}`,bgcolor:tm.bg,color:tm.color}}>{f.type.toUpperCase()}</Box>
                <Box>
                  <Typography sx={{fontFamily:'"Clash Display",sans-serif',fontSize:'14px',fontWeight:600,color:'#fff'}}>{f.name}</Typography>
                  <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'rgba(255,255,255,0.4)'}}>{f.size} · received {f.received} · {f.id}</Typography>
                </Box>
              </Box>
              <Box component="button" onClick={()=>setPreview(null)} sx={{
                bgcolor:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.14)',
                color:'rgba(255,255,255,0.65)',borderRadius:'8px',px:'14px',py:'6px',
                cursor:'pointer',fontFamily:'"Archivo",sans-serif',fontSize:'12px',
                display:'flex',alignItems:'center',gap:'6px',transition:'background .15s',
                '&:hover':{bgcolor:'rgba(255,255,255,0.16)',color:'#fff'},
              }}>
                <Close sx={{fontSize:12}}/> Close Preview
              </Box>
            </Box>

            {/* Preview frame */}
            <Box sx={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',px:'16px',pb:'20px',minHeight:0}}>
              {f.type==='video' ? (
                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:'16px',color:'rgba(255,255,255,0.45)',border:'1.5px dashed rgba(255,255,255,0.12)',borderRadius:'14px',p:'60px',width:'100%',textAlign:'center'}}>
                  <Box sx={{width:240,height:150,bgcolor:'#1c1c2e',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'52px',boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>🎞</Box>
                  <Typography sx={{fontFamily:'"Clash Display",sans-serif',fontSize:'15px',fontWeight:600,color:'rgba(255,255,255,0.65)'}}>{f.name}</Typography>
                  <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'rgba(255,255,255,0.3)'}}>Video preview · {f.size}</Typography>
                </Box>
              ) : (
                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:'16px',color:'rgba(255,255,255,0.45)',border:'1.5px dashed rgba(245,215,138,0.3)',borderRadius:'14px',p:'60px',width:'100%',textAlign:'center'}}>
                  <Box sx={{width:160,height:200,bgcolor:'#fff',borderRadius:'8px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'12px',boxShadow:'0 8px 32px rgba(0,0,0,0.4)',p:'20px'}}>
                    <Typography sx={{fontSize:'44px'}}>📋</Typography>
                    {[100,80,90,70].map((w,i)=><Box key={i} sx={{width:`${w}%`,height:6,bgcolor:'#F3F4F6',borderRadius:3}}/>)}
                  </Box>
                  <Typography sx={{fontFamily:'"Clash Display",sans-serif',fontSize:'15px',fontWeight:600,color:'rgba(255,255,255,0.65)'}}>{f.name}</Typography>
                  <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'rgba(255,255,255,0.3)'}}>PDF preview · {f.size}</Typography>
                </Box>
              )}
            </Box>

            {/* Preview nav */}
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',py:'10px',pb:'16px',flexShrink:0}}>
              <Box component="button" disabled={preview.idx===0}
                onClick={()=>setPreview(p=>p?{...p,idx:p.idx-1}:null)}
                sx={{bgcolor:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.65)',borderRadius:'8px',px:'16px',py:'6px',cursor:'pointer',fontFamily:'"Archivo",sans-serif',fontSize:'12px',fontWeight:500,display:'flex',alignItems:'center',gap:'5px','&:hover':{bgcolor:'rgba(255,255,255,0.18)',color:'#fff'},'&:disabled':{opacity:0.2,cursor:'not-allowed'}}}>
                ‹ Prev
              </Box>
              <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'rgba(255,255,255,0.35)',minWidth:'70px',textAlign:'center'}}>{preview.idx+1} / {preview.files.length}</Typography>
              <Box component="button" disabled={preview.idx===preview.files.length-1}
                onClick={()=>setPreview(p=>p?{...p,idx:p.idx+1}:null)}
                sx={{bgcolor:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.65)',borderRadius:'8px',px:'16px',py:'6px',cursor:'pointer',fontFamily:'"Archivo",sans-serif',fontSize:'12px',fontWeight:500,display:'flex',alignItems:'center',gap:'5px','&:hover':{bgcolor:'rgba(255,255,255,0.18)',color:'#fff'},'&:disabled':{opacity:0.2,cursor:'not-allowed'}}}>
                Next ›
              </Box>
            </Box>
          </>);
        })()}
      </Dialog>

      {/* ── Fail reason popup ── */}
      <Dialog open={!!failPopup} onClose={()=>setFailPopup(null)} maxWidth="xs" fullWidth
        PaperProps={{sx:{borderRadius:'10px',border:'1.5px solid rgba(244,63,94,0.25)',boxShadow:'0 8px 32px rgba(244,63,94,0.14)'}}}>
        {failPopup&&(<>
          <Box sx={{display:'flex',alignItems:'center',gap:'8px',px:'20px',pt:'16px',pb:0}}>
            <Typography sx={{fontSize:'11px',fontWeight:700,color:'#9F1239',textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:'"DM Mono",monospace'}}>❌ Upload Failed</Typography>
            <Box component="button" onClick={()=>setFailPopup(null)} sx={{ml:'auto',bgcolor:'none',border:'none',cursor:'pointer',color:'#9CA3AF','&:hover':{color:'#0A0A0F'}}}><Close sx={{fontSize:14}}/></Box>
          </Box>
          <DialogContent sx={{pt:1.5}}>
            <Typography sx={{fontSize:'0.78rem',fontWeight:600,mb:1,color:'#0A0A0F'}}>{failPopup.name}</Typography>
            <Box sx={{fontFamily:'"DM Mono",monospace',fontSize:'11px',color:'#9F1239',bgcolor:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',borderRadius:'7px',p:'8px 10px',lineHeight:1.6}}>
              {failPopup.reason}
            </Box>
            <Typography sx={{fontSize:'11px',color:'#9CA3AF',mt:1,fontFamily:'"DM Mono",monospace'}}>Check DLQ for full trace → retry or dismiss.</Typography>
          </DialogContent>
          <DialogActions sx={{px:'20px',py:'14px'}}>
            <Button size="small" onClick={()=>setFailPopup(null)} sx={{fontSize:'12px',color:'#6B7280',border:'1px solid #E5E7EB',borderRadius:'8px'}}>Dismiss</Button>
            <Button size="small" variant="contained" color="error" sx={{fontSize:'12px',borderRadius:'8px'}}>🔄 Retry</Button>
          </DialogActions>
        </>)}
      </Dialog>
    </DashboardLayout>
  );
};

export default Equidor;
