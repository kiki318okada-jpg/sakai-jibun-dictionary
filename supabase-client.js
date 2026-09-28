let sb=null;
const CID_KEY="sakai_jibun_client_id_v2";
function initSupabase(){
  const c=window.JIBUN_CONFIG?.supabase;
  if(!c?.url||!c?.publishableKey)return null;
  sb=window.supabase.createClient(c.url,c.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  return sb
}
function getClientId(){
  let id=localStorage.getItem(CID_KEY);
  if(!id){
    id=crypto.randomUUID();
    localStorage.setItem(CID_KEY,id);
  }
  return id
}
async function ensureAnonymousSession(){
  if(!sb)throw new Error("Supabase is not configured");
  return {clientId:getClientId()}
}
async function saveRemote(state){
  if(!sb)throw new Error("Supabase is not configured");
  const {error}=await sb.rpc("save_jibun_response",{
    p_session_id:JIBUN_CONFIG.sessionId,
    p_client_id:getClientId(),
    p_state:state,
    p_work1_person:state.w1?.person||""
  });
  if(error)throw error
}
async function getSummary(){
  if(!sb)throw new Error("Supabase is not configured");
  const {data,error}=await sb.rpc("get_jibun_work1_summary",{p_session_id:JIBUN_CONFIG.sessionId});
  if(error)throw error;
  const choices=(data||[]).map(x=>({person:x.person,count:Number(x.response_count)}));
  return {total:choices.reduce((a,b)=>a+b.count,0),choices}
}