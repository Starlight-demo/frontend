import { useEffect, useState, useContext } from 'react';
import {
  Chip,
  IconButton,
  Popover,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Card,
  Avatar,
  Typography,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { getKudosProtected, getKudosPublic } from '../../../../../shared/service/KudosService/KudosService';
import { KudosGiveModal } from './components/KudosGiveModal/KudosGiveModal';
import { getOneSponsor } from '../../../../../shared/service/SponsorProfileService';
import { PersonContext } from '../../../../../shared/context';

export const Kudos = ({ proofId, isKudosBtnShowing = true, info }) => {
  const { person, setPerson } = useContext(PersonContext);
  const [kudos, setKudos] = useState(null);
  const [clickedKudos, setClickedKudos] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [kudosAmount, setKudosAmount] = useState(person?.unused_kudos);
  const [ownKudosses, setOwnKudosses] = useState(null);
  const [openKudosInfo, setOpenKudosInfo] = useState(false);

  const handeOpenModal = (e) => {
    if (!!isKudosBtnShowing) {
      e.stopPropagation();
      setOpenModal(true);
    } else {
      e.stopPropagation();
      if (info && info.length > 0) {
        setOpenKudosInfo(!openKudosInfo);
      } else {
        setAnchorEl(document);
      }
      setTimeout(() => setAnchorEl(null), 5000);
    }
  };

  useEffect(() => {
    if (!!isKudosBtnShowing) {
      getKudosProtected(proofId).then((kudos) => {
        setKudos(() => kudos);
        setOwnKudosses(() => kudos.kudos_from_me);
      });
      getOneSponsor(person.id).then((user) => {
        setKudosAmount(user.unused_kudos);
        setPerson({ ...person, unused_kudos: user.unused_kudos });
      });
    } else {
      getKudosPublic(proofId).then((kudos) => {
        setKudos(() => kudos);
        setOwnKudosses(() => kudos.kudos_from_me);
      });
    }
    setClickedKudos(false);
  }, [proofId, clickedKudos, person?.unused_kudos]);

  const message = (kudos) => {
    if (!!isKudosBtnShowing) {
      if (kudos.kudos_on_proof && kudos.kudos_from_me) {
        if (kudos.kudos_on_proof - kudos.kudos_from_me > 0) {
          return `${kudos.kudos_from_me} your stars and ${kudos.kudos_on_proof - kudos.kudos_from_me} others`;
        } else {
          return `${kudos.kudos_from_me} your stars only`;
        }
      } else if (kudos.kudos_on_proof && !kudos.kudos_from_me) {
        return `${kudos.kudos_on_proof} others stars`;
      } else {
        return 'No one donated stars to this proof yet';
      }
    } else {
      if (kudos.kudos_on_proof) {
        return `${kudos.kudos_on_proof} stars`;
      } else {
        return 'No one donated stars to this proof yet';
      }
    }
  };

  return (
    <>
      <Chip
        icon={
          <IconButton aria-label={kudos !== null ? kudos.kudos_on_proof : ''} sx={{ p: 0 }}>
            <Star sx={{ fontSize: 28, color: kudos?.is_kudosed ? 'secondary.main' : 'neutral.white' }} />
          </IconButton>
        }
        label={kudos && message(kudos)}
        sx={{
          bgcolor: 'neutral.whiteGrey',
          color: 'neutral.white',
          p: 0,
        }}
        clickable={!!isKudosBtnShowing}
        onClick={handeOpenModal}
      />

      {!isKudosBtnShowing && (
        <Popover
          id={'talantPopUp'}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Alert sx={{ fontSize: '16px' }} severity="warning">
            Only sponsors can donate stars to proofs!
          </Alert>
        </Popover>
      )}

      {!!isKudosBtnShowing && (
        <KudosGiveModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          setClickedKudos={setClickedKudos}
          proofId={proofId}
          kudosAmount={kudosAmount}
          kudosFromMe={ownKudosses}
        />
      )}
      {openKudosInfo && (
        <Dialog open={openKudosInfo} onClick={() => setOpenKudosInfo(!openKudosInfo)}>
          <DialogTitle variant="h5" sx={{ textAlign: 'center', px: 1 }}>
            This proof has kudos
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText
              sx={{
                mb: 1,
                overflowY: 'auto',
                maxHeight: '300px',
                '&::-webkit-scrollbar': {
                  width: '7px',
                  backgroundColor: 'neutral.white',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              {info.map((item) => {
                return (
                  <Card
                    sx={{
                      p: '10px',
                      minWidth: '250px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: '10px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {' '}
                      <Avatar
                        alt={person.full_name.trim().charAt(0).toUpperCase() + person.full_name.trim().slice(1)}
                        src={item.sponsor_avatar_url}
                      ></Avatar>
                      <Typography sx={{ ml: '15px' }}>{item.sponsor_name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>{item.count_kudos}</Typography>
                      <Star sx={{ fontSize: 28, color: 'secondary.main' }} />
                    </Box>
                  </Card>
                );
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpenKudosInfo(!openKudosInfo)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

