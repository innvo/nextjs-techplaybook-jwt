import * as React from 'react';
import {
  styled,
  Tabs,
  Tooltip,
  Tab,
  CardActionArea,
  CardContent,
  Grid,
  Avatar,
  Box,
  Autocomplete,
  TextField,
  Chip,
  Divider,
  Typography,
  Card,
  LinearProgress,
  Zoom
} from '@mui/material';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (

    <Grid item xs={12}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Item One" {...tabProps(0)} />
        <Tab label="Item Two" {...tabProps(1)} />
        <Tab label="Item Three" {...tabProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel><TabPanel value={value} index={1}>
        Item Two
      </TabPanel><TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Grid>

  );
}
