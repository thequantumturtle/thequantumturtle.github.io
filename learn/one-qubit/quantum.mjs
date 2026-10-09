export const states={'0':[0,0,1],'1':[0,0,-1],'+':[1,0,0],'-':[-1,0,0],'+i':[0,1,0],'-i':[0,-1,0]};
export function gate(r,g){const [x,y,z]=r;switch(g){case 'X':return[x,-y,-z];case 'H':return[z,-y,x];case 'Z':return[-x,-y,z];case 'S':return[-y,x,z];case 'Sd':return[y,-x,z];default:throw Error('Unknown gate');}}
export function p0(r,b){return (1+r[{X:0,Y:1,Z:2}[b]])/2;}
export function sample(r,b,n,rng=Math.random){let zero=0;const p=p0(r,b);for(let i=0;i<n;i++)if(rng()<p)zero++;return{zero,one:n-zero,n,mean:(2*zero-n)/n};}
export function density([x,y,z]){return[[(1+z)/2,[x/2,-y/2]],[[x/2,y/2],(1-z)/2]];}
export function randomPure(rng=Math.random){const z=2*rng()-1,phi=2*Math.PI*rng(),a=Math.sqrt(1-z*z);return[a*Math.cos(phi),a*Math.sin(phi),z];}
export function amplitudes([x,y,z]){const a=Math.sqrt(Math.max(0,(1+z)/2));return a<1e-10?[[0,0],[1,0]]:[[a,0],[x/(2*a),y/(2*a)]];}
