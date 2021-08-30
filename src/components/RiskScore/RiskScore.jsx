import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Radar } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
import { useEffect, useState } from "react";
import axios from "axios";

const newData = {
  labels: [
    "Hospitals",
    "Fire Stations",
    "Law Enforcement",
    "Urgent Care Facilities",
    "Waste Landfills",
  ],
  datasets: [
    {
      label: "Risk Distribution Based on Parameters",
      data: [],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

const options = {
  scale: {
    ticks: { beginAtZero: true },
  },
};

const RiskScore = ({ property }) => {
  const [score, setScore] = useState("0.0");

  useEffect(() => {
    if (property) {
      const payload = {
        method: "POST",
        data: {
          city: property.city,
          state: property.state,
          county: property.county,
          address: property.address,
          zip: property.zip,
        },
      };
      axios.post("http://localhost:9091/risk", payload).then(({ data }) => {
        if (data) {
          const {
            riskScore,
            riskDistribution: { FIRE_STATION, HOSPITAL },
          } = data;
          var randoms = [...Array(3)].map(() => Math.floor(Math.random() * 9));
          newData.datasets[0].data = [HOSPITAL, FIRE_STATION, ...randoms];
          setScore(riskScore);
        }
      });
    }
  }, [property]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-evenly"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Risk Distribution
            </Typography>
            <Radar data={newData} options={options} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Risk Score
            </Typography>
            <Typography variant="h1">{score}</Typography>
            <GaugeChart
              id="gauge-chart5"
              nrOfLevels={20}
              arcsLength={[0.3, 0.5, 0.2]}
              colors={["#EA4228", "#F5CD19", "#5BE12C"]}
              percent={(parseInt(score) / 10) * 100}
              arcPadding={0.02}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RiskScore;
