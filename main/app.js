import express from 'express';
import employeeRoutes from '../src/modules/employee/employee.routes.js'

const app = express();
app.use(express.json()); 

app.use('/api', employeeRoutes);


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
