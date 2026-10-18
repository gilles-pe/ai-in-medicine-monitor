export function feedbackUrl(message,title,recipient){
  const text=String(message||'').trim();
  if(!text)throw new Error('Feedback is empty.');
  if(!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(recipient))throw new Error('Feedback address is invalid.');
  return 'mailto:'+recipient+'?subject='+encodeURIComponent(title+' - Feedback')+'&body='+encodeURIComponent(text);
}
