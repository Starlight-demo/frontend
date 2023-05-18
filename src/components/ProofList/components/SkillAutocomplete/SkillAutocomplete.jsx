import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import { getAllSkills } from '../../../../shared/service/SkillService';
import { useLocation, useNavigate } from 'react-router-dom';

export const SkillAutocomplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let query = new URLSearchParams(location.search);
  const skip = 0;
  const limit = 1000;
  const [filter, setFilter] = useState(query.get('filter') || '');
  // const [skill, setSkill] = useState(query.get('skill') || '');
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllSkills(skip, limit, filter)
      .then((response) => {
        const skills = response.data.map((item) => item.skill);
        setData(skills);
      })
      .catch(function (error) {
        console.log(error);
        navigate('/404', { replace: true });
      });
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(() => event.target.value);
    let searchParams = new URLSearchParams(location.search);
    searchParams.set('filter', filter);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  // const handleClearFilter = (event, value) => {
  //   console.log(event, value);
  // setFilter(() => '');
  // let searchParams = new URLSearchParams(location.search);
  // searchParams.set('filter', filter);
  // navigate(`${location.pathname}?${searchParams.toString()}`);
  // };

  // const handleSelectOption = (event, value) => {
  //   console.log(value)
  //   setSkill(() => value);
  //   let searchParams = new URLSearchParams(location.search);
  //   searchParams.set('skill', skill);
  //   navigate(`${location.pathname}?${searchParams.toString()}`);
  // };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={data}
      size="small"
      getOptionLabel={(option) => option}
      sx={{ width: 300, mr: '16px' }}
      // onClear={handleFilterChange}
      // onChange={handleSelectOption}
      renderInput={(params) => (
        <Paper>
          <TextField
            {...params}
            // sx={{ color: 'neutral.white', bgcolor: 'neutral.whiteGrey' }}
            label="Filter"
            variant="filled"
            value={filter}
            onChange={handleFilterChange}
            // onInputChange={handleClearFilter}
          />
        </Paper>
      )}
    />
  );
};
