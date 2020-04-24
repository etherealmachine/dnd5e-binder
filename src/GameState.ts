import { Compendium, CompendiumItem, Monster } from './Compendium';
import { Executable, Reader, Writer } from './Shell';
import Levenshtein from 'fast-levenshtein';

class Command {
  command: string
  args: Argument[]
  regex: RegExp
  syntax: string
  help: string
  f: Function

  constructor(syntax: string, help: string, f: Function) {
    this.syntax = syntax;
    this.help = help;
    this.f = f;
    const groups = syntax.split('<');
    this.command = groups[0].trim();
    groups.shift();
    this.args = groups.map((group) => {
      const [name, type] = group.replace('>', '').split(': ');
      return {
        name: name.trim().replace('?', ''),
        type: type.trim(),
        optional: name.endsWith('?'),
      };
    });
    this.regex = new RegExp(this.args.map(arg => {
      if (arg.type === 'number') {
        return '(-?[-\\d]' + (arg.optional ? '*' : '+') + ')';
      } else if (arg.type === 'number[]') {
        return '(-?[\\d,]' + (arg.optional ? '*' : '+') + ')';
      } else {
        return '(.' + (arg.optional ? '*?' : '+?') + ')';
      }
    }).join('\\s+') + '$');
  }

  execute(game: GameState, commandLine: string) {
    game.log?.write(`executing ${this.syntax}\r\n`);
    return this.f.apply(game, this.parse(commandLine, game.log));
  }

  parse(commandLine: string, out?: Writer): (string | number | number[] | undefined)[] {
    const match = commandLine.match(this.regex);
    out?.write(`"${commandLine}".match(/${this.regex}/)\r\n`)
    out?.write(JSON.stringify(match) + "\r\n")
    if (!match) return [commandLine];
    return match.slice(1, match.length).map((arg, index) => {
      arg = arg.trim();
      out?.write(`arg ${index}: "${arg}": ${this.args[index].type}\r\n`)
      switch (this.args[index].type) {
        case "number":
          if (isNaN(parseInt(arg))) {
            if (this.args[index].optional) {
              return undefined;
            }
            throw new Error(`failed to parse ${arg} as non-optional argument ${this.args[index].name}: number`);
          }
          return parseInt(arg);
        case "number[]":
          const numbers = arg.split(',').map((s => parseInt(s.trim())));
          if (numbers.length === 0 || numbers.some(isNaN)) {
            if (this.args[index].optional) {
              return undefined;
            }
            throw new Error(`failed to parse ${arg} as non-optional argument ${this.args[index].name}: number[]`);
          }
          return numbers;
        case "string | number":
          if (isNaN(parseInt(arg))) {
            return arg;
          }
          return parseInt(arg);
        case "string":
          return arg;
        default:
          throw new Error(`error parsing ${commandLine}, unknown type ${this.args[index].type}`);
      }
    });
  }
}

interface Argument {
  name: string
  type: string
  optional: boolean
}

const commands: { [key: string]: Command } = {};
function command(syntax: string, help: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const command = new Command(syntax, help, descriptor.value);
    commands[command.command] = command;
  }
}

function roll(d: number, count?: number): number {
  let sum = 0;
  if (count === undefined) count = 1;
  for (; count > 0; count--) {
    sum += Math.floor(Math.random() * d) + 1;
  }
  return sum;
}

function repr(e: Monster, index: number): string {
  return `${index + 1}. ${e.name}`;
}

class GameState implements Executable {
  compendium: Compendium = new Compendium();
  setState: (g: GameState) => void;

  motd: Monster;

  // Persisted to local storage
  showStartup: boolean = true;
  encounter: Array<Monster> = [];
  currentIndex: number = 0;
  selected?: CompendiumItem;

  stdin?: Reader;
  stdout?: Writer;
  stderr?: Writer;
  log?: Writer;

  constructor(compendium: Compendium, setState: (g: GameState) => void) {
    this.compendium = compendium;
    this.setState = setState;
    const monsterNames = Object.keys(this.compendium.monsters);
    this.motd = this.compendium.monsters[monsterNames[Math.floor(Math.random() * monsterNames.length)]];
    const savedState = window.localStorage.getItem('dnd5e.gamestate');
    if (savedState) {
      const state = JSON.parse(savedState);
      Object.assign(this, state);
    }
  }

