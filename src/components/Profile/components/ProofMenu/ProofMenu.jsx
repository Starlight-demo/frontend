import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, Fab, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TabPanel } from './components/TabPanel';
import { NewProofModal } from './components/NewProofModal';
import { useNavigate } from 'react-router-dom';
import { DeleteProofModal } from './components/DeleteProofModal';
import { EditProofModal } from './components/EditProofModal/EditProofModal';
import { getOneTalentProofs } from '../../../../shared/service/TalentProfileService';
import { ProofsOneTalentContext } from '../../../../shared/context';
import { TabItem } from './components/TabItem';
import { CommitSharp } from '@mui/icons-material';
import { SkillAutocomplete } from '../../../ProofList/components/SkillAutocomplete';
import { getSkillProof } from '../../../../shared/service/TalentProfileService/TalentProfileService';
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const ProofMenu = ({ actionsAccess, talentId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  let query = new URLSearchParams(location.search);
  const [published, setPublished] = useState();
  const [updated, setUpdated] = useState(false);
  const [drafted, setDrafted] = useState([]);
  const [hiddened, setHiddened] = useState();
  const [expanded, setExpanded] = useState(false);
  const [newProofModalOpen, setNewProofModalOpen] = useState(false);
  const [proofId, setProofId] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [proofInfo, setProofInfo] = useState({});
  const [value, setValue] = useState(0);
  const [skill, setSkill] = useState(query.get('skill') || null);
  const [allSkills, setAllSkills] = useState([]);
  const handleChangeAcordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const findCurrentProofInfo = (proofId, status) => {
    return status.find((item) => item.id === proofId);
  };

  const openNewProofModal = () => {
    setNewProofModalOpen(() => true);
  };

  const handleCloseNewProofModal = () => {
    setNewProofModalOpen(() => false);
  };

  const handleChange = (event, newValue) => {
    setExpanded(false);
    setValue(newValue);
  };
  const getProofsByStatus = async (status, setStatus, value) => {
    await getOneTalentProofs(talentId, status)
      .then((proofs) => {
        setStatus(proofs.data);
        setValue(value);
      })
      .catch(function (error) {
        console.log(error);
        navigate('/404', { replace: true });
      });
  };
  const getProofBySkill = async (status, setStatus, skillid) => {
    await getSkillProof(talentId, status, skillid)
      .then((proofs) => {
        setStatus(proofs.data);
        //setValue(value);
      })
      .catch(function (error) {
        console.log(error);
        navigate('/404', { replace: true });
      });
  };
  const getSkilledProof = (newSkill) => {
    const url = query.get('status');
    if (url === 'draft') {
      getProofBySkill('DRAFT', setDrafted, newSkill.skill_id);
    } else if (url === 'hidden') {
      getProofBySkill('HIDDEN', setHiddened, newSkill.skill_id);
    } else {
      getProofBySkill('PUBLISHED', setPublished, newSkill.skill_id);
    }
  };
  useEffect(() => {
    const url = query.get('status');

    if (url === 'draft' && actionsAccess) {
      getProofsByStatus('DRAFT', setDrafted, 1);
    } else if (url === 'hidden' && actionsAccess) {
      getProofsByStatus('HIDDEN', setHiddened, 2);
    } else {
      getProofsByStatus('PUBLISHED', setPublished, 0);
    }

    setUpdated(false);
  }, [updated, location.search, talentId]);
  const resetSearchFunc = () => {
    const url = query.get('status');
    if (url === 'draft' && actionsAccess) {
      getProofsByStatus('DRAFT', setDrafted, 1);
    } else if (url === 'hidden' && actionsAccess) {
      getProofsByStatus('HIDDEN', setHiddened, 2);
    } else {
      getProofsByStatus('PUBLISHED', setPublished, 0);
    }
  };
  return (
    <ProofsOneTalentContext.Provider
      value={{
        setProofId,
        setOpenDeleteModal,
        setOpenEditModal,
        drafted,
        findCurrentProofInfo,
        setProofInfo,
        talentId,
        setUpdated,
        expanded,
        handleChangeAcordion,
        actionsAccess,
      }}
    >
      <Box
        sx={{
          width: '100%',
          mt: '40px',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '7px',
            backgroundColor: 'neutral.white',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
          },
        }}
      >
        <Box sx={{ pl: '10px', position: 'sticky', top: '0', right: '0', bgcolor: 'neutral.whiteGrey', zIndex: '3' }}>
          <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
            <Tab
              value={0}
              label="Published"
              sx={{ color: 'neutral.white' }}
              component={Link}
              to={`/profile/${talentId}?status=published`}
              onClick={() => getProofsByStatus('PUBLISHED', setPublished, 0)}
            />
            {actionsAccess && (
              <Tab
                label="Draft"
                sx={{ color: 'neutral.white' }}
                value={1}
                component={Link}
                to={`/profile/${talentId}?status=draft`}
                onClick={() => getProofsByStatus('DRAFT', setDrafted, 1)}
              />
            )}
            {actionsAccess && (
              <Tab
                label="Hidden"
                sx={{ color: 'neutral.white' }}
                value={2}
                component={Link}
                to={`/profile/${talentId}?status=hidden`}
                onClick={() => getProofsByStatus('HIDDEN', setHiddened, 2)}
              />
            )}
            {actionsAccess && (
              <Fab
                onClick={openNewProofModal}
                color="secondary"
                aria-label="add"
                sx={{ top: '0', right: '15px', position: 'absolute', width: '45px', height: '45px' }}
              >
                <AddIcon />
              </Fab>
            )}
          </Tabs>
          <Box sx={{ display: 'flex', position: 'absolute', top: '0', right: '75px', borderRadius: '5px' }}>
            <SkillAutocomplete
              width={'300px'}
              proofBySkill={getSkilledProof}
              setAllSkills={setAllSkills}
              skill={skill}
              setSkill={setSkill}
            />
            <Button variant="contained" sx={{ bgcolor: 'secondary.main' }} onClick={resetSearchFunc}>
              Reset
            </Button>
          </Box>
        </Box>

        <TabItem value={value} index={0} type={published}></TabItem>
        {actionsAccess && (
          <>
            <TabItem value={value} index={1} type={drafted}></TabItem>
            <TabItem value={value} index={2} type={hiddened}></TabItem>
          </>
        )}

        <NewProofModal open={newProofModalOpen} onClose={handleCloseNewProofModal} setUpdated={setUpdated} />
        <EditProofModal openEditModal={openEditModal} proofInfo={proofInfo} />
        <DeleteProofModal openDeleteModal={openDeleteModal} proofId={proofId} />
      </Box>
    </ProofsOneTalentContext.Provider>
  );
};
