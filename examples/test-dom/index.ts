import { enableDebug, World, DomContainerObject } from '../../src';

enableDebug();

const world = new World({ width: 800, height: 600 });
document.body.appendChild(world.container);

const testEl = document.createElement('div');
testEl.textContent = 'Hello World';
testEl.style.color = 'red';
testEl.onclick = () => alert('click');

const go = new DomContainerObject({ el: testEl });
go.alpha = 0.5;
world.add(go);

world.on('update', (dt) => {
  go.rotation += dt;
});
