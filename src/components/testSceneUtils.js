import _ from 'lodash';

export const generateBaseEntity = (id) => ({
  id,
  components: {
    Transform: {
      pos: { x: _.random(0, 200), y: _.random(0, 200) },
      size: { w: 50, h: 50 },
    },
    Renderer: {
      strokeColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
      fillColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
    },
    Collider: {
      type: 'AABB',
    },
    Script0: {
      triggers: [
        { type: 'TapTrigger', target:'Self' },
      ],
      conditions: [
        { type: 'Switch', target:'Self', condition:false },
      ],
      actions: [
        { type: 'SetComponent', component: 'DirectionalMovement', velocity: { x: 1, y: 0 } },
        { type: 'Switch', target:'Self', set:true },
      ],
    },
    Script1: {
      triggers: [
        { type: 'TapTrigger', target:'Self' },
      ],
      conditions: [
        { type: 'Switch', target:'Self', condition:true },
      ],
      actions: [
        { type: 'SetComponent', component: 'DirectionalMovement', velocity: { x: -1, y: 0 } },
        { type: 'Switch', set:false },
      ],
    },
  },
});

export const generateTestSceneEntities = () => ([
  {
    id: 'e0',
    components: {
      Transform: {
        pos: { x: 0, y: 0 },
        size: { w: 50, h: 50 },
      },
      Renderer: {
        strokeColor: [0, 255, 0],
        fillColor: [0, 0, 255],
      },
      Collider: {
        type: 'AABB',
      },
      Script0: {
        triggers: [
          { type: 'TapTrigger', target:'Self' },
        ],
        conditions: [
          { type: 'Switch', target:'e1', condition:false },
        ],
        actions: [
          { type: 'Switch', set:true },
        ],
      },
      Script1: {
        triggers: [
          { type: 'TapTrigger', target:'Self' },
        ],
        conditions: [
          { type: 'Switch', target:'e1', condition:true },
        ],
        actions: [
          { type: 'Switch', set:false },
        ],
      },
    },
  },
  {
    id: 'e1',
    components: {
      Transform: {
        pos: { x: 200, y: 200 },
        size: { w: 50, h: 50 },
      },
      Renderer: {
        strokeColor: [0, 0, 255],
        fillColor: [0, 255, 0],
      },
      Collider: {
        type: 'AABB',
      },
      Script0: {
        triggers: [
          { type: 'TapTrigger', target:'Self' },
        ],
        conditions: [
          { type: 'Switch', target:'Self', condition:false },
        ],
        actions: [
          { type: 'Switch', set:true },
        ],
      },
      Script1: {
        triggers: [
          { type: 'TapTrigger', target:'Self' },
        ],
        conditions: [
          { type: 'Switch', target:'Self', condition: true },
        ],
        actions: [
          { type: 'Switch', set:false },
        ],
      },
    }
  }
]);