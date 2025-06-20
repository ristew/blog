import { __, base } from 'simulabra';
import html from 'simulabra/html';
import { createNoise2D } from 'simplex-noise';
import posts from '../posts/posts.json';

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
      $.Method.new({ name: 'normalize', do() { return this.mul(1 / Math.max(this.length(), 1e-5)); } }),
      $.Method.new({ name: 'description', do() { return `$.Vec2[${this.x()},${this.y()}]`; } })
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
        do(w, h, cellSize) {
          const width = Math.ceil(w / cellSize);
          const height = Math.ceil(h / cellSize);
          return $.Grid.new({
            cellSize,
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
            this.data()[this.index(ix, iy)] = Math.min(255, this.data()[this.index(ix, iy)] + 1);
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
          return $.Vec2.from(dRdx, dRdy);
        }
      })
    ]
  });

/* -------- MultiGrid -------- */
$.Class.new({
  name: 'MultiGrid',
  slots: [
    $.Var.new({ name: 'levels' }),                      // Array<Grid>
    $.Static.new({
      name: 'from',
      do(w, h, sizes) {                                 // sizes: e.g. [8, 16, 32]
        return $.MultiGrid.new({
          levels: sizes.map(sz => $.Grid.from(w, h, sz))
        });
      }
    }),
    $.Method.new({                                      // write to every level
      name: 'mark',
      do(p, s) { this.levels()[s - 1].mark(p); }
    }),
    $.Method.new({                                      // weighted sum of ∇ρ
      name: 'grad',
      do(p, s) {
        let acc = $.Vec2.from(0, 0);
        let total = 0;
        for (let i = s - 1; i < this.levels().length; i++) {
          const g = this.levels()[i];
          const w = 1 / g.cellSize();                  // finer ⇒ larger weight
          acc.add(g.grad(p));
          total += 1;
        }
        return acc.mul(1 / total);
        // return acc.mul(1 / Math.max(total, 1e-5));
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
        do(w, h) {
          const eps = 0.5;
          const x = 100 * this.pos().x() / w;
          const y = 100 * this.pos().y() / h;
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
          if (this.t() > lifespan) {
            this.active(false);
            return;
          }

          const emptyDir = parent.grid().grad(this.pos(), this.size()).mul(-1);
          const swirlDir = this.curl(w, h).normalize().mul(0.5);
          const upDir = $.Vec2.from(0, -0.05);
          const prev     = (this.lastDir() || $.Vec2.from(0, -1)).mul(Math.sqrt(this.size()));
          // this.log('empty', emptyDir, 'swirl', swirlDir, 'up', upDir, 'prev', prev);

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

          parent.grid().mark(this.pos(), this.size());

          const leafmod = Math.floor(10 * this.size());
          if (this.t() % leafmod === 0) {
            const lw = 18 * s, lh = 36 * s;
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
          const vineInit = () => {
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
            const maxSize = 5;

            const grid = $.MultiGrid.from(w, h, [8, 12, 16, 24, 32]);
            this.grid(grid);

            this.vines([
              $.Vine.new({ pos: $.Vec2.from(w / 4, h), size: 5 }),
              $.Vine.new({ pos: $.Vec2.from(3 * w / 4, h), size: 5 }),
            ]);

            this.drawLoop();
          };
          if (document.readyState !== 'loading') {
            setTimeout(vineInit, 50);
          } else {
            document.addEventListener('DOMContentLoaded', () => {
              setTimeout(vineInit, 50);
            });
          }

        }
      }),
      $.Method.new({
        name: 'drawLoop',
        do() {
          const loop = () => {
            if (!document.hidden) {
              let vinecur = this.vinecur();
              const vine = this.vines()[vinecur];
              if (vine) {
                vine.draw(this);
              }
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
    name: 'VPage',
    slots: [
      $.Var.new({ name: 'parent' }),
      $.Virtual.new({ name: 'content' }),
      $.Var.new({ name: 'showHomeButton', default: true }),
      $.Method.new({
        name: 'homelink',
        do() {
          return $.HTML.t`<a class="home-link" href="#" onclick=${() => this.parent().toState($.Home)}>^^</a>`;
        }
      }),
      $.Method.new({
        name: 'render',
        do(additionalClasses = []) {
          const classes = ['mainstage', ...additionalClasses].join(' ');
          return $.HTML.t`<div>${this.showHomeButton() ? this.homelink() : ''}<div class=${classes}>${() => this.content()}</div></div>`;
          
        }
      }),
    ]
  });
      

  $.Class.new({
    name: 'Home',
    slots: [
      $.VPage,
      $.Var.new({
        name: 'showHomeButton',
        default: false
      }),
      $.Method.new({
        name: 'content',
        do() { 
          const navTo = cls => e => {
            e.preventDefault();
            this.parent().toState(cls);
          };
          return $.HTML.t`
          <div class="nomen-box">
            <div class="nomen">Riley Stewart</div>
            <div class="subnomen">conjuring infinite software</div>
          </div>
          <div class="linken">
            <a class="page-link" href="#" onclick=${navTo($.Projects)}>projects</a>
            <a class="page-link" href="#" onclick=${navTo($.About)}>about</a>
            <a class="page-link" href="#" onclick=${navTo($.Blog)}>blog</a>
          </div>
          `;
        }
      }),
    ]
  });

  $.Class.new({
    name: 'Projects',
    slots: [
      $.VPage,
      $.Method.new({
        name: 'content',
        do() { 
          return $.HTML.t`
            <div class="project">
              <div class="project-nomen">Simulabra</div>
              <div>An object-oriented Javascript framework inspired by the Common Lisp Object System and Smalltalk. This site is built with Simulabra.</div>
              <a href="https://github.com/simulabra/simulabra" target="_blank">repo</a>
            </div>
            <div class="project">
              <div class="project-nomen">Weightscan</div>
              <div>Machine learning as art: experimenting with using autoencoders to embed 3d point clouds of transformer layer hidden states</div>
              <a href="https://github.com/ristew/weightscan" target="_blank">repo</a>
            </div>
          `;
        }
      }),
    ]
  });

  $.Class.new({
    name: 'About',
    slots: [
      $.VPage,
      $.Method.new({
        name: 'content',
        do() { 
          return $.HTML.t`
            <div>As a technologist with one foot in the past and the other in the future, I'm fascinated by the history of computing, especially the rise and fall of objects. Currently I'm trying to understand the unreasonable effectiveness of transformer-based language models and the nature of intelligent systems more broadly.</div>
            <div>I live in Seattle with my wife, cat, and two corgis. If you want to reach me, my email is me@this domain</div>
          `;
        }
      }),
    ]
  });

  $.Class.new({
    name: 'Blog',
    slots: [
      $.VPage,
      $.Method.new({
        name: 'content',
        do() { 
          return $.HTML.t`<div>
            ${() => posts.map(p => $.HTML.t`<div>${p.metadata.date} <a href=${`posts/${p.name}`}>${p.metadata.title}</a></div>`)}
          </div>`;
        }
      }),
    ]
  });

  $.Class.new({
    name: 'Post',
    slots: [
      $.Var.new({ name: 'parent' }),
      $.Var.new({ name: 'data' }),
      $.Method.new({
        name: 'render',
        do() { 
          return $.HTML.t([`<div class="mainstage blogpost"><h1>${this.data().metadata.title}</h1><article>` + this.data().html + '</article></div>']);
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
            const stateName = event.state?.state || 'Home';
            this.appstate($[stateName].new({ parent: this }));
          });
          this.history([]);
          history.pushState({ state: 'Home' }, '', `/#`);
          this.appstate($.Home.new({ parent: this }));
        }
      }),
      $.Method.new({
        name: 'toState',
        do(cls, args = {}) {
          this.history().push(this.appstate());
          const stateName = cls.name();
          history.pushState({ state: stateName }, '', `/#`);
          args.parent = this;
          this.appstate(cls.new(args));
        }
      }),
      $.Method.new({
        name: 'render',
        do() { 
          return $.HTML.t`<div>${() => this.appstate().render()}</div>`;
        }
      }),
    ]
  });

  $.CanvasVines.new();
  $.App.new().mount();
}.module({ name: 'blog.vines.spacefill', imports: [base, html] }).load();
