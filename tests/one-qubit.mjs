import assert from 'node:assert/strict';
import {states,gate,p0,amplitudes,density,sample,randomPure} from '../learn/one-qubit/quantum.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
for(const r of Object.values(states)){for(const g of ['X','H','Z'])gate(gate(r,g),g).forEach((v,i)=>near(v,r[i]));gate(gate(r,'S'),'Sd').forEach((v,i)=>near(v,r[i]));}
near(p0(gate(states['+'],'H'),'Z'),1);near(p0(gate(states['-'],'H'),'Z'),0);
near(p0(gate(gate(states['+i'],'Sd'),'H'),'Z'),1);near(p0(gate(gate(states['-i'],'Sd'),'H'),'Z'),0);
for(let i=0;i<100;i++){const r=randomPure();near(Math.hypot(...r),1);const [[a,b],[c,d]]=amplitudes(r);near(a*a+b*b+c*c+d*d,1);near(2*(a*c+b*d),r[0]);near(2*(a*d-b*c),r[1]);near(a*a+b*b-c*c-d*d,r[2]);}
assert.deepEqual(density([0,0,0]),[[.5,[0,-0]],[[0,0],.5]]);
assert.equal(sample(states['0'],'Z',100).zero,100);assert.equal(sample(states['1'],'Z',100).one,100);
for(const g of ['X','H','Z','S','Sd']){const r=gate([.2,.3,.4],g);near(Math.hypot(...r),Math.hypot(.2,.3,.4));}
console.log('One-qubit checks passed: gates, basis rotations, amplitude reconstruction, mixed states, sampling.');