  onChange() {
    this.setState(this);
    window.localStorage.setItem('dnd5e.gamestate', JSON.stringify(this));
  }

  toJSON() {
    return {
      showStartup: this.showStartup,
      encounter: this.encounter,
      currentIndex: this.currentIndex,
    };
  }

  resetState() {
    this.showStartup = true;
    this.encounter = [];
    this.currentIndex = 0;
    this.selected = undefined;
  }

  async execute(commandLine: string): Promise<number> {
    let command = undefined;

    for (const key of Object.keys(commands)) {
      if (commandLine.startsWith(key)) {
        command = commands[key];
        commandLine = commandLine.replace(key, '').trim();
        break;
      }
    }
    if (command === undefined) {
      this.stderr?.write(`unknown command: ${commandLine}\r\n`);
      return 1;
    }
    let result;
    try {
      result = await command.execute(this, commandLine);
    } catch (err) {
      console.error(err);
      if (err) {
        this.stderr?.write(err.toString());
        this.stderr?.write('\r\n');
      } else {
        this.stderr?.write("unknown error\r\n");
      }
      return 1;
    }
    if (typeof result === 'string') {
      this.stdout?.write(result);
      this.stdout?.write('\r\n');
    } else if (result instanceof Promise) {
      try {
        result = await result;
      } catch {
        return 1;
      }
    }
    this.onChange();
    return 0;
  }

  cancel(): void {
  }

  suggestions(partial: string): Array<string> {
    if (partial === "") {
      return Object.keys(commands);
    }
    for (const key of Object.keys(commands)) {
      if (partial.startsWith(key)) {
        partial = partial.replace(key, '').trim();
        break;
      }
    }
    return this.search(partial).map((item) => item.name).slice(0, 10);
  }

  startup() {
    if (!this.showStartup) return '';

    let msg = `Welcome to rpg.ai, the shell for the busy DM!\r\nLoaded the DND5E Compendium.\r\nMonster of the day: ${this.motd?.name}\r\n`;

    if (this.encounter.length > 0) {
      msg += `Resuming your encounter with ${this.encounter.map((i) => i.name).join(', ')}\r\n`;
    }
    msg += "\r\n";
    return msg;
  }

