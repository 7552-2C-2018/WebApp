import React from 'react';
const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } = require('recharts');

const Chart = props => {
  const { title, data, xKey, yKey } = props;
  return (
    <div className="col-md-12">
      <h1>{title}</h1>
      <AreaChart width={600} height={400} data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Area type='monotone' dataKey={yKey} stroke='#8884d8' fill='#8884d8' />
      </AreaChart>
    </div>
  );
}

export default Chart;