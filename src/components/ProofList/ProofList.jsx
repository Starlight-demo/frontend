import { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, Button, Stack } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Wrapper } from '../Wrapper';
import { ProofItem } from '../../shared/components/ProofItem';
import { ProofDescription } from '../../shared/components/ProofDescription';
import { PaginationCustom } from '../Home/components/TalentList/components/PaginationCustom';
import { getAllProofs } from '../../shared/service/ProofService';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { Kudos } from '../Profile/components/ProofMenu/Kudos';
import { SkillAutocomplete } from './components/SkillAutocomplete';
import { SkillList } from '../Profile/components/ProofMenu/components/SkillList/SkillList';
import { TimerComponent } from './components/TimerComponent/TimerComponent';
import { getCurrentPersonRole } from '../../shared/service/AuthorizationService/AuthorizationService';

export const ProofList = () => {
  const personRole = getCurrentPersonRole();
  const navigate = useNavigate();
  const location = useLocation();
  let query = new URLSearchParams(location.search);
  const [sort, setSort] = useState(query.get('sort') || true);
  const [proofs, setProofs] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [skill, setSkill] = useState(query.get('skill') || null);

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSortClick = () => {
    setSort(!sort);
    let searchParams = new URLSearchParams(location.search);
    searchParams.set('sort', !sort);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const filteredObjects = skill
    ? proofs.filter((item) => item.skill_with_category_list.some((skillObj) => skillObj.skill === skill))
    : proofs;

  const items = filteredObjects.map((item, i) => {
    return (
      <Box key={item.id} sx={{ bgcolor: 'neutral.whiteGrey' }}>
        <Typography variant="h5" sx={{ p: '10px', color: 'neutral.white' }}>
          {item.title}
          <Typography variant="subtitle1" sx={{ mt: '10px', color: 'secondary.main' }}>
            {format(new Date(item.date_created), 'dd.MM.yyyy HH:mm')}
          </Typography>
        </Typography>
        <Accordion
          expanded={expanded === `panel${i}`}
          onChange={handleChangeAccordion(`panel${i}`)}
          sx={{ mb: '30px', mx: '5px', py: '5px', bgcolor: 'primary.main' }}
        >
          <AccordionSummary
            sx={{ bgcolor: 'primary.main', color: 'neutral.white' }}
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls={`panel${i}bh-content`}
            id={`panel${i}bh-header`}
          >
            <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
              <ProofItem description={item.description} />
              <SkillList proofItem={item.skill_with_category_list} />
              <Kudos proofId={item.id} isKudosBtnShowing={personRole === 'ROLE_SPONSOR' ? true : false} />
            </Stack>
          </AccordionSummary>
          <ProofDescription description={item.description} />
        </Accordion>
      </Box>
    );
  });

  return (
    <Wrapper>
      <Box sx={{ mt: '56px', p: '0 10px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '16px' }}>
          <SkillAutocomplete width={'300px'} skill={skill} setSkill={setSkill} />
          <Button variant="contained" color="secondary" onClick={handleSortClick}>
            Sort by Date {sort ? <ArrowDropUp /> : <ArrowDropDown />}
          </Button>
        </Box>
        {items.length === 0 ? <TimerComponent /> : items}
        {skill !== null ? (
          <PaginationCustom size={1000} sort={sort} setHook={setProofs} queryFunction={getAllProofs} />
        ) : (
          <PaginationCustom size={8} sort={sort} setHook={setProofs} queryFunction={getAllProofs} />
        )}
      </Box>
    </Wrapper>
  );
};
