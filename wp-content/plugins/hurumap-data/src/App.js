import React, { useEffect, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Formik, FieldArray } from 'formik';
import { Grid, Button } from '@material-ui/core';

// import AceEditor from "react-ace";

// import 'brace';
// import 'brace/mode/json';
// import 'brace/theme/github';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChartDefintion from './HurumapChart';
import { getCharts, updateChart } from './api';
import ChartsSection from './ChartsSection';
import propTypes from './propTypes';
import FlourishChart from './FlourishChart';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

TabPanel.propTypes = {
  children: propTypes.children.isRequired,
  index: propTypes.number.isRequired,
  value: propTypes.number.isRequired
};

function App() {
  const [value, setValue] = React.useState(0);
  const [hurumapCharts, setHurumapCharts] = useState([]);
  const [flourishCharts, setFlourishCharts] = useState([]);
  const [sections, setSections] = useState([]);
  const { data } = useQuery(gql`
    query {
      __schema {
        types {
          name
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }
  `);

  useEffect(() => {
    getCharts()
      .then(res => res.json())
      .then(res => {
        setHurumapCharts(res.hurumap);
        setFlourishCharts(res.flourish);
        setSections(res.sections);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ position: 'relative' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Hurumap Charts" {...a11yProps(0)} />
          <Tab label="Flourish Charts" {...a11yProps(1)} />
          <Tab label="Chart Sections" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Formik
          enableReinitialize
          initialValues={{ hurumapCharts }}
          render={form => (
            <form>
              <FieldArray name="hurumapCharts">
                {arrayHelper => (
                  <>
                    <Button
                      onClick={() =>
                        arrayHelper.insert(0, {
                          visual: '{"table":""}'
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    <Grid container spacing={1} direction="column">
                      {form.values.hurumapCharts.map(chart => (
                        <Grid item xs={12}>
                          <ChartDefintion
                            chart={chart}
                            data={data}
                            onChange={changes => {
                              arrayHelper.replace(
                                form.values.hurumapCharts.indexOf(chart),
                                Object.assign(chart, changes)
                              );
                              updateChart(chart.id, chart);
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </FieldArray>
            </form>
          )}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Formik
          enableReinitialize
          initialValues={{ flourishCharts }}
          render={form => (
            <form>
              <FieldArray name="flourishCharts">
                {arrayHelper => (
                  <>
                    <Button
                      onClick={() =>
                        arrayHelper.insert(0, {
                          file: '{"path":""}'
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    <Grid container>
                      {form.values.flourishCharts.map(chart => (
                        <Grid item xs={12}>
                          <FlourishChart
                            chart={chart}
                            onChange={changes => {
                              arrayHelper.replace(
                                form.values.flourishCharts.indexOf(chart),
                                Object.assign(chart, changes)
                              );
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </FieldArray>
            </form>
          )}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Formik
          enableReinitialize
          initialValues={{ sections }}
          render={form => (
            <form>
              <Button>Add Section</Button>
              <FieldArray name="sections">
                {() =>
                  form.values.sections.map(section => (
                    <Grid item xs={12} md={4}>
                      <ChartsSection section={section} />
                    </Grid>
                  ))
                }
              </FieldArray>
            </form>
          )}
        />
      </TabPanel>
      {/* <AceEditor
        enableLiveAutocompletion
        enableBasicAutocompletion
        theme="github"
        mode="json"
        name="1234"
        value={"{}"}
        editorProps={{ $blockScrolling: true }}
      /> */}
    </div>
  );
}

export default App;
