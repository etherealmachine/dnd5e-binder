import React from 'react';
import styled from 'styled-components';

import Shell from '../Shell';
import MonsterCard from '../cards/MonsterCard';
import SpellCard from '../cards/SpellCard';
import ItemCard from '../cards/ItemCard';
import GameState from '../GameState';

const Root = styled.div`
  height: 100%;
  .top-panel {
  height: 60%;
  display: flex;
  flex-direction: row;
  overflow: scroll;
  }
  .top-panel .table {
  width: 60%;
  margin: 15px;
  border-collapse: collapse;
  }
  .top-panel .table tr {
  border-bottom: 1px solid #888;
  }
  .top-panel .table td {
  padding: 1vh;
  font-size: 1.5vh;
  }
  .top-panel .card-container {
  width: 40%;
  margin: 15px;
  }
  .shell-container {
  height: 40%;
  }
  .highlight {
  background-color: #a1e3ff;
  }
`;

export default function EncounterTab(props: { game: GameState }) {
  const selection = props.game.selected || props.game.encounter[props.game.currentIndex];
  const rows = props.game.encounter.map((e, index) => <tr
    key={index}
    className={index === props.game.currentIndex ? 'highlight' : ''}
    onClick={() => { props.game.currentIndex = index; props.game.onChange() }}
  >
    <td align="left">{index + 1}</td>
    <td align="center">{e.name}</td>
    <td align="right">{e.cr}</td>
    <td align="right">{e.status?.initiative}</td>
    <td align="right">{e.status?.hp || ''}</td>
    <td align="right">{e.ac || ''}</td>
    <td align="right">{e.status?.conditions.join(',') || ''}</td>
  </tr>);
  return (<Root>
    <div className="top-panel">
      <table className="table" aria-label="encounter">
        <thead>
          <tr>
            <td align="left"></td>
            <td>Name</td>
            <td align="right">CR</td>
            <td align="right">Initiative</td>
            <td align="right">HP</td>
            <td align="right">AC</td>
            <td align="right">Conditions</td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <div className="card-container">
        {selection && selection.kind === 'monster' && <MonsterCard monster={selection} />}
        {selection && selection.kind === 'spell' && <SpellCard spell={selection} />}
        {selection && selection.kind === 'item' && <ItemCard item={selection} />}
      </div>
    </div>
    <div className="shell-container">
      <Shell program={props.game} />
    </div>
  </Root>);
}
