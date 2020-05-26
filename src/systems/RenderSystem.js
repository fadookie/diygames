export default class RenderSystem {
  targetGroup = ['Renderer', 'Transform'];
  entities = [];

  execute(e, { p5 }) {
    const renderComp = e.components.Renderer;
    const transform = e.components.Transform;
    // console.log(`@@@ render e:${e.id} at:`, transform);
    p5.push();
    if (renderComp.strokeColor) {
      p5.stroke(...renderComp.strokeColor);
    } else {
      p5.noStroke();
    }
    if (renderComp.fillColor) {
      p5.fill(...renderComp.fillColor);
    } else {
      p5.noFill();
    }
    p5.translate(transform.pos.x, transform.pos.y);
    p5.rect(0, 0, transform.size.w, transform.size.h);
    p5.pop();
  }
}
