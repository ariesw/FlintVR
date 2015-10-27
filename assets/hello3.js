function vrmain(env) {
  var Geometry        = env.core.Geometry;
  var Program         = env.core.Program;
  var Model           = env.core.Model;
  var Vector3f        = env.core.Vector3f;
  var Vector4f        = env.core.Vector4f;
  var Matrix4f        = env.core.Matrix4f;
  var VERTEX_POSITION = env.core.VERTEX_POSITION;
  var VERTEX_COLOR    = env.core.VERTEX_COLOR;
  ////////////////////////////////////////////

  var program = Program((
    '#version 300 es\n'+
    'in vec3 Position;\n'+
    'in vec4 VertexColor;\n'+
    'uniform mat4 Modelm;\n'+
    'uniform mat4 Viewm;\n'+
    'uniform mat4 Projectionm;\n'+
    'out vec4 fragmentColor;\n'+
    'void main()\n'+
    '{\n'+
    ' gl_Position = Projectionm * ( Viewm * ( Modelm * vec4( Position, 1.0 ) ) );\n'+
    ' fragmentColor = VertexColor;\n'+
    '}'
  ), (
    '#version 300 es\n'+
    'in lowp vec4 fragmentColor;\n'+
    'out lowp vec4 outColor;\n'+
    'void main()\n'+
    '{\n'+
    ' outColor = fragmentColor;\n'+
    '}'
  ));
  var cubeVertices = [
    VERTEX_POSITION,       VERTEX_COLOR,
    Vector3f(-1,  1, -1),  Vector4f(1, 0, 1, 1), // top
    Vector3f( 1,  1, -1),  Vector4f(0, 1, 0, 1),
    Vector3f( 1,  1,  1),  Vector4f(0, 0, 1, 1),
    Vector3f(-1,  1,  1),  Vector4f(1, 0, 0, 1),
    Vector3f(-1, -1, -1),  Vector4f(0, 0, 1, 1), // bottom
    Vector3f(-1, -1,  1),  Vector4f(0, 1, 0, 1),
    Vector3f( 1, -1,  1),  Vector4f(1, 0, 1, 1),
    Vector3f( 1, -1, -1),  Vector4f(1, 0, 0, 1)
  ];
  var cubeIndices = [
    0, 1, 2, 2, 3, 0, // top
    4, 5, 6, 6, 7, 4, // bottom
    2, 6, 7, 7, 1, 2, // right
    0, 4, 5, 5, 3, 0, // left
    3, 5, 6, 6, 2, 3, // front
    0, 1, 7, 7, 4, 0  // back
  ];
  var cubeGeometry = Geometry({
    vertices: cubeVertices,
    indices: cubeIndices
  });

  var cube1 = Model({
    geometry: cubeGeometry,
    program: program,
    position: Vector3f(0, 0, -15),
    onFrame: function(ev) {
      if (!this._start) {
        this._start = ev.now;
      }
      var secondsElapsed = (ev.now - this._start); // Seconds
      this.position.x = Math.sin(secondsElapsed) * -10;
    },
    collideTag: 'cube1',
    collidesWith: {'cube2': true, 'cube3': true},
    onCollideStart: function(ev, other) {
      this.position.y -= 1;
    },
    onCollideEnd: function(ev, other) {
      this.position.y += 1;
    }
  });

  var cube2 = Model({
    geometry: cubeGeometry,
    program: program,
    position: Vector3f(0, 0, -15),
    onFrame: function(ev) {
      if (!this._start) {
        this._start = ev.now;
      }
      var secondsElapsed = (ev.now - this._start); // Seconds
      this.position.x = Math.sin(secondsElapsed) * 10;
    },
    collideTag: 'cube2',
    collidesWith: {'cube1': true},
    onCollideStart: function(ev, other) {
      this.position.y -= 1;
    },
    onCollideEnd: function(ev, other) {
      this.position.y += 1;
    }
  });

  var cube3 = Model({
    geometry: cubeGeometry,
    program: program,
    position: Vector3f(-10, 0, -15),
    onFrame: function(ev) {
      if (!this._start) {
        this._start = ev.now;
      }
      var secondsElapsed = (ev.now - this._start); // Seconds
      this.position.y = Math.cos(secondsElapsed) * 10;
    },
    collideTag: 'cube3',
    collidesWith: {'cube2': true, 'cube1': true},
    onCollideStart: function(ev, other) {
      this.position.x -= 1;
    },
    onCollideEnd: function(ev, other) {
      this.position.x += 1;
    }
  });

  env.scene.add(cube1);
  env.scene.add(cube2);
  env.scene.add(cube3);
}