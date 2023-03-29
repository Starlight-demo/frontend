import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { getAllTalents } from '../../shared/service/ProfileService';
import { SmallTalentCard } from '../SmallTalentCard';
import { PaginationCustom } from './components/PaginationCustom';
import { PreLoaderUser } from './components/PreLoadUser';

export const TalentList = () => {
  const [talents, setTalents] = useState([]);

  const items = talents.map((item, index) => {
    return (
      <Grid sx={{ minHeight: '255px' }} item xs={1} key={index}>
        <SmallTalentCard talentName={item.full_name} position={item.position} avatar={item.avatar} />
      </Grid>
    );
  });

  return (
    <Box sx={{ flexGrow: 1, m: '25px auto', p: '0 25px' }}>
      <Grid container spacing={3} columns={5} sx={{ alignItems: 'stretch' }}>
        {items.length != 0 ? items : <PreLoaderUser />}
      </Grid>
      <PaginationCustom setHook={setTalents} queryFunction={getAllTalents} />
    </Box>
  );
};