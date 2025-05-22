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
      $.Var.new({ name: 'cellSize' }),
      $.Var.new({ name: 'width' }),
      $.Var.new({ name: 'height' }),
      $.Var.new({ name: 'data' }),
      $.Var.new({ name: 'emptyval', default: 2 }),
      $.Static.new({
        name: 'from',
        do(w, h, sz) {
          const width = Math.ceil(w / sz);
          const height = Math.ceil(h / sz);
          this.log('new grid', width, height, sz);
          return $.Grid.new({
            cellSize: sz,
            width,
            height,
            data: new Uint8Array(width * height)
          });
        }
      }),
      $.Method.new({ name: 'index', do(ix, iy) { return iy * this.width() + ix; } }),
      $.Method.new({
        name: 'mark',
        do(p) {
          const ix = Math.floor(p.x() / this.cellSize());
          const iy = Math.floor(p.y() / this.cellSize());
          if (ix >= 0 && iy >= 0 && ix < this.width() && iy < this.height()) {
            this.data()[this.index(ix, iy)] = this.emptyval();
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
          const idx = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? this.emptyval() * 2 : d[this.index(x, y)];
          const dRdx = idx(ix + 1, iy) - idx(ix - 1, iy);
          const dRdy = idx(ix, iy + 1) - idx(ix, iy - 1);
          return $.Vec2.from(dRdx, dRdy);
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
      $.Var.new({ name: 'active', default: true }),
      $.Var.new({ name: 'pos' }),
      $.Var.new({ name: 'size', default: 2 }),
      $.Var.new({ name: 'noise', default: () => createNoise2D() }),
      $.Var.new({ name: 'fieldOffset', default: () => $.Vec2.from(Math.random() * 5000, Math.random() * 5000) }),
      $.Var.new({ name: 'lastDir' }),
      $.Method.new({
        name: 'curl',
        do() {
          const eps = 0.0007;
          const scale = 10 * eps;
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
          const lifespan = (this.size()**2) * 100;
          const w        = parent.canvas().width;
          const h        = parent.canvas().height;
          const s = parent.dpi() / 2;
          if (this.t() > lifespan || this.pos().x() > w || this.pos().x() < 0 || this.pos().y() > h || this.pos().y() < 0) {
            this.active(false);
            return;
          }

          const emptyDir = parent.grid().grad(this.pos()).mul(-1);
          const swirlDir = this.curl().normalize().mul(0.5);
          const lerp     = 0.1 * (this.pos().y() / h) ** 2;
          // const upDir    = $.Vec2.from(0, -1).mul(lerp);
          const upDir = $.Vec2.from(w / 2, h / 2).sub(this.pos()).normalize().mul(0.05);
          const prev     = (this.lastDir() || upDir).mul(this.size());

          const raw = upDir.add(emptyDir).add(swirlDir).add(prev).normalize();
          const dir = prev
            .add(raw)
            .normalize();

          this.lastDir(dir);
          const oldpos = this.pos();
          this.pos(this.pos().add(dir.mul(s)));

          parent.ctx().fillStyle = '#a89984';
          parent.ctx().beginPath();
          parent.ctx().arc(this.pos().x(), this.pos().y(), this.size() * s, 0, Math.PI * 2);
          parent.ctx().fill();

          parent.grid().mark(this.pos());

          const leafmod = Math.floor(10 * this.size());
          if (this.t() % leafmod === 0) {
            const lw = 12 * s, lh = 24 * s;
            const side   = (Math.floor(this.t() / leafmod) % 2 === 0 ? 0 : 2);
            const angle  = Math.atan2(dir.y(), dir.x()) + side * Math.PI / 2;
            const ox = this.lastDir().x() * (lh + this.size() * s);
            const oy = this.lastDir().y() * (lh + this.size() * s);
            parent.ctx().save();
            parent.ctx().translate(oldpos.x(), oldpos.y());
            parent.ctx().rotate(angle);
            parent.ctx().beginPath();
            // parent.ctx().ellipse(0, 0, 6, 12, 0, 0, Math.PI * 2);
            parent.ctx().bezierCurveTo(
              lw * 0.3, -lh * 0.2,
              lw * 0.9, -lh * 0.7,
              0,       -lh
            );
            parent.ctx().bezierCurveTo(
              -lw * 0.6, -lh * 0.6,
              -lw * 0.2, -lh * 0.2,
              0,         0
            );
            parent.ctx().fillStyle = '#a8bb84';
            parent.ctx().fill();
            parent.ctx().restore();
          }

          this.t(this.t() + 1);

          if (this.t() - this.lastSpawn() > 100 && Math.random() > 0.99 && parent.vines().length < 100 && this.size() > 1) {
            parent.vines().push($.Vine.new({
              pos: $.Vec2.from(this.pos().x(), this.pos().y()),
              size: this.size() - 1,
              fieldOffset: this.fieldOffset().add($.Vec2.from(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
              ))
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
      $.Var.new({ name: 'vinecur', default: 0 }),
      $.After.new({
        name: 'init',
        do() {
          document.addEventListener('DOMContentLoaded', () => {
            this.canvas(document.getElementById('bg-canvas'));
            this.ctx(this.canvas().getContext('2d'));
            this.dpi(Math.round(window.devicePixelRatio));
            this.log(this.dpi());

            const style = getComputedStyle(this.canvas());
            const wCss = parseFloat(style.getPropertyValue('width'));
            const hCss = parseFloat(style.getPropertyValue('height'));
            this.canvas().setAttribute('width', this.dpi() * wCss);
            this.canvas().setAttribute('height', this.dpi() * hCss);

            const w = this.canvas().width;
            const h = this.canvas().height;

            const grid = $.Grid.from(w, h, 8);
            this.grid(grid);

            // this.vines(Array.from(
            //   { length: 8 },
            //   (it, idx) => $.Vine.new({ pos: $.Vec2.from(idx * w / 7, h), size: 5 }),
            // ));
            this.vines([
              $.Vine.new({ pos: $.Vec2.from(w / 2, h), size: 5 }),
              $.Vine.new({ pos: $.Vec2.from(w / 2, 0), size: 5 }),
            ]);

            this.drawLoop();
          });
        }
      }),
      $.Method.new({
        name: 'drawLoop',
        do() {
          const loop = () => {
            if (!document.hidden) {
              let vinecur = this.vinecur();
              const vine = this.vines()[vinecur];
              vine.draw(this);
              vinecur++;
              if (vinecur >= this.vines().length) {
                vinecur = 0;
                this.vines(this.vines().filter(v => v.active()));
              }
              this.vinecur(vinecur);
            }
            requestAnimationFrame(loop);
          };
          requestAnimationFrame(loop);
        }
      })
    ]
  });

  $.Class.new({
    name: 'Home',
    slots: [
      $.Var.new({ name: 'parent' }),
      $.Method.new({
        name: 'render',
        do() { 
          return $.HTML.t`<div class="mainstage">
            <div class="nomen">Riley Stewart</div>
            <a href="#Projects" onclick=${() => this.parent().toState($.Projects)}>projects</a>
            <a href="#About" onclick=${() => this.parent().toState($.About)}>about</a>
          </div>`;
        }
      }),
    ]
  });

  $.Class.new({
    name: 'Projects',
    slots: [
      $.Var.new({ name: 'parent' }),
      $.Method.new({
        name: 'render',
        do() { 
          return $.HTML.t`<div class="mainstage">
            <div class="project-nomen">Simulabra</div>
            <div>An object-oriented Javascript framework inspired by the Common Lisp Object System and Smalltalk. This site is built with Simulabra.</div>
            <a href="https://github.com/simulabra/simulabra" target="_blank">repo</a>
            <div class="project-nomen">Weightscan</div>
            <div>Machine learning as art: experimenting with using autoencoders to embed 3d point clouds of transformer layer hidden states</div>
            <a href="https://github.com/ristew/weightscan" target="_blank">repo</a>
            <a href="#" onclick=${() => this.parent().toState($.Home)}>home</a>
          </div>`;
        }
      }),
    ]
  });

  $.Class.new({
    name: 'About',
    slots: [
      $.Var.new({ name: 'parent' }),
      $.Method.new({
        name: 'render',
        do() { 
          return $.HTML.t`<div class="mainstage">
            The way I see myself is as a technologist with one foot in the past and the other in the future. The early history of computing fascinates me, especially the ascendency of objects leading up to the millenium. But right now I am putting the most effort into understanding the unreasonable effectiveness of transformer-based language models and the nature of intelligent systems more broadly. 
            <a href="#" onclick=${() => this.parent().toState($.Home)}>home</a>
          </div>`;
        }
      }),
    ]
  });

  $.Class.new({
    name: 'App',
    slots: [
      $.Component,
      $.Var.new({ name: 'history' }),
      $.Signal.new({
        name: 'appstate',
      }),
      $.After.new({
        name: 'init',
        do() {
          window.addEventListener('popstate', (event) => {
            this.log('popstate', event.state);
            if (event.state !== null) {
              const stateName = event.state?.state || 'Home';
              const cur = this.appstate()?.class().name() ?? 'Home';
              history.pushState({ state: cur }, '', `/#${cur}`);
              this.appstate($[stateName].new({ parent: this }));
            }
          });
          this.history([]);
          this.toState($.Home);
        }
      }),
      $.Method.new({
        name: 'toState',
        do(cls) {
          this.history().push(this.appstate());
          const cur = this.appstate()?.class().name() ?? 'Home';
          history.pushState({ state: cur }, '', `/#${cur}`);
          this.appstate(cls.new({ parent: this }));
        }
      }),
      $.Method.new({
        name: 'back',
        do() {
          const prev = this.history().pop();
          if (prev) {
            this.appstate(prev);
          }
        }
      }),
      $.Method.new({
        name: 'render',
        do() { 
          return $.HTML.t`<span>${() => this.appstate().render()}</span>`;
        }
      }),
      $.Method.new({
        name: 'css',
        do() {
          return `
#clicky { color: red; }
`
        }
      })
    ]
  });

  $.CanvasVines.new();
  $.App.new().mount();
}.module({ name: 'blog.vines.spacefill', imports: [base, html] }).load();
