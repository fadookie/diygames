import _ from 'lodash';

export const generateBaseEntity = (id) => ({
  id,
  components: {
    Transform: {
      type: 'Transform',
      pos: { x: _.random(0, 200), y: _.random(0, 200) },
      size: { w: 50, h: 50 },
    },
    Renderer: {
      type: 'Renderer',
      strokeColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
      fillColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
    },
    Collider: {
      type: 'Collider',
      colliderType: 'AABB',
    },
    Script0: {
      type: 'Script0',
      triggers: [
        { type: 'TimeSegmentTrigger', segment: 3 },
      ],
      conditions: [
      ],
      actions: [
        { type: 'SetComponent', component: { type: 'DirectionalMovement', velocity: { x: 1, y: 0 } } },
        { type: 'Switch', target:'Self', set:true },
      ],
    },
    Script1: {
      type: 'Script1',
      triggers: [
        { type: 'TapTrigger', target:'Self' },
      ],
      conditions: [
        { type: 'Switch', target:'Self', condition:true },
      ],
      actions: [
        { type: 'SetComponent', component: { type: 'DirectionalMovement', velocity: { x: -1, y: 0 } } },
        { type: 'Switch', set:false },
      ],
    },
  },
});

// export const generateBaseEntity = (id) => ({
//   id,
//   components: {
//     Transform: {
//       type: 'Transform',
//       pos: { x: _.random(0, 200), y: _.random(0, 200) },
//       size: { w: 50, h: 50 },
//     },
//     Renderer: {
//       type: 'Renderer',
//       strokeColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
//       fillColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
//     },
//     Collider: {
//       type: 'Collider',
//       colliderType: 'AABB',
//     },
//     Script0: {
//       type: 'Script0',
//       triggers: [
//         { type: 'TapTrigger', target:'Self' },
//       ],
//       conditions: [
//         { type: 'Switch', target:'Self', condition:false },
//       ],
//       actions: [
//         { type: 'SetComponent', component: { type: 'DirectionalMovement', velocity: { x: 1, y: 0 } } },
//         { type: 'Switch', target:'Self', set:true },
//       ],
//     },
//     Script1: {
//       type: 'Script1',
//       triggers: [
//         { type: 'TapTrigger', target:'Self' },
//       ],
//       conditions: [
//         { type: 'Switch', target:'Self', condition:true },
//       ],
//       actions: [
//         { type: 'SetComponent', component: { type: 'DirectionalMovement', velocity: { x: -1, y: 0 } } },
//         { type: 'Switch', set:false },
//       ],
//     },
//   },
// });

export const generateTestSceneEntities = () => ([
  {
    id: 'e0',
    components: {
      Transform: {
        type: 'Transform',
        pos: { x: 0, y: 0 },
        size: { w: 50, h: 50 },
      },
      Renderer: {
        type: 'Renderer',
        strokeColor: [0, 255, 0],
        fillColor: [0, 0, 255],
      },
      Collider: {
        type: 'Collider',
        colliderType: 'AABB',
      },
      Script0: {
        type: 'Script0',
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
        type: 'Script1',
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
        type: 'Transform',
        pos: { x: 200, y: 200 },
        size: { w: 50, h: 50 },
      },
      Renderer: {
        type: 'Renderer',
        strokeColor: [0, 0, 255],
        fillColor: [0, 255, 0],
      },
      Collider: {
        type: 'Collider',
        colliderType: 'AABB',
      },
      Script0: {
        type: 'Script0',
        triggers: [
          { type: 'Switch', target:'e0', changingTo:true },
        ],
        actions: [
          { type: 'Switch', set:true },
        ],
      },
      Script1: {
        type: 'Script1',
        triggers: [
          { type: 'Switch', target:'e0', changingTo:false },
        ],
        actions: [
          { type: 'Switch', set:false },
        ],
      },
      Script2: {
        type: 'Script2',
        triggers: [
          { type: 'Switch', target:'Self', changingTo:true },
        ],
        actions: [
          { type: 'SetComponent', component: { type: 'DirectionalMovement', velocity: { x: 0, y: 1 } } },
        ],
      },
      Script3: {
        type: 'Script3',
        triggers: [
          { type: 'Switch', target:'Self', changingTo:false },
        ],
        actions: [
          { type: 'SetComponent', component: { type: 'StopMovement' }, },
          // { type: 'SetComponent', component: 'DirectionalMovement', velocity: { x: 0, y: -1 } },
        ],
      },
    }
  }
]);