import {
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  AccountBox,
  DesktopWindows,
  Group,
  HighlightOff,
  LiveTv,
  MusicVideo,
  PersonAddDisabled,
  Timelapse,
  Videocam,
} from '@material-ui/icons';
import apis from 'app/api';
import Layout from 'app/components/Layout';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BLUE, GREEN, ORANGE, YELLOW } from 'utils/constant/color';
import LineGraph from '../../components/Charts/Linechart/index';
import useStyles from './styles';
import DRMWaitListTable from 'app/components/DrmWaitlistTable';


const data_month_wise = [
  { name: 'JAN', au: 4, du: 2 },
  { name: 'FEB', au: 6, du: 2 },
  { name: 'MAR', au: 1, du: 5 },
  { name: 'API', au: 10, du: 3 },
  { name: 'MAY', au: 7, du: 1 },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Dashboard() {
  const classes = useStyles();
  const [totalUser, setTotalUser] = useState(0);
  const [active_cus, setActive_cus] = useState(0);
  const [deac_cus, setDeac_cus] = useState(0);
  const [sus_cus, setSus_cus] = useState(0);
  const [black_cus, setBlack_cus] = useState(0);
  const [total_cha, setTotal_cha] = useState(0);
  const [vod, setVod] = useState(0);
  const [mod, setMod] = useState(0);
  const [sod, setSod] = useState(0);
  const [ViewSystemUptime, setViewSystemUptime] = useState([]);

  const Role = localStorage.getItem("roles")

  const data = [
    { name: 'Total Users', user: totalUser },
    { name: 'Active Users', user: active_cus },
    { name: 'Deactive Users', user: deac_cus },
    { name: 'Suspended Customer', user: sus_cus },
    { name: 'BlackListed Customer', user: black_cus },
  ];
  const data_pie = [
    { name: 'Total Channel', value: total_cha },
    { name: 'VOD', value: vod },
    { name: 'SOD', value: sod },
    { name: 'MOD', value: mod },
  ];
  const COLORS = [GREEN, BLUE, ORANGE, YELLOW];
  const handleGetData = () => {
    apis.getDashboard().then(res => {
      const kpis = res.data.kpi;
      kpis.forEach(function (kpi) {
        if (kpi.type === 'active_customers') {
          setActive_cus(kpi.count);
        } else if (kpi.type === 'total_customers') {
          setTotalUser(kpi.count);
        } else if (kpi.type === 'deactive_customers') {
          setDeac_cus(kpi.count);
        } else if (kpi.type === 'suspend_customers') {
          setSus_cus(kpi.count);
        } else if (kpi.type === 'blacklist_customers') {
          setBlack_cus(kpi.count);
        } else if (kpi.type === 'total_channels') {
          setTotal_cha(kpi.count);
        } else if (kpi.type === 'total_vod') {
          setVod(kpi.count);
        } else if (kpi.type === 'total_mod') {
          setMod(kpi.count);
        } else if (kpi.type === 'total_sod') {
          setSod(kpi.count);
        }
      });
    });
  };
  useEffect(() => {
    handleGetData();
  }, []);

  const column = [
    { field: 'uptime', title: 'Uptime' },
    { field: 'uptimesec', title: 'Uptime Sec' },
  ];

  const getViewSystemUptime = () => {
    try {
      apis.getViewSystemUptime().then(res => {
        console.log('hii', res)
        // console.log('hii2',res?.uptime)
        // console.log('hii3',res?.uptimesec)
        setViewSystemUptime(res);
      });
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };


  useEffect(() => {
    getViewSystemUptime();
  }, []);

  return (
    <Layout>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        {Role === 'admin' && (
          <div className={classes.paper_main}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5" className={classes.title}>
                  Dashboard
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <BarChart
                      width={800}
                      height={350}
                      data={data}
                      margin={{
                        top: 25,
                        right: 10,
                        left: 1,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="user" fill={GREEN} />
                    </BarChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Group fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {totalUser}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <AccountBox fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Active User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {active_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <PersonAddDisabled fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Deactivated User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {deac_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <Timelapse fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Suspended Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {sus_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: '#c6cfcf',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <HighlightOff fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Black Listed Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {black_cus}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        Active User vs Deactive User (Month Wise)
                      </Typography>
                    </div>
                    <LineChart
                      width={1100}
                      height={300}
                      data={data_month_wise}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="du"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                        strokeWidth=" 10"
                      />
                      <Line
                        type="monotone"
                        dataKey="au"
                        stroke="#0088FE"
                        strokeWidth=" 10"
                      />
                    </LineChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        VOD ,SOD ,MOD ,Total Channels
                      </Typography>
                    </div>
                    <div style={{ marginTop: -50, marginBottom: 10 }}>
                      <PieChart width={400} height={350}>
                        <Pie
                          data={data_pie}
                          cx={200}
                          cy={200}
                          labelLine={true}
                          label={renderCustomizedLabel}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={8}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <LiveTv fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total Channels{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {total_cha}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Videocam fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        VOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {vod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <DesktopWindows fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        SOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {sod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <MusicVideo fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Music On Demand
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {mod}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <div style={{ margin: 10, backgroundColor: BLUE }}>
                  <Typography
                    component="p"
                    variant="h6"
                    style={{ textAlign: 'center' }}
                  >
                    {' '}
                    View System Uptime
                  </Typography>
                </div>
                <DRMWaitListTable
                  title={'View System Uptime'}
                  columns={column}
                  data={ViewSystemUptime}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <LineGraph />
                  </Paper>
                </ResponsiveContainer>
              </Grid> */}

              <Grid item xs={12}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                ></Paper>
              </Grid>
            </Grid>
          </div>
        )}

        {Role === 'SmsUser' && (
          <div className={classes.paper_main}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5" className={classes.title}>
                  Dashboard
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <BarChart
                      width={800}
                      height={350}
                      data={data}
                      margin={{
                        top: 25,
                        right: 10,
                        left: 1,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="user" fill={GREEN} />
                    </BarChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Group fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {totalUser}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <AccountBox fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Active User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {active_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <PersonAddDisabled fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Deactivated User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {deac_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <Timelapse fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Suspended Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {sus_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: '#c6cfcf',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <HighlightOff fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Black Listed Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {black_cus}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        Active User vs Deactive User (Month Wise)
                      </Typography>
                    </div>
                    <LineChart
                      width={1100}
                      height={300}
                      data={data_month_wise}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="du"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                        strokeWidth=" 10"
                      />
                      <Line
                        type="monotone"
                        dataKey="au"
                        stroke="#0088FE"
                        strokeWidth=" 10"
                      />
                    </LineChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        VOD ,SOD ,MOD ,Total Channels
                      </Typography>
                    </div>
                    <div style={{ marginTop: -50, marginBottom: 10 }}>
                      <PieChart width={400} height={350}>
                        <Pie
                          data={data_pie}
                          cx={200}
                          cy={200}
                          labelLine={true}
                          label={renderCustomizedLabel}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={8}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <LiveTv fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total Channels{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {total_cha}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Videocam fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        VOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {vod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <DesktopWindows fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        SOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {sod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <MusicVideo fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Music On Demand
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {mod}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <LineGraph />
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                ></Paper>
              </Grid>
            </Grid>
          </div>
        )}

        {Role === 'audit' && (
          <div className={classes.paper_main}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5" className={classes.title}>
                  Dashboard
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <BarChart
                      width={800}
                      height={350}
                      data={data}
                      margin={{
                        top: 25,
                        right: 10,
                        left: 1,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="user" fill={GREEN} />
                    </BarChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Group fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {totalUser}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <AccountBox fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Active User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {active_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <PersonAddDisabled fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Deactivated User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {deac_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <Timelapse fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Suspended Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {sus_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: '#c6cfcf',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <HighlightOff fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Black Listed Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {black_cus}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        Active User vs Deactive User (Month Wise)
                      </Typography>
                    </div>
                    <LineChart
                      width={1100}
                      height={300}
                      data={data_month_wise}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="du"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                        strokeWidth=" 10"
                      />
                      <Line
                        type="monotone"
                        dataKey="au"
                        stroke="#0088FE"
                        strokeWidth=" 10"
                      />
                    </LineChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        VOD ,SOD ,MOD ,Total Channels
                      </Typography>
                    </div>
                    <div style={{ marginTop: -50, marginBottom: 10 }}>
                      <PieChart width={400} height={350}>
                        <Pie
                          data={data_pie}
                          cx={200}
                          cy={200}
                          labelLine={true}
                          label={renderCustomizedLabel}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={8}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <LiveTv fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total Channels{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {total_cha}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Videocam fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        VOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {vod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <DesktopWindows fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        SOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {sod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <MusicVideo fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Music On Demand
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {mod}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <LineGraph />
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                ></Paper>
              </Grid>
            </Grid>
          </div>
        )}

        {Role === 'mso' && (
          <div className={classes.paper_main}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5" className={classes.title}>
                  Dashboard
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <BarChart
                      width={800}
                      height={350}
                      data={data}
                      margin={{
                        top: 25,
                        right: 10,
                        left: 1,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="user" fill={GREEN} />
                    </BarChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Group fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {totalUser}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <AccountBox fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Active User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {active_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <PersonAddDisabled fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Deactivated User{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {deac_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <Timelapse fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Suspended Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {sus_cus}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: '#c6cfcf',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 8,
                    }}
                  >
                    <div>
                      <HighlightOff fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Black Listed Customer
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h4">
                        {' '}
                        {black_cus}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        Active User vs Deactive User (Month Wise)
                      </Typography>
                    </div>
                    <LineChart
                      width={1100}
                      height={300}
                      data={data_month_wise}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="du"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                        strokeWidth=" 10"
                      />
                      <Line
                        type="monotone"
                        dataKey="au"
                        stroke="#0088FE"
                        strokeWidth=" 10"
                      />
                    </LineChart>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={4}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <div style={{ margin: 10, backgroundColor: BLUE }}>
                      <Typography
                        component="p"
                        variant="h6"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        VOD ,SOD ,MOD ,Total Channels
                      </Typography>
                    </div>
                    <div style={{ marginTop: -50, marginBottom: 10 }}>
                      <PieChart width={400} height={350}>
                        <Pie
                          data={data_pie}
                          cx={200}
                          cy={200}
                          labelLine={true}
                          label={renderCustomizedLabel}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={8}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: GREEN,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <LiveTv fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        Total Channels{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {total_cha}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: BLUE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <Videocam fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        VOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {vod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: YELLOW,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <DesktopWindows fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        {' '}
                        SOD{' '}
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {sod}{' '}
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      margin: 5,
                      flexDirection: 'row',
                      backgroundColor: ORANGE,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <div>
                      <MusicVideo fontSize="large" />
                    </div>
                    <div>
                      <Typography component="p" variant="h6">
                        Music On Demand
                      </Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h3">
                        {' '}
                        {mod}{' '}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <ResponsiveContainer width="100%" height="100%">
                  <Paper className={classes.paper}>
                    <LineGraph />
                  </Paper>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: '#a4b1b5' }}
                ></Paper>
              </Grid>
            </Grid>
          </div>
        )}

      </Container>
    </Layout>
  );
}

export default Dashboard;
