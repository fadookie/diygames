import type { ExecutableSystem, Context, ComponentTypeString } from './types';
import type Entity from './Entity';

export default class RenderSystem implements ExecutableSystem {
  tag = 'RenderSystem';
  targetGroup : ComponentTypeString[] = ['Renderer', 'Transform'];
  entities = [];

  execute(e : Entity, { p5 } : Context) {
    const renderComp = e.componentByType('Renderer');
    const transform = e.componentByType('Transform');
    // console.log(`@@@ render e:${e.id} at:`, transform);
    p5.push();
    if (renderComp.strokeColor) {
      p5.stroke(...renderComp.strokeColor);
    } else {
      p5.noStroke();
    }
    if(e.switch) { 
      p5.fill(255, 0, 0);
    } else if (renderComp.fillColor) {
      p5.fill(...renderComp.fillColor);
    } else {
      p5.noFill();
    }
    p5.translate(transform.pos.x, transform.pos.y);
    p5.rect(0, 0, transform.size.w, transform.size.h);
    p5.pop();
  }
}
