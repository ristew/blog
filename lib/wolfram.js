export class WolframAutomata {
  constructor(ruleNo, breadth) {
    this.ruleNo = ruleNo;
    this.rules = [];
    let rule = ruleNo;
    for (let i = breadth - 1; i >= 0; i--) {
      const no = Math.pow(2, i);
      if (no <= rule) {
        rule = rule - no;
        this.rules.push(true);
      } else {
        this.rules.push(false);
      }
    }
    this.rules = this.rules.reverse();
    this.breadth = breadth;
    this.state = [];
    // initialize state
    for (let i = 0; i < breadth; i++) {
      if (Math.random() > 0.5) {
        this.state.push(false);
      } else {
        this.state.push(true);
      }
    }
  }

  determinant(i) {
    let [v1, v2, v3] = [i - 1, i, i + 1];
    if (v1 < 0) {
      v1 = this.breadth - 1;
    }
    if (v3 >= this.breadth) {
      v3 = 0;
    }
    return (this.state[v1] ? 4 : 0) + (this.state[v2] ? 2 : 0) + (this.state[v3] ? 1 : 0);
  }

  nextState() {
    const newState = [];
    for (let i = 0; i < this.breadth; i++) {
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
}
