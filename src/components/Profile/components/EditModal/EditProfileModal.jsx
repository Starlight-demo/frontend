import { useState } from 'react';
import * as yup from 'yup';
import { FullNameField } from '../../../../shared/components/Fields/FullNameField';
import { Form } from '../../../../shared/components/Form';
import { BirthdayField } from '../../../../shared/components/Fields/AgeField';
import { AvatarLinkField } from '../../../../shared/components/Fields/AvatarLinkField';
import { EducationField } from '../../../../shared/components/Fields/EducationField';
import { ExperienceField } from '../../../../shared/components/Fields/ExperienceField';
import { patchTalentProfile } from '../../../../shared/service/TalentProfileService';
import { getCurrentPersonId } from '../../../../shared/service/AuthorizationService';
import { postOneTalentSkill } from '../../../../shared/service/TalentProfileService/TalentProfileService';
import { PositionField } from '../../../../shared/components/Fields/PositionField';
import { Button, Dialog, DialogContent, DialogTitle, Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Chip, Stack } from '@mui/material';
import { SkillAutocomplete } from '../../../ProofList/components/SkillAutocomplete';
import { useEffect } from 'react';
export const EditProfileModal = ({
  open,
  onClose,
  person: talent,
  setPerson: setTalent,
  skill,
  updatedSkill,
  setUpdatedSkill,
}) => {
  const [allSkills, setAllSkills] = useState([]);
  const [skillListShow, setSkillListShow] = useState(false);
  const [profileSkill, setProfileSkill] = useState('');
  const [usedSkills, setUsedSkills] = useState([]);

  useEffect(() => {
    setUsedSkills(skill?.skill);
  }, [skill]);

  const onEditProfileHandler = (action) => {
    let talentId = getCurrentPersonId();
    return async (values) => {
      values = handleSubmitPositions(values);
      const talentNewProfile = {};
      Object.entries(values).map(([key, value]) => {
        if (values[key] !== '') {
          talentNewProfile[key] = values[key];
        }
      });
      if (Object.keys(talentNewProfile).length === 0) {
        onClose();
      } else {
        try {
          const response = await action(talentNewProfile, talentId);
          response.id = talentId;
          setTalent(response);
          const resp = await postOneTalentSkill(talentId, { skills: [profileSkill] });
          setProfileSkill(null);
          setUpdatedSkill(!updatedSkill);
        } catch (error) {
          console.error(error);
        }
        onClose();
      }
    };
  };

  const handleSubmitPositions = (values) => {
    const positions = Array.isArray(values.positions)
      ? values.positions.map((position) => position.trim())
      : values.positions
          .trim()
          .split(',')
          .map((position) => position.trim())
          .filter((position) => position !== '');
    return { ...values, positions };
  };

  const editForm = {
    id: 'edit-modal',
    submitBtnName: 'Accept',
    title: 'You can edit your profile',
    onSubmit: onEditProfileHandler(patchTalentProfile),
    initialValues: {
      full_name: talent.full_name,
      avatar: talent.avatar,
      birthday: talent.birthday,
      education: talent.education,
      experience: talent.experience,
      positions: talent.positions.toString(),
    },
    validationSchema: yup.object({
      full_name: yup
        .string()
        .min(4, 'Full name must be more than 4 characters')
        .max(64, 'Full name must be less than 64 characters')
        .matches(/^[A-Za-z\s'-]+$/, 'Full name must not contain symbols or numbers')
        .required('Full name is required'),
      avatar: yup.string().url('Avatar must be a valid url').nullable(),
      birthday: yup
        .string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Enter the date in the format YYYY-MM-DD')
        .nullable(),
      education: yup
        .string()
        .min(2, 'Education must be at least 2 characters')
        .max(50, 'Education must be at most 50 characters')
        .nullable(),
      experience: yup
        .string()
        .min(2, 'Experience must be at least 2 characters')
        .max(50, 'Experience must be at most 50 characters')
        .nullable(),
      positions: yup
        .string()
        .test('valid-positions', 'Positions must contain only comma-separated positions', (value) => {
          if (!value) return true;

          const words = value.split(',').map((word) => word.trim());
          return words.every((word) => /^[a-zA-Zа-яА-Я0-9\s]+$/.test(word));
        })
        .nullable(),
    }),
    fieldsRenderers: {
      full_name: FullNameField,
      avatar: AvatarLinkField,
      education: EducationField,
      experience: ExperienceField,
      positions: PositionField,
      birthday: BirthdayField,
    },
  };

  const addProfileSkill = (newSkill) => {
    setSkillListShow(!skillListShow);
    setProfileSkill(newSkill);
    setUsedSkills((prev) => [...prev, newSkill]);
  };

  const handleModalClose = () => {
    setProfileSkill('');
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      aria-labelledby="contained-Dialog-title-vcenter"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, bgcolor: 'neutral.white', py: 0 },
      }}
    >
      <DialogTitle id="contained-Dialog-title-vcenter">{editForm.title}</DialogTitle>
      <DialogContent>
        <Form {...editForm}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', mt: '10px', display: 'flex' }}>
              {!skill ? (
                <>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Choose your skill</Typography>
                    <IconButton aria-label="addSkill" onClick={() => setSkillListShow(!skillListShow)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Stack display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" mb="15px">
                  {skill?.skill.map((item, i) => {
                    return <Chip key={i} label={item.skill} variant="outlined" sx={{ m: '5px' }} />;
                  })}
                  {profileSkill && <Chip label={profileSkill} variant="outlined" sx={{ m: '5px' }} />}
                  <IconButton aria-label="addSkill">
                    <AddIcon onClick={() => setSkillListShow(!skillListShow)} />
                  </IconButton>
                </Stack>
              )}
            </Box>
            {skillListShow && (
              <SkillAutocomplete
                handleAddSkill={addProfileSkill}
                setAllSkills={setAllSkills}
                usedSkills={usedSkills}
              ></SkillAutocomplete>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <Button variant="outlined" onClick={handleModalClose} sx={{ mt: 4, px: 8, borderRadius: '6px' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 4, px: 8, borderRadius: '6px' }}
            >
              {editForm.submitBtnName}
            </Button>
          </Box>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
