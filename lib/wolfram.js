export class WolframAutomata {
  constructor(ruleNo, windowSize, seed = 1) {
    this.ruleNo = ruleNo;
    this.rules = [];
    let rule = ruleNo;
    for (let i = windowSize - 1; i >= 0; i--) {
      const no = Math.pow(2, i);
      if (no <= rule) {
        rule = rule - no;
        this.rules.push(true);
      } else {
        this.rules.push(false);
      }
    }
    this.rules = this.rules.reverse();
    this.windowSize = windowSize;
    this.state = [];
    // initialize state
    if (seed >= 0) {
      const seedStr = seed.toString(2);
      for (let i = 0; i < seedStr.length; i++) {
        if (seedStr[i] === '0') {
          this.state.push(false);
        } else {
          this.state.push(true);
        }
      }
    } else {
      // random state
      for (let i = 0; i < windowSize; i++) {
        if (Math.random() > 0.5) {
          this.state.push(false);
        } else {
          this.state.push(true);
        }
      }
    }
  }

  determinant(i) {
    let [v1, v2, v3] = [i - 1, i, i + 1];
    if (v1 < 0) {
      v1 = this.windowSize - 1;
    }
    if (v3 >= this.windowSize) {
      v3 = 0;
    }
    return (this.state[v1] ? 4 : 0) + (this.state[v2] ? 2 : 0) + (this.state[v3] ? 1 : 0);
  }

  nextState() {
    const newState = [];
    for (let i = 0; i < this.windowSize; i++) {
      let determinant = this.determinant(i);
      if (this.rules[determinant]) {
        newState.push(true);
      } else {
        newState.push(false);
      }
    }
    this.state = newState;
    return newState;
  }

  // generate random initial state from chaotic rule 30
  randomSeed(seed) {
    let inner = new WolframAutomata(30, this.windowSize);
    let newState;
    for (let i = 0; i < seed; i++) {
      i++;
      newState = inner.nextState();
    }
    this.state = newState;
  }
}