  search(query: string, kinds?: string[]): CompendiumItem[] {
    let items: CompendiumItem[] = [];
    if (kinds === undefined || kinds?.includes('background')) {
      items = items.concat(Object.values(this.compendium.backgrounds));
    }
    if (kinds === undefined || kinds?.includes('class')) {
      items = items.concat(Object.values(this.compendium.classes));
    }
    if (kinds === undefined || kinds?.includes('feat')) {
      items = items.concat(Object.values(this.compendium.feats));
    }
    if (kinds === undefined || kinds?.includes('item')) {
      items = items.concat(Object.values(this.compendium.items));
    }
    if (kinds === undefined || kinds?.includes('monster')) {
      items = items.concat(Object.values(this.compendium.monsters));
    }
    if (kinds === undefined || kinds?.includes('race')) {
      items = items.concat(Object.values(this.compendium.races));
    }
    if (kinds === undefined || kinds?.includes('spell')) {
      items = items.concat(Object.values(this.compendium.spells));
    }
    const editDistance = items.map((item, index) => {
      return { index: index, distance: Levenshtein.get(query.toLowerCase(), item.name.toLowerCase()) };
    });
    editDistance.sort((a, b) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    });
    return editDistance.map((item) => items[item.index]);
  }

  targets(a: number[]): Monster[] {
    return a.map(i => this.encounter[i - 1]);
  }

  @command('help <command?: string>', 'this help message')
  help(command?: string) {
    if (!command || !(command in commands)) {
      return Array.from(Object.values(commands)).map((command) => `${command.syntax} - ${command.help}`).sort().join('\r\n');
    }
    return `${commands[command].syntax} - ${commands[command].help}`;
  }

  @command('welcome', 'toggle welcome message')
  welcome() {
    this.showStartup = !this.showStartup;
    return `welcome message ${this.showStartup ? 'on' : 'off'}`;
  }

  @command('new', 'start a new encounter')
  newEncounter() {
    this.encounter = [];
    return "started new encounter";
  }

  @command('reset', 'clear all saved state')
  async reset() {
    this.stdout?.write("are you sure (y/n)? ");
    const response = await this.stdin?.read();
    if (response === 'y') {
      this.resetState();
      return '\r\ncleared all saved state';
    } else {
      return "\r\ncancelled reset";
    };
  }

  @command('player <name: string> <level?: number>', 'add a player')
  addPlayer(name: string, level?: number) {
    this.encounter.push({
      name: name,
      kind: 'monster',
      hp: '',
      ac: NaN,
      cr: level || NaN,
      passive: NaN,
      size: '',
      speed: '',
      str: NaN,
      dex: NaN,
      con: NaN,
      int: NaN,
      wis: NaN,
      cha: NaN,
      alignment: '',
      type: 'player',
      compendium: {},
      status: {
        hp: NaN,
        maxHP: NaN,
        x: 0,
        y: 0,
        damage: [],
        saves: [],
        actions: [],
        reactions: [],
        legendaries: [],
        conditions: [],
        initiative: NaN,
        spellSlots: [],
        spellcasting: undefined,
      }
    });
    return `added player ${name}`;
  }

  @command('add <name: string> <times?: number>', 'add a monster the current encounter')
  add(name: string, times?: number) {
    const results = this.search(name, ['monster']);
    if (results.length === 0) {
      return `no match found for ${name}`;
    }
    times = (times || 1);
    for (let i = 0; i < times; i++) {
      const monster = JSON.parse(JSON.stringify(results[0]));
      monster.status = {
        initiative: roll(20) + Compendium.modifier(monster.dex),
        level: NaN,
        x: 10,
        y: 12,
        damage: [],
        saves: [],
        actions: [],
        reactions: [],
        legendaries: [],
        conditions: [],
        spellSlots: this.compendium.parseSpellSlots(monster),
      };
      const hpDesc = this.compendium.parseHP(monster);
      if (hpDesc) {
        monster.status.hp = roll(hpDesc.die, hpDesc.num) + (isNaN(hpDesc.bonus) ? 0 : hpDesc.bonus);
        monster.status.maxHP = monster.status.hp;
      }
      monster.status.spellcasting = this.compendium.parseSpellcasting(monster);
      this.encounter.push(monster);
    }
    return `added ${times} ${results[0].name}`;
  }

  @command('rm <targets: number[]>', 'remove a monster or player from the current encounter')
  removeEntity(targets: number[]) {
    this.targets(targets).forEach((target) => {
      const removed = this.encounter.splice(this.encounter.indexOf(target), 1)[0];
      return `removed ${removed.name}`;
    });
  }

  @command('condition <targets: number[]> <condition: string>', 'toggle a condition')
  condition(targets: number[], condition: string) {
    condition = condition.toLowerCase();
    this.targets(targets).forEach((target) => {
      if (target.status?.conditions.indexOf(condition) !== -1) {
        target.status?.conditions.splice(target.status?.conditions.indexOf(condition), 1);
      } else {
        target.status?.conditions.push(condition);
      }
    });
  }

  @command('ls', 'list the status of the current encounter')
  listEncounter() {
    return this.encounter.map(repr).join('\r\n');
  }

  @command('balance', 'check the balance of the current encounter')
  balance() {
    const encounterXP = this.encounter.reduce((sum, monster) => {
      if (monster.type === 'player') return sum;
      if (!monster.cr) return sum;
      if (monster.cr in Compendium.cr_to_xp) return sum + Compendium.cr_to_xp[monster.cr];
      return sum;
    }, 0);
    const playerLevels = this.encounter.filter(monster => monster.type === 'player').map(player => {
      if (typeof player.cr === 'string') {
        return parseInt(player.cr);
      }
      return player.cr;
    });
    const levels = [3, 2, 1, 0].map(index => {
      return playerLevels.reduce((sum, level) => {
        return sum + Compendium.encounter_difficulty[level][index];
      }, 0);
    });
    const difficultyLevel = levels.filter(xp => encounterXP > xp).length;
    const difficulty = ['deadly', 'hard', 'medium', 'easy', 'trivial'][4 - difficultyLevel];
    if (difficulty === 'deadly') {
      return 'deadly';
    }
    const xpToNextLevel = levels[3 - difficultyLevel] - encounterXP;
    return `${difficulty}: CR ${Compendium.xp_to_cr(xpToNextLevel)} to next level`;
  }

  @command('init', 'roll initiative')
  async rollInitiative() {
    for (const e of this.encounter) {
      if (!e.status) continue;
      if (e.dex === null) {
        e.status.initiative = NaN;
        continue;
      }
      e.status.initiative = roll(20) + Compendium.modifier(e.dex);
    }
    this.onChange();
    for (const e of this.encounter) {
      if (e.status && !e.status.initiative) {
        this.stdout?.write(`initiative for ${e.name}? `);
        if (!this.stdin) return;
        e.status.initiative = parseInt(await this.stdin.read());
        this.onChange();
        this.stdout?.write("\r\n");
      }
    }
    this.encounter.sort((a, b) => {
      return (b.status?.initiative || 0) - (a.status?.initiative || 0);
    });
  }

  @command('curr <i?: number>', 'set the current turn to index i, default: show the current turn')
  currTurn(i?: number) {
    if (this.encounter.length === 0) {
      return 'empty encounter';
    }
    if (i) {
      this.currentIndex = i - 1;
    }
    this.selected = this.encounter[this.currentIndex];
    return repr(this.encounter[this.currentIndex], this.currentIndex);
  }

  @command('next', 'advance turn to the next entity')
  nextTurn() {
    if (this.encounter.length === 0) {
      return 'empty encounter';
    }
    this.currentIndex++;
    this.currentIndex = this.currentIndex % this.encounter.length;
    this.selected = this.encounter[this.currentIndex];
    return this.currTurn();
  }

  @command('prev', 'rollback the turn by one entity')
  prevTurn() {
    if (this.encounter.length === 0) {
      return 'empty encounter';
    }
    this.currentIndex--;
    if (this.currentIndex === -1) {
      this.currentIndex = this.encounter.length - 1;
    }
    this.selected = this.encounter[this.currentIndex];
    return this.currTurn();
  }

  @command('dmg <targets: number[]> <points: number>', 'damage target')
  async dmg(targets: number[], points: number) {
    this.log?.write(`${JSON.stringify(targets)} ${points}\r\n`);
    for (const target of this.targets(targets)) {
      if (!target.status) {
        this.stdout?.write(`${target.name} has no status\r\n`);
        continue;
      }
      this.selected = target;
      let damage = points;
      if (target.vulnerable || target.resist || target.immune) {
        let multiplier = 1;
        if (target.vulnerable) {
          this.stdout?.write(`Vulnerable: ${target.vulnerable} (y/n)? `);
          if (await this.stdin?.read() === 'y') {
            multiplier = 2;
          }
          this.stdout?.write('\r\n');
        }
        if (target.resist) {
          this.stdout?.write(`Resist: ${target.resist} (y/n)? `);
          if (await this.stdin?.read() === 'y') {
            multiplier = 0.5;
          }
          this.stdout?.write('\r\n');
        }
        if (target.immune) {
          this.stdout?.write(`Immune: ${target.immune} (y/n)? `);
          if (await this.stdin?.read() === 'y') {
            multiplier = 0;
          }
          this.stdout?.write('\r\n');
        }
        damage = Math.floor(points * multiplier);
      }
      target.status.hp -= damage;
      target.status.damage.push({
        name: "",
        text: damage.toString(),
      });
      if (target.type !== 'player') {
        if (target.status?.hp <= Math.floor(target.status?.maxHP / 2)) {
          if (!target.status.conditions.includes('bloodied')) target.status.conditions.push('bloodied');
        } else {
          if (target.status.conditions.includes('bloodied')) target.status?.conditions.splice(target.status?.conditions.indexOf('bloodied'), 1);
        }
      }
      this.stdout?.write(`${target.name} took ${damage} points of damage\r\n`);
    }
  }

  @command('dc <dc: number> <attribute: string> <targets?: number[]>', 'roll a saving throw')
  save(dc: number, attribute: string, targets?: number[]) {
    attribute = attribute.toLowerCase();
    const attr = Compendium.abilities.find((a: string) => (a.toLowerCase().substring(0, 3) === attribute));
    if (!attr) {
      this.stderr?.write(`unknown attribute ${attribute}\r\n`);
      return;
    }
    if (!targets) {
      targets = [this.currentIndex + 1];
    }
    this.targets(targets).forEach((target) => {
      const targetAbility = (target as any)[attr.substring(0, 3).toLowerCase()];
      const savingThrow = roll(20, 1);
      const modifier = Compendium.modifier(targetAbility);
      const result = (savingThrow + modifier) >= dc ? 'passes' : 'fails';
      this.stdout?.write(`${target.name} rolls a ${savingThrow + modifier} (${savingThrow}+${modifier}) and ${result}\r\n`);
      target.status?.saves.push({
        name: attribute,
        text: result,
      });
    });
  }

  @command('use <action: number> <targets?: number[]>', 'perform actions')
  use(action: number, targets: number[] | undefined) {
    if (!targets || isNaN(targets[0])) {
      targets = [this.currentIndex + 1];
    }
    this.targets(targets).forEach((target) => {
      if (!target.action) return;
      let actions;
      if (target.action instanceof Array) {
        actions = target.action;
      } else {
        actions = [target.action];
      }
      const a = actions[action - 1];
      target.status?.actions.push(a);
      let texts = a.text;
      if (!(texts instanceof Array)) {
        texts = [texts];
      }
      this.stdout?.write(texts.join('\r\n'));
      this.stdout?.write("\r\n");
    });
  }

  @command('show <query: string>', 'show a card for the given item')
  show(query: string) {
    const results = this.search(query);
    if (results.length === 0) {
      return `no match found for ${query}`;
    }
    this.selected = results[0];
  }

  @command('monster <query: string>', 'search and show monsters')
  monster(query: string) {
    const results = this.search(query, ['monster']);
    if (results.length === 0) {
      return `no match found for ${query}`;
    }
    this.selected = results[0];
  }

  @command('spell <query: string>', 'search and show spells')
  spell(query: string) {
    const results = this.search(query, ['spell']);
    if (results.length === 0) {
      return `no match found for ${query}`;
    }
    this.selected = results[0];
  }

  @command('item <query: string>', 'search and show items')
  item(query: string) {
    const results = this.search(query, ['item']);
    if (results.length === 0) {
      return `no match found for ${query}`;
    }
    this.selected = results[0];
  }

  @command('roll <desc: string>', 'roll them bones')
  roll(desc: string) {
    const m = desc.match(/(\d+)d(\d+)[+]?(\d+)?/);
    if (m) {
      const n = parseInt(m[1]);
      const die = parseInt(m[2]);
      const bonus = parseInt(m[3]);
      this.stdout?.write(`${roll(die, n) + (bonus || 0)}\r\n`);
    }
  }

  @command('cast <name: string> <level?: number>', 'cast a spell')
  cast(name: string, level: number | undefined) {
    const curr = this.encounter[this.currentIndex];
    const match = curr.status?.spellSlots.map((slot, level) => {
      return slot.spells.map((spell) => {
        return {
          level: level,
          slot: slot,
          spell: spell,
          distance: Levenshtein.get(name.toLowerCase(), spell.name.toLowerCase()),
        }
      });
    }).flat().sort((a, b) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    })[0];
    if (!match) {
      return;
    }
    let slot = match.slot;
    if (level && curr.status?.spellSlots) {
      slot = curr.status?.spellSlots[level];
    }
    if (slot.slots <= 0) {
      return `${curr.name} has no more slots at level ${level || match.level}!`;
    }
    slot.slots -= 1;
    this.show(match.spell.name);
    return `${curr.name} casts ${match.spell.name} at level ${level || match.level}!`;
  }

  @command('debug', 'toggle debugging')
  toggleDebug() {
    if (this.log) {
      this.log = undefined;
    } else {
      this.log = this.stderr;
    }
    this.stdout?.write(`debug ${this.log ? 'on' : 'off'}\r\n`);
  }

  @command('poke <path: string> <value: string | number>', 'poke variables for debugging')
  poke(path: string, value: string | number) {
    let curr = this;
    const keys = path.split('.');
    for (let key of keys.slice(0, keys.length - 1)) {
      const match = Object.entries(curr).find(entry => entry[0] === key);
      if (!match) {
        throw new Error(`no match found at ${key}`);
      }
      curr = match[1];
    }
    (curr as any)[keys[keys.length - 1]] = value;
  }

}

export default GameState