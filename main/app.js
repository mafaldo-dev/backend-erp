import express from 'express';
import employeeRoutes from '../src/modules/employee/employee.routes.js'
import productRoutes from '../src/modules/products/products.routes.js'
import customerRoutes from '../src/modules/customer/customer.routes.js'


const app = express();
app.use(express.json()); 

app.use('/api', employeeRoutes);
app.use('/api', productRoutes)
app.use('/api', customerRoutes)


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
