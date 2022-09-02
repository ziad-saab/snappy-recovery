import { Route, Routes } from 'react-router-dom';
import { Dashboard } from 'components/dashboard';
import { Home } from 'components/home';
import { Layout } from 'components/layout';
import { LoggedIn } from 'components/logged-in';
import { Setup } from 'components/setup';
import { HowItWorks } from 'components/how-it-works';
import { Recovery } from 'components/recovery';
import { Assist } from 'components/assist';
import { makeStyles } from '@mui/styles';
import { Profile } from 'components/profile';

const useStyles = makeStyles(() => ({
  '@global': {
    'html, body': {
      fontFamily: "'Roboto', Helvetica, Arial, sans-serif",
    },
    a: {
      color: 'inherit',
      '&.clean': {
        textDecoration: 'none',
      },
    },
  },
}));

export const App = () => {
  useStyles();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route element={<LoggedIn />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="setup" element={<Setup />} />
          <Route path="recovery" element={<Recovery />} />
          <Route path="assist" element={<Assist />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};
