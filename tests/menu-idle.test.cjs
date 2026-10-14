const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../src/lib/menuIdle.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function setup() {
  let now = 0, id = 0, calls = 0;
  const timers = new Map();
  const target = () => {
    const listeners = new Map();
    return {
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
      emit(name) { listeners.get(name)?.forEach(fn => fn()); },
      count() { return [...listeners.values()].reduce((n, set) => n + set.size, 0); }
    };
  };
  const window = target(), document = Object.assign(target(), { visibilityState: 'visible' });
  const context = { exports: {}, window, document, Date: { now: () => now }, setTimeout: (fn, delay) => { timers.set(++id, { at: now + delay, fn }); return id; }, clearTimeout: id => timers.delete(id) };
  vm.runInNewContext(source, context);
  const stop = context.exports.startMenuIdleReset(() => calls++);
  return { window, document, stop, get calls() { return calls; }, timers,
    advance(ms, suspended = false) { const end = now + ms; if (!suspended) { while (true) { const entry = [...timers].filter(([, t]) => t.at <= end).sort((a,b) => a[1].at-b[1].at)[0]; if (!entry) break; now = entry[1].at; timers.delete(entry[0]); entry[1].fn(); } } now = end; }
  };
}
test('returns exactly at 3 minutes, once per inactive period', () => { const x=setup(); x.advance(179999); assert.equal(x.calls,0); x.advance(1); assert.equal(x.calls,1); x.advance(180000); assert.equal(x.calls,1); });
for (const event of ['pointerdown','pointermove','touchstart','touchmove','wheel','scroll','keydown','click']) {
  test(`${event} starts a fresh three-minute deadline`, () => { const x=setup(); x.advance(179000); x.window.emit(event); x.advance(179999); assert.equal(x.calls,0); x.advance(1); assert.equal(x.calls,1); });
}
test('new visitor gets another full inactivity period', () => { const x=setup(); x.advance(180000); x.window.emit('touchstart'); x.advance(180000); assert.equal(x.calls,2); });
test('resuming after suspended timers checks elapsed real time', () => { const x=setup(); x.document.visibilityState='hidden'; x.advance(240000,true); x.document.visibilityState='visible'; x.document.emit('visibilitychange'); assert.equal(x.calls,1); x.window.emit('pageshow'); assert.equal(x.calls,1); });
test('cleanup removes every listener and timer', () => { const x=setup(); x.stop(); assert.equal(x.timers.size,0); assert.equal(x.window.count()+x.document.count(),0); x.window.emit('scroll'); x.advance(360000); assert.equal(x.calls,0); });
