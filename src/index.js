import { __, base } from 'simulabra';
import html from 'simulabra/html';
import { createNoise2D } from 'simplex-noise';

export default await function (_, $) {
  /* -------- Vec2 -------- */
  $.Class.new({
    name: 'Vec2',
    slots: [
      $.Var.new({ name: 'x', default: 0 }),
      $.Var.new({ name: 'y', default: 0 }),
      $.Static.new({ name: 'from', do(x, y) { return this.new({ x, y }); } }),
      $.Method.new({ name: 'add', do(v) { return $.Vec2.from(this.x() + v.x(), this.y() + v.y()); } }),
      $.Method.new({ name: 'sub', do(v) { return $.Vec2.from(this.x() - v.x(), this.y() - v.y()); } }),
      $.Method.new({ name: 'mul', do(s) { return $.Vec2.from(this.x() * s, this.y() * s); } }),
      $.Method.new({ name: 'length', do() { return Math.hypot(this.x(), this.y()); } }),
      $.Method.new({ name: 'dist', do(v) { return Math.hypot(this.x() - v.x(), this.y() - v.y()); } }),
      $.Method.new({ name: 'normalize', do() { return this.mul(1 / Math.max(this.length(), 1e-5)); } })
    ]
  });

  /* -------- Grid -------- */
  $.Class.new({
    name: 'Grid',
    slots: [
      $.Var.new({ name: 'cellSize', default: 4 }),
      $.Var.new({ name: 'width' }),
      $.Var.new({ name: 'height' }),
      $.Var.new({ name: 'data' }),
      $.Method.new({
        name: 'init',
        do(w, h, sz = 4) {
          this.cellSize(sz);
          this.width(Math.ceil(w / sz));
          this.height(Math.ceil(h / sz));
          this.data(new Uint8Array(this.width() * this.height()));
        }
      }),
      $.Method.new({ name: 'index', do(ix, iy) { return iy * this.width() + ix; } }),
      $.Method.new({
        name: 'mark',
        do(p) {
          const ix = Math.floor(p.x() / this.cellSize());
          const iy = Math.floor(p.y() / this.cellSize());
          if (ix >= 0 && iy >= 0 && ix < this.width() && iy < this.height()) {
            this.data()[this.index(ix, iy)] = 255;
          }
        }
      }),
      $.Method.new({
        name: 'grad',
        do(p) {
          const cs = this.cellSize();
          const ix = Math.floor(p.x() / cs);
          const iy = Math.floor(p.y() / cs);
          const w = this.width();
          const h = this.height();
          const d = this.data();
          const idx = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 255 : d[this.index(x, y)];
          const dRdx = idx(ix + 1, iy) - idx(ix - 1, iy);
          const dRdy = idx(ix, iy + 1) - idx(ix, iy - 1);
          return $.Vec2.from(dRdx, dRdy).normalize();
        }
      })
    ]
  });

  /* -------- Vine -------- */
  $.Class.new({
    name: 'Vine',
    slots: [
      $.Var.new({ name: 't', default: 0 }),
      $.Var.new({ name: 'lastSpawn', default: 0 }),
      $.Var.new({ name: 'pos' }),
      $.Var.new({ name: 'noise', default: () => createNoise2D() }),
      $.Var.new({ name: 'fieldOffset', default: () => $.Vec2.from(Math.random() * 5000, Math.random() * 5000) }),
      $.Method.new({
        name: 'curl',
        do() {
          const eps = 1e-5;
          const scale = 0.001;
          const base = this.fieldOffset();
          const x = (this.pos().x() + base.x()) * scale;
          const y = (this.pos().y() + base.y()) * scale;
          const n1 = this.noise()(x + eps, y);
          const n2 = this.noise()(x - eps, y);
          const n3 = this.noise()(x, y + eps);
          const n4 = this.noise()(x, y - eps);
          return $.Vec2.from((n4 - n3) * 0.5 / eps, (n1 - n2) * 0.5 / eps);
        }
      }),
      $.Method.new({
        name: 'draw',
        do(parent) {
          const lifespan = 900;
          if (this.t() > lifespan) { return; }

          const upDir = $.Vec2.from(0, -1);
          const emptyDir = parent.grid().grad(this.pos()).mul(-1).normalize();
          const swirlDir = this.curl().normalize();
          // const k = 0.8 - 0.5 * (this.t() / lifespan);
          const h = parent.canvas().height;
          const lerp = this.pos().y() / h;
          const k = 0.3;
          const dir = upDir.mul(lerp).add(emptyDir.mul(0.5 / lerp).add(swirlDir.mul(0.5 / lerp))).normalize();

          this.pos(this.pos().add(dir));

          parent.ctx().fillStyle = '#a89984';
          parent.ctx().beginPath();
          parent.ctx().arc(this.pos().x(), this.pos().y(), 4, 0, Math.PI * 2);
          parent.ctx().fill();

          parent.grid().mark(this.pos());

          this.t(this.t() + 1);

          if (this.t() - this.lastSpawn() > 300 && parent.vines().length < 50) {
            parent.vines().push($.Vine.new({
              pos: $.Vec2.from(this.pos().x(), this.pos().y()),
              fieldOffset: this.fieldOffset().add($.Vec2.from((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000))
            }));
            this.lastSpawn(this.t());
          }
        }
      })
    ]
  });

  /* -------- CanvasVines -------- */
  $.Class.new({
    name: 'CanvasVines',
    slots: [
      $.Var.new({ name: 'canvas' }),
      $.Var.new({ name: 'ctx' }),
      $.Var.new({ name: 'dpi' }),
      $.Var.new({ name: 'vines' }),
      $.Var.new({ name: 'grid' }),
      $.After.new({
        name: 'init',
        do() {
          document.addEventListener('DOMContentLoaded', () => {
            this.canvas(document.getElementById('bg-canvas'));
            this.ctx(this.canvas().getContext('2d'));
            this.dpi(Math.round(window.devicePixelRatio));

            const style = getComputedStyle(this.canvas());
            const wCss = parseFloat(style.getPropertyValue('width'));
            const hCss = parseFloat(style.getPropertyValue('height'));
            this.canvas().setAttribute('width', this.dpi() * wCss);
            this.canvas().setAttribute('height', this.dpi() * hCss);

            const w = this.canvas().width;
            const h = this.canvas().height;

            const grid = $.Grid.new();
            grid.init(w, h, 4);
            this.grid(grid);

            this.vines([
              $.Vine.new({ pos: $.Vec2.from(0, h) }),
              $.Vine.new({ pos: $.Vec2.from(w / 3, h) }),
              $.Vine.new({ pos: $.Vec2.from(2 * w / 3, h) }),
              $.Vine.new({ pos: $.Vec2.from(w, h) })
            ]);

            this.drawLoop();
          });
        }
      }),
      $.Method.new({
        name: 'drawLoop',
        do() {
          const loop = () => {
            for (const vine of this.vines()) { vine.draw(this); }
            requestAnimationFrame(loop);
          };
          requestAnimationFrame(loop);
        }
      })
    ]
  });

  $.CanvasVines.new();
}.module({ name: 'blog.vines.spacefill', imports: [base, html] }).load();
