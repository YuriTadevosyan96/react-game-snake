import React from 'react';
import { Icon, Grid, GridRow, GridColumn, Header } from 'semantic-ui-react';

const GameExplanation = () => {
  return (
    <>
      <Grid>
        <GridRow style={{ paddingBottom: 0 }}>
          <GridColumn textAlign="center">
            <Icon name="arrow alternate circle up outline" size="huge" color="grey" />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn textAlign="center">
            <Icon name="arrow alternate circle left outline" size="huge" color="grey" />
            <Icon name="arrow alternate circle down outline" size="huge" color="grey" />
            <Icon name="arrow alternate circle right outline" size="huge" color="grey" />
          </GridColumn>
        </GridRow>
      </Grid>
      <Header textAlign="center" as="h3" color="grey">
        Use arrow keys on keyboard to control the game
      </Header>
    </>
  );
};

export default GameExplanation;
