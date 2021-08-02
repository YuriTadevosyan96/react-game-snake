import React from 'react';
import { Button, Grid, GridRow, GridColumn } from 'semantic-ui-react';

const StartOrRestartGame = ({ handler, isStart }) => {
  return (
    <Grid>
      <GridRow>
        <GridColumn textAlign="center">
          <Button size="huge" onClick={handler}>
            {isStart ? 'Start Game' : 'Restart Game'}
          </Button>
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

export default StartOrRestartGame;
